import { ApiProperty } from '@nestjs/swagger';
import {
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateTaskDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  public title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  public content: string;

  @ApiProperty({ type: Date, nullable: true })
  @IsOptional()
  @IsISO8601()
  public completed_on: Date | null = null;

  @ApiProperty({ type: Date, nullable: true })
  @IsOptional()
  @IsISO8601()
  public due_on: Date | null;
}
