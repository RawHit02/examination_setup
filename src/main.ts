import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { LoggingInterceptor } from './common/interceptor/logging.interceptor';
import { TransformInterceptor } from './common/interceptor/transform.interceptor';
import { HttpExceptionFilter } from './shared-lib';
import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createDocument } from './common/swagger/swagger';
import { config } from 'aws-sdk';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  //getting current env keys
  const appConfig = app.get(ConfigService);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,whitelist: true,

      disableErrorMessages: false, // Enables detailed error messages
    exceptionFactory: (errors) => {
      console.error(errors); // Log validation errors
      return new BadRequestException(errors);
    },


    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
  );






// Enable CORS if needed
app.enableCors();

// Log every request
app.use((req, res, next) => {
  Logger.log(`${req.method} ${req.url}`, 'IncomingRequest');
  next();
});

// Enable detailed validation errors
app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));








  //Setup the aws sdk used uploading the files to aws s3 bucket
  const configService=app.get(ConfigService);
  config.update({
    credentials: {
      accessKeyId: configService.get('appConfig.awsAccessKeyId'),
      secretAccessKey: configService.get('appConfig.awsSecretKey'),
    },
    region: configService.get('appConfig.awsRegion'),
  });


  app.setGlobalPrefix('api/v1');
  SwaggerModule.setup('api', app, createDocument(app));
  await app.listen(process?.env?.PORT || 81);
  console.log(`🚀 Server started at ${await app.getUrl()}`);
}
bootstrap();
