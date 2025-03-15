import { ConfigService } from '@nestjs/config';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Upload } from 'src/infrastructure/data-access/entities/question_management/upload.entity';
import { fileTypes } from 'src/infrastructure/helpers/file_types.enum';
import { UploadToAwsProvider } from './uploadAWS.provider';
import { UploadFile } from 'src/infrastructure/helpers/upload_file.interface';

@Injectable()
export class UploadsService {
  private readonly cloudFrontUrl: string;

  constructor(
    /**
     * Inject uploadToAwsProvider
     */
    private readonly uploadToAwsProvider: UploadToAwsProvider,
    /**
     * inject configService
     */
    private readonly configService: ConfigService,
    /**
     * inject uploadsRepository
     */
    @InjectRepository(Upload)
    private uploadsRepository: Repository<Upload>,
  ) {
    this.cloudFrontUrl = this.configService.get<string>('AWS_CLOUDFRONT_URL');

    // Debugging log to verify the CloudFront URL is correctly loaded
    // console.log('AWS CloudFront URL:', this.cloudFrontUrl);

    if (!this.cloudFrontUrl) {
      throw new Error(
        '❌ AWS_CLOUDFRONT_URL is undefined! Check your .env file.',
      );
    }
  }

  public async uploadFile(file: Express.Multer.File): Promise<Upload> {
    if (!file) {
      throw new BadRequestException('❌ No file provided.');
    }

    // console.log('📂 File Details Before Saving:', {
    //   originalname: file.originalname,
    //   mimetype: file.mimetype,
    //   size: file.size,
    // });

    try {
      // ✅ Upload to AWS S3
      const filePath = await this.uploadToAwsProvider.fileupload(file);
      if (!filePath) {
        throw new ConflictException(
          '❌ Failed to get file path from S3 upload.',
        );
      }

      // ✅ Ensure `mime` is set correctly before saving
      const uploadFile = this.uploadsRepository.create({
        name: filePath,
        path: `https://${this.cloudFrontUrl}/${filePath}`,
        type: fileTypes.IMAGE,
        mime: file.mimetype || 'image/jpeg', // ✅ Default to prevent NULL
        size: file.size || 0, // ✅ Prevent NULL values
      });

      //   console.log('✅ Upload Data Before Saving:', uploadFile);

      return await this.uploadsRepository.save(uploadFile);
    } catch (error) {
      console.error('❌ Upload Service Error:', error);
      throw new ConflictException(error.message || 'File upload failed');
    }
  }
}
