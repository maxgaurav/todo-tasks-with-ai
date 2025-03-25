import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TaskResource {
  @ApiProperty()
  @Expose()
  public id: number;

  @ApiProperty()
  @Expose()
  public user_id: number;

  @ApiProperty()
  @Expose()
  public title: number;

  @ApiProperty()
  @Expose()
  public content: number;

  @ApiProperty({ type: Date, nullable: true })
  @Expose()
  public completed_on: Date | null;

  @ApiProperty({ type: Date, nullable: true })
  @Expose()
  public due_on: Date | null;

  @ApiProperty()
  @Expose()
  public created_at: Date;

  @ApiProperty()
  @Expose()
  public updated_at: Date;
}
