import * as path from 'path';
import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Express } from 'express';
import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadToAwsProvider {
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    // Correct key for AWS S3 Bucket Name
    this.bucketName = this.configService.get<string>('AWS_PUBLIC_BUCKET_NAME');

    // Debugging logs
    // console.log('🚀 AWS Bucket Name (process.env):', process.env.AWS_PUBLIC_BUCKET_NAME);
    // console.log('🚀 AWS Bucket Name (ConfigService):', this.bucketName);

    if (!this.bucketName) {
      throw new Error(
        '❌ AWS Bucket Name is undefined! Check .env file and ConfigService.',
      );
    }
  }

  public async fileupload(file: Express.Multer.File): Promise<string> {
    const s3 = new S3({
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get<string>('AWS_REGION'),
    });
    try {
      const uploadResult = await s3
        .upload({
          Bucket: this.bucketName,
          Body: file.buffer,
          Key: this.generateFileName(file),
          ContentType: file.mimetype,
          //   ACL: 'public-read', // Make file publicly accessible
        })
        .promise();

      console.log('✅ File uploaded successfully to:', uploadResult.Location);

      return uploadResult.Key;
    } catch (error) {
      console.error('❌ AWS S3 Upload Error:', error);

      if (error.code === 'NoSuchBucket') {
        throw new Error(
          '❌ The specified AWS S3 bucket does not exist. Check AWS_PUBLIC_BUCKET_NAME.',
        );
      } else if (error.code === 'InvalidAccessKeyId') {
        throw new Error(
          '❌ Invalid AWS Access Key ID. Check AWS_ACCESS_KEY_ID.',
        );
      } else if (error.code === 'SignatureDoesNotMatch') {
        throw new Error(
          '❌ AWS Secret Access Key is incorrect. Check AWS_SECRET_ACCESS_KEY.',
        );
      } else {
        throw new RequestTimeoutException(
          `AWS S3 Upload Error: ${error.message}`,
        );
      }
    }
  }

  private generateFileName(file: Express.Multer.File): string {
    let name = file.originalname.split('.')[0];
    name = name.replace(/\s/g, '').trim(); // Remove spaces
    let extension = path.extname(file.originalname);
    let timeStamp = Date.now().toString();
    return `${name}-${timeStamp}-${uuidv4()}${extension}`;
  }
}
