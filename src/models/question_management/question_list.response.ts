import { AutoMap } from '@automapper/classes';
import { v4 as uuidv4 } from 'uuid';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum } from 'class-validator';
import { QuestionType } from 'src/infrastructure/helpers/question_type_helper';

export class QuestionListResponse {
  @AutoMap()
  @ApiProperty()
  id: string;

  @AutoMap()
  @ApiProperty()
  @IsEnum(QuestionType)
  questionType: QuestionType;

  @AutoMap()
  @ApiProperty()
  question: string;

  @AutoMap()
  @ApiProperty()
  answer1: string;

  @AutoMap()
  @ApiProperty()
  answer2: string;

  @AutoMap()
  @ApiProperty()
  answer3: string;

  @AutoMap()
  @ApiProperty()
  answer4: string;

  @AutoMap()
  @ApiProperty()
  descriptiveAnswer: string;


  @AutoMap()
  @ApiProperty({ default: new Date() })
  createdDate?: Date;

  @AutoMap()
  @ApiProperty({ default: new Date() })
  updatedDate?: Date;

  @AutoMap()
  image?: {
    id: number;
    name: string;
    path: string;
    mime: string;
    size: number;
    createdDate: Date;
  };


  // @AutoMap()
  // @ApiProperty()
  // whatsappNumber: string;

  // @AutoMap()
  // @ApiProperty()
  // @IsEmail()
  // email: string;

  // @AutoMap()
  // @ApiProperty()
  // address: string;

  // @AutoMap()
  // @ApiProperty({ default: '' })
  // createdBy?: string;


}
