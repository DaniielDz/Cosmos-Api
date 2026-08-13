import {
  IsOptional,
  IsEnum,
  IsNumber,
  IsString,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PlanetType } from 'generated/prisma/enums';

export class GetPlanetsDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(PlanetType)
  type?: PlanetType;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minRadius?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxRadius?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
