import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StoreCategoryEmbeddingDto {
  @IsNotEmpty()
  @ApiProperty()
  public category: string;

  @IsNotEmpty()
  @ApiProperty()
  public statement: string;
}
