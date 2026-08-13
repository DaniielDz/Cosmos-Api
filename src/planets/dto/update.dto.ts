import { PartialType } from '@nestjs/mapped-types';
import { CreatePlanetDto } from './create.dto';

export class UpdatePlanetDto extends PartialType(CreatePlanetDto) {}
