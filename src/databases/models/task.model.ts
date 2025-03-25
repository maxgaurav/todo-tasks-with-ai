import { BaseModel } from './base.model';
import { Column, DataType, Default, Table } from 'sequelize-typescript';

@Table({ tableName: 'tasks' })
export class TaskModel extends BaseModel<TaskModel> {
  @Column
  public declare user_id: number;

  @Column
  public declare title: string;

  @Column
  public declare content: string;

  @Default(null)
  @Column(DataType.DATE)
  public declare completed_on: Date | null;

  @Default(null)
  @Column(DataType.DATE)
  public declare due_on: Date | null;
}
