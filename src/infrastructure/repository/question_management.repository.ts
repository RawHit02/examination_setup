import { RepositoryBase } from 'src/infrastructure/base/repository-base';
import { QuestionManagementEntity } from '../data-access/entities';
import { IQuestionManagementRepository } from 'src/application/interfaces/question_management/iquestion_management.repository';

export class QuestionManagementRepository
  extends RepositoryBase<QuestionManagementEntity>
  implements IQuestionManagementRepository {}
