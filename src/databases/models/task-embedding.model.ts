import { BaseModel } from './base.model';
import {
  Column,
  DataType,
  ForeignKey,
  Sequelize,
  Table,
} from 'sequelize-typescript';
import { TaskModel } from './task.model';
import { SkipValidation } from '../../skip-validation';
import pgvector from 'pgvector/sequelize';

pgvector.registerType(Sequelize);

@Table({ tableName: 'task_embeddings' })
export class TaskEmbeddingModel extends BaseModel<TaskEmbeddingModel> {
  @ForeignKey(() => TaskModel)
  @Column
  public declare task_id: number;

  @Column(
    (DataType as never as { VECTOR: (dimension: number) => unknown }).VECTOR(
      2000,
    ),
  )
  public declare embeddings: SkipValidation<number[]>;
}
