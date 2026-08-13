import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PlanetType } from 'generated/prisma/enums';

export class CreatePlanetDto {
  @IsString({ message: 'El nombre del planeta debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres.' })
  @MaxLength(15, { message: 'El nombre debe tener como máximo 15 caracteres' })
  name: string;

  @IsNotEmpty({ message: 'El tipo es obligatorio' })
  @IsEnum(PlanetType, { message: 'El tipo de planeta no es válido' })
  type: PlanetType;

  @IsNotEmpty({ message: 'La masa es obligatoria' })
  @IsNumber({}, { message: 'La masa debe ser un número' })
  mass: number;

  @IsNotEmpty({ message: 'El radio es obligatorio' })
  @IsNumber({}, { message: 'El radio debe ser un número' })
  radius: number;

  @IsNotEmpty({ message: 'La distancia al sol es obligatoria' })
  @IsNumber({}, { message: 'La distancia al sol debe ser un número' })
  distanceFromSun: number;
}
