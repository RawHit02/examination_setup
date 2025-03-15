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

export class CreateQuestionRequest {
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

  @AutoMap()
  @Type(() => String)
  @IsNotEmpty({ message: 'Name is required' })
  @ApiProperty({
    default: 'abc',
    description: 'Enter valid question',
  })
  question: string;

  @AutoMap()
  @Type(() => String)
  @IsOptional()
  @ApiProperty({
    default: 'abc',
    description: 'Enter valid answer',
  })
  answer1?: string;

  @AutoMap()
  @Type(() => String)
  @IsOptional()
  @ApiProperty({
    default: 'abc',
    description: 'Enter valid answer',
  })
  answer2?: string;

  @AutoMap()
  @Type(() => String)
  @IsOptional()
  @ApiProperty({
    default: 'abc',
    description: 'Enter valid answer',
  })
  answer3?: string;

  @AutoMap()
  @Type(() => String)
  @IsOptional()
  @ApiProperty({
    default: 'abc',
    description: 'Enter valid answer',
  })
  answer4?: string;

  @AutoMap()
  @Type(() => String)
  @IsOptional()
  @ApiProperty({
    default: 'Descriptive Answer',
    description: 'Enter valid answer',
  })
  descriptiveAnswer?: string;
}
