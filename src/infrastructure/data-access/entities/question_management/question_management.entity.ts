import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { EntityBase } from '../base/entity-base.entity';
import { AutoMap } from '@automapper/classes';
import { QuestionType } from 'src/infrastructure/helpers/question_type_helper';
import { Upload } from './upload.entity';

@Entity({ name: 'QuestionManagementTbl' })
export class QuestionManagementEntity extends EntityBase {
  @AutoMap()
  @Column({
    name: 'questionType',
    type: 'enum',
    enum: QuestionType,
    default: QuestionType.MCQ,
    nullable: false,
  })
  questionType: QuestionType;

  @AutoMap()
  @Column({
    name: 'question',
    type: 'character varying',
    nullable: false,
  })
  question: string;

  
  @AutoMap()
  @Column({
    name: 'answer 1',
    type: 'character varying',
    nullable: true,
  })
  answer1: string;

  
  @AutoMap()
  @Column({
    name: 'answer 2',
    type: 'character varying',
    nullable: true,
  })
  answer2: string;

  
  @AutoMap()
  @Column({
    name: 'answer 3',
    type: 'character varying',
    nullable: true,
  })
  answer3: string;

  
  @AutoMap()
  @Column({
    name: 'answer 4',
    type: 'character varying',
    nullable: true,
  })
  answer4: string;

  @AutoMap()
  @Column({
    name: 'descriptiveAnswer',
    type: 'character varying',
    nullable: true,
  })
  descriptiveAnswer: string;

  @ManyToOne(() => Upload, { nullable: true, onDelete: 'SET NULL' }) // ✅ Relationship with Upload table
  @JoinColumn({ name: 'image_id' }) // Foreign key column
  image?: Upload;

}
