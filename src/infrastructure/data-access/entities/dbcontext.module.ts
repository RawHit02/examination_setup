import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionManagementEntity } from '.';
import { Upload } from './question_management/upload.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QuestionManagementEntity,Upload])],
  exports: [TypeOrmModule],
})
export class DbContextModule {}
