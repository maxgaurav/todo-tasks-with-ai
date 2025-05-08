import { BaseModel } from './base.model';
import { Column, DataType, Sequelize, Table } from 'sequelize-typescript';
import { SkipValidation } from '../../skip-validation';
import pgvector from 'pgvector/sequelize';

pgvector.registerType(Sequelize);

@Table({ tableName: 'task_category_embeddings' })
export class TaskCategoryEmbeddingModel extends BaseModel<TaskCategoryEmbeddingModel> {
  @Column
  public declare category: string;

  @Column
  public declare statement: string;

  @Column(
    (DataType as never as { VECTOR: (dimension: number) => unknown }).VECTOR(
      2000,
    ),
  )
  public declare embeddings: SkipValidation<number[]>;
}
