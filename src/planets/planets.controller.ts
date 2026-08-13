import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PlanetsService } from './planets.service';
import { GetPlanetsDto } from './dto/get-planets.dto';
import { UpdatePlanetDto } from './dto/update.dto';
import { CreatePlanetDto } from './dto/create.dto';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'generated/prisma/enums';

@Controller('planets')
export class PlanetsController {
  constructor(private planetsService: PlanetsService) {}

  @Get('/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.planetsService.findOne(id);
  }

  @Get()
  findAll(
    @Query()
    dto: GetPlanetsDto,
  ) {
    return this.planetsService.findAll(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete('/:id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.planetsService.delete(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() createPlantetDto: CreatePlanetDto) {
    return this.planetsService.create(createPlantetDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put('/:id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePlanetDto: UpdatePlanetDto,
  ) {
    return this.planetsService.update(id, updatePlanetDto);
  }
}
