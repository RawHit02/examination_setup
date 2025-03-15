import {
  Mapper,
  MappingProfile,
  createMap,
  extend,
  forMember,
  mapFrom,
} from '@automapper/core';
import { InjectMapper, AutomapperProfile } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { CreateQuestionRequest} from 'src/models/question_management/create_question.request';
import { QuestionManagementEntity } from '../data-access/entities';
import { QuestionListResponse } from 'src/models/question_management/question_list.response';
import { QuestionResponse } from 'src/models/base/question_response';

@Injectable()
export class AutoMapperProfileMapper extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, CreateQuestionRequest, QuestionManagementEntity);
      createMap(mapper, QuestionManagementEntity, QuestionListResponse);
      createMap(mapper, QuestionManagementEntity, QuestionResponse);
    };
  }
}
