import { QuestionManagementEntity } from 'src/infrastructure/data-access/entities';
import { IAsyncRepository } from '../base/iasync-repository';

export interface IQuestionManagementRepository
  extends IAsyncRepository<QuestionManagementEntity> {}
export const IQuestionManagementRepository = Symbol(
  'IQuestionManagementRepository',
);
