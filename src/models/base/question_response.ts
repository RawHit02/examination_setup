import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { QuestionType } from 'src/infrastructure/helpers/question_type_helper';

export class QuestionResponse {
  @AutoMap()
  @ApiProperty()
  id: string;

  @AutoMap()
  @ApiProperty({ description: 'Type of the question MCQ/DESCRIPTIVE' })
  @IsEnum(QuestionType)
  questionType: QuestionType;

  @AutoMap()
  @ApiProperty({
    description: 'QUESTION',
  })
  question: string;

  @AutoMap()
  @ApiProperty({
    description: 'Option 1',
  })
  answer1: string;

  @AutoMap()
  @ApiProperty({
    description: 'Option 2',
  })
  answer2: string;

  @AutoMap()
  @ApiProperty({
    description: 'Option 3',
  })
  answer3: string;

  @AutoMap()
  @ApiProperty({
    description: 'Option 4',
  })
  answer4: string;

  @AutoMap()
  @ApiProperty({
    description: 'Date when the question was created',
  })
  createdDate: Date;

  @AutoMap()
  @ApiProperty({
    description: 'Date when the question was last updated',
  })
  updatedDate: Date;
}
