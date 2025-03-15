import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { IQuestionManagementService } from 'src/application/interfaces/question_management/iquestion_management.service';
import { QuestionManagementService } from './services/question_management/question_management.service';
import { JWTService } from './services/helpers';
import { DbContextModule } from './data-access/entities/dbcontext.module';
import { IQuestionManagementRepository } from 'src/application/interfaces/question_management/iquestion_management.repository';
import { QuestionManagementRepository } from './repository/question_management.repository';
import { UploadsService } from './services/question_management/uploads.service';
import { UploadToAwsProvider } from './services/question_management/uploadAWS.provider';
@Module({
  imports: [HttpModule, DbContextModule],
  providers: [
    JWTService,
    {
      provide: IQuestionManagementRepository,
      useClass: QuestionManagementRepository,
    },
    { provide: IQuestionManagementService, useClass: QuestionManagementService },
    QuestionManagementService,UploadsService,UploadToAwsProvider,
  ],
  exports: [
    JWTService,
    { provide: IQuestionManagementService, useClass: QuestionManagementService },
    UploadsService,UploadToAwsProvider
  ],
})
export class InfrastructureModule {}
