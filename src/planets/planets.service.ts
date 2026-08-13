import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetPlanetsDto } from './dto/get-planets.dto';
import { PlanetWhereInput } from 'generated/prisma/models';
import { Prisma } from 'generated/prisma/client';
import { CreatePlanetDto } from './dto/create.dto';
import { UpdatePlanetDto } from './dto/update.dto';

@Injectable()
export class PlanetsService {
  constructor(private prisma: PrismaService) {}

  private handleKnownErrors(error: unknown): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException('Ya existe un planeta con ese nombre.');
    }
    throw error;
  }

  async findOne(id: string) {
    return await this.prisma.planet.findUnique({ where: { id } });
  }

  async findAll(dto: GetPlanetsDto) {
    const { name, type, page = 1, limit = 10, maxRadius, minRadius } = dto;

    const skip = (page - 1) * limit;

    const where: PlanetWhereInput = {
      name: name
        ? {
            contains: name,
            mode: 'insensitive',
          }
        : undefined,
      type: type,
      radius: {
        gte: minRadius,
        lte: maxRadius,
      },
    };

    const [data, total] = await Promise.all([
      this.prisma.planet.findMany({
        skip,
        take: limit,
        where,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.planet.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
        limit,
      },
    };
  }

  async delete(id: string) {
    return await this.prisma.planet.delete({ where: { id } });
  }

  async create(createPlanetDto: CreatePlanetDto) {
    try {
      return await this.prisma.planet.create({ data: createPlanetDto });
    } catch (error) {
      this.handleKnownErrors(error);
    }
  }

  async update(id: string, updatePlanetDto: UpdatePlanetDto) {
    try {
      return await this.prisma.planet.update({
        where: { id },
        data: updatePlanetDto,
      });
    } catch (error) {
      this.handleKnownErrors(error);
    }
  }
}
