import { PageDto, PageOptionsDto } from 'src/models/base/dtos';
import { ResultResponse } from 'src/models/base/result_response';
import { CreateQuestionRequest } from 'src/models/question_management/create_question.request';
import { GetQuestionRequest } from 'src/models/question_management/get_questions_request';
import { QuestionListResponse } from 'src/models/question_management/question_list.response';

export interface IQuestionManagementService {
  createQuestion(
    request: CreateQuestionRequest,
    file: Express.Multer.File,
  ): Promise<string>;
  getQuestion(
    pageOptionsDto: GetQuestionRequest,
  ): Promise<ResultResponse<PageDto<QuestionListResponse>>>;
}

export const IQuestionManagementService = Symbol('IQuestionManagementService');
