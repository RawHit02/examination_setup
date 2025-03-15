import {
  Controller,
  Post,
  Body,
  Inject,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Get,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiBody, ApiTags } from '@nestjs/swagger';
import { IQuestionManagementService } from '../interfaces/question_management/iquestion_management.service';
import { CreateQuestionRequest } from 'src/models/question_management/create_question.request';
import { GetQuestionRequest } from 'src/models/question_management/get_questions_request';

@Controller('questions')
@ApiTags('questions')
export class QuestionManagementController {
  constructor(
    @Inject(IQuestionManagementService)
    private readonly questionService: IQuestionManagementService,
  ) {}

  @Post('createQuestion')
  @UseInterceptors(FileInterceptor('file')) // Enables optional file upload
  @ApiConsumes('multipart/form-data') // Required for file upload in Swagger
  @ApiOperation({
    summary: 'Create a new question (MCQ or Descriptive) with optional image',
  })
  @ApiBody({
    description: 'Create a new question with optional image upload',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Optional image file for descriptive questions',
        },
        questionType: {
          type: 'string',
          enum: ['MCQ', 'DESCRIPTIVE'],
          description: 'Type of question (MCQ or Descriptive)',
        },
        question: {
          type: 'string',
          description: 'Question text',
          default: '2+2 = ?',
        },
        answer1: {
          type: 'string',
          description: 'MCQ Answer 1',
          nullable: true,
          default: '1',
        },
        answer2: {
          type: 'string',
          description: 'MCQ Answer 2',
          nullable: true,
          default: '2',
        },
        answer3: {
          type: 'string',
          description: 'MCQ Answer 3',
          nullable: true,
          default: '3',
        },
        answer4: {
          type: 'string',
          description: 'MCQ Answer 4',
          nullable: true,
          default: '4',
        },
        descriptiveAnswer: {
          type: 'string',
          description: 'Answer for Descriptive question (if applicable)',
          nullable: true,
          default: 'What is Photoshop?',
        },
      },
    },
  })
  public async createQuestion(
    @UploadedFile() file: Express.Multer.File,
    @Body() request: CreateQuestionRequest,
  ) {
    console.log('📝 Received Question Request:', request);

    // Ensure questionType is provided
    if (!request.questionType) {
      throw new BadRequestException(
        '❌ Question type (MCQ or DESCRIPTIVE) is required.',
      );
    }

    if (!request.question) {
      throw new BadRequestException('❌ Question is required.');
    }

    // Validate MCQ: No descriptive answer allowed
    if (request.questionType === 'MCQ' && request.descriptiveAnswer) {
      throw new BadRequestException(
        '❌ MCQ questions cannot have a descriptive answer.',
      );
    }

    // Validate Descriptive: No MCQ answers allowed
    if (request.questionType === 'DESCRIPTIVE') {
      if (
        request.answer1 ||
        request.answer2 ||
        request.answer3 ||
        request.answer4
      ) {
        throw new BadRequestException(
          '❌ Descriptive questions cannot have MCQ answers.',
        );
      }
    }

    // If MCQ, Ensure No Image is Uploaded
    if (request.questionType === 'MCQ' && file) {
      throw new BadRequestException(
        '❌ MCQ questions do not require an image.',
      );
    }

    let uploadedFile = null;

    if (file) {
      // console.log('📂 Received File in Controller:',
      //   {
      //   originalname: file.originalname,
      //   mimetype: file.mimetype || 'image/jpeg', // Ensure mimetype is set
      //   size: file.size,
      // });

      if (!file.mimetype) {
        file.mimetype = 'image/jpeg'; // Default mimetype to prevent null errors
      }

      uploadedFile = file; // Pass file to service if it exists
    } else {
      console.log('⚠️ No file uploaded. Proceeding without an image.');
    }

    return this.questionService.createQuestion(request, uploadedFile);
  }

  @Get('getQuestions')
  getQuestions(@Query() request: GetQuestionRequest) {
    return this.questionService.getQuestion(request);
  }
}
