import { Mapper } from '@automapper/core';
import { v4 as uuidv4 } from 'uuid';
import { InjectMapper } from '@automapper/nestjs';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IQuestionManagementService } from 'src/application/interfaces/question_management/iquestion_management.service';
import { EntityManager, Repository } from 'typeorm';
import { ResultResponse } from 'src/models/base/result_response';
import { PageDto, PageMetaDto } from 'src/models/base/dtos';
import { CreateQuestionRequest } from 'src/models/question_management/create_question.request';
import { QuestionManagementEntity } from 'src/infrastructure/data-access/entities';
import { IQuestionManagementRepository } from 'src/application/interfaces/question_management/iquestion_management.repository';
import { ExceptionHelper } from 'src/application/helpers/exception.helper';
import { GetQuestionRequest } from 'src/models/question_management/get_questions_request';
import { QuestionListResponse } from 'src/models/question_management/question_list.response';
import { Upload } from 'src/infrastructure/data-access/entities/question_management/upload.entity';
import { UploadsService } from './uploads.service';

@Injectable()
export class QuestionManagementService implements IQuestionManagementService {
  constructor(
    @InjectRepository(QuestionManagementEntity)
    private readonly repository: IQuestionManagementRepository,

    @InjectRepository(Upload)
    private readonly uploadsRepository: Repository<Upload>, // Injecting upload repository

    private readonly uploadsService: UploadsService, //  Injecting UploadsService

    @InjectMapper() private mapper: Mapper,
    // @InjectEntityManager() private _entityManager: EntityManager,
    @InjectRepository(QuestionManagementEntity)
    private readonly myRepository: Repository<QuestionManagementEntity>,
  ) {}

  public async createQuestion(
    request: CreateQuestionRequest,
    file?: Express.Multer.File,
  ): Promise<string> {
    try {
      let imageEntity = null;
  
      if (file) {
        console.log('📂 Processing Image Upload:', {
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
        });
  
        // ✅ Prevent duplicate uploads & link image properly
        const uploadedImage = await this.uploadsService.uploadFile(file);
        if (!uploadedImage) {
          throw new ConflictException('❌ Failed to save image.');
        }
  
        imageEntity = uploadedImage; // ✅ Use uploaded image directly
      }
  
      // ✅ Validate MCQ should not have an image
      if (request.questionType === 'MCQ' && file) {
        throw new BadRequestException('❌ MCQ questions should not have an image.');
      }
  
      // Create question entity
      const entity = this.mapper.map(
        request,
        CreateQuestionRequest,
        QuestionManagementEntity,
      );
  
      // ✅ Assign image only if it exists
      if (imageEntity) {
        entity.image = imageEntity;
      }
  
      await this.repository.save(entity);
      return entity.id;
    } catch (error) {
      console.error('❌ Error in createQuestion:', error);
      throw ExceptionHelper.BadRequest(error?.message || 'Something went wrong');
    }
  }
  

  public async getQuestion(
    pageOptionsDto: GetQuestionRequest,
  ): Promise<ResultResponse<PageDto<QuestionListResponse>>> {
    try {
      // ✅ Fetch questions with image relation
      const [questions, count] = await this.myRepository.findAndCount({
        where: { isDeleted: false },
        relations: ['image'], // Ensure image is loaded
      });

      // console.log('RAW Questions from DB:', JSON.stringify(questions, null, 2));

      let selectedQuestions = questions;

      // ✅ Ensure exactly 10 questions when count > 10
      if (count > 10) {
        const shuffleArray = (array: any[]) =>
          array.sort(() => Math.random() - 0.5);

        // Shuffle the entire question set
        selectedQuestions = shuffleArray([...questions]).slice(0, 10);
      }

      // ✅ Map only question table data
      const mappedQuestions = this.mapper.mapArray(
        selectedQuestions,
        QuestionManagementEntity,
        QuestionListResponse,
      );

      // ✅ Attach image data separately for DESCRIPTIVE questions
      const finalResponse = mappedQuestions.map((question, index) => {
        const originalQuestion = selectedQuestions[index];

        return originalQuestion.questionType === 'DESCRIPTIVE' &&
          originalQuestion.image
          ? {
              ...question,
              image: {
                id: originalQuestion.image.id,
                name: originalQuestion.image.name,
                path: originalQuestion.image.path,
                mime: originalQuestion.image.mime,
                size: originalQuestion.image.size,
                createdDate: originalQuestion.image.createDate,
              },
            }
          : question;
      });

      // console.log('Final Response with Image Data:', JSON.stringify(finalResponse, null, 2));

      // Pagination Metadata
      const pageMetaDto = new PageMetaDto({
        itemCount: finalResponse.length,
        pageOptionsDto: pageOptionsDto,
      });

      return ResultResponse.ok(
        new PageDto<QuestionListResponse>(finalResponse, pageMetaDto),
        'Fetched questions successfully',
      );
    } catch (error) {
      console.error('❌ Error Fetching Questions:', error);
      throw ExceptionHelper.BadRequest(error.message);
    }
  }
}
