import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDecimal,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Length,
  Matches,
  Min,
} from 'class-validator';
import { QuestionType } from 'src/infrastructure/helpers/question_type_helper';

export class QuestionTypeRequest {
  @AutoMap()
  @ApiProperty({
    enum: QuestionType,
    default: QuestionType.MCQ,
    description: 'Specify if the question is a MCQ or DESCRIPTIVE',
    example: QuestionType.MCQ,
  })
  @IsNotEmpty({ message: 'Question type is required' })
  @IsEnum(QuestionType, {
    message: 'QuetionType must be either MCQ or DESCRIPTIVE',
  })
  questionType: QuestionType;
}