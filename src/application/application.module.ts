import { Module } from '@nestjs/common';
import { InfrastructureModule } from 'src/infrastructure/infrastructure.module';
import { QuestionManagementController } from './controllers/question.controller';
@Module({
  imports: [InfrastructureModule],
  controllers: [QuestionManagementController],
  providers: [],
  exports: [],
})
export class ApplicationModule {}
