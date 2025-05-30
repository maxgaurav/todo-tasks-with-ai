import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { GrantTypes } from '../grant-types/grant-type-implementation';

export class AccessTokenDto {
  @ApiProperty({
    type: String,
    description: `Required with grant_type ${GrantTypes.ImplicitPassword}`,
    required: false,
  })
  @ValidateIf((obj) => obj.grant_type === GrantTypes.ImplicitPassword)
  @IsNotEmpty()
  @IsEmail()
  public email: string | null = null;

  @ApiProperty({
    type: String,
    required: false,
    description: `Required with grant_type ${GrantTypes.ImplicitPassword}`,
  })
  @ValidateIf((obj) => obj.grant_type === GrantTypes.ImplicitPassword)
  @IsNotEmpty()
  @IsString()
  public password: string | null = null;

  @ApiProperty({
    type: String,
    description: `Required with grant_type ${GrantTypes.ImplicitPassword}, ${GrantTypes.AuthorizationCode}`,
    required: false,
  })
  @ValidateIf(
    (obj) =>
      obj.grant_type === GrantTypes.ImplicitPassword ||
      obj.grant_type === GrantTypes.AuthorizationCode,
  )
  @IsNotEmpty()
  @IsString()
  @IsUUID(4)
  public client_id: string | null = null;

  @ApiProperty({
    type: String,
    description: `Required with grant_type ${GrantTypes.ImplicitPassword}, ${GrantTypes.AuthorizationCode}`,
    required: false,
  })
  @ValidateIf(
    (obj) =>
      obj.grant_type === GrantTypes.ImplicitPassword ||
      obj.grant_type === GrantTypes.AuthorizationCode,
  )
  @IsNotEmpty()
  @IsString()
  public client_secret: string | null = null;

  @ApiProperty({ enum: GrantTypes })
  @IsNotEmpty()
  @IsEnum(GrantTypes)
  public grant_type: GrantTypes;

  @ApiProperty({
    type: String,
    required: false,
    description: `Required with grant_type ${GrantTypes.PKCE}`,
  })
  @ValidateIf((obj) => obj.grant_type === GrantTypes.PKCE)
  @IsNotEmpty()
  @IsString()
  public code_verifier: string | null = null;

  @ApiProperty({
    type: String,
    required: false,
    description: `Required with grant_type ${GrantTypes.PKCE}, ${GrantTypes.AuthorizationCode}`,
  })
  @ValidateIf(
    (obj) =>
      obj.grant_type === GrantTypes.PKCE ||
      obj.grant_type === GrantTypes.AuthorizationCode,
  )
  @IsNotEmpty()
  @IsUUID(4)
  public code: string | null = null;
}
