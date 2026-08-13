import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'generated/prisma/client';
import { PlanetType } from 'generated/prisma/enums';
import { PlanetsService } from './planets.service';

describe('PlanetsService', () => {
  let service: PlanetsService;
  let prisma: {
    planet: {
      create: jest.Mock;
      findMany: jest.Mock;
      count: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  const mockPlanet = {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    name: 'Marte',
    type: PlanetType.TERRESTRIAL,
    mass: 6.39e23,
    radius: 3389.5,
    distanceFromSun: 227.9e6,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const createPlanetDto = {
    name: 'Marte',
    type: PlanetType.TERRESTRIAL,
    mass: 6.39e23,
    radius: 3389.5,
    distanceFromSun: 227.9e6,
  };

  beforeEach(async () => {
    prisma = {
      planet: {
        create: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [PlanetsService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<PlanetsService>(PlanetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('debería crear un planeta', async () => {
      prisma.planet.create.mockResolvedValue(mockPlanet);

      const result = await service.create(createPlanetDto);

      expect(prisma.planet.create).toHaveBeenCalledWith({
        data: createPlanetDto,
      });
      expect(result).toEqual(mockPlanet);
    });

    it('debería lanzar ConflictException si el nombre ya existe', async () => {
      prisma.planet.create.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError(
          'Unique constraint failed on the fields: (`name`)',
          { code: 'P2002', clientVersion: '7.2.0' },
        ),
      );

      await expect(service.create(createPlanetDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findAll', () => {
    it('debería devolver planetas paginados con metadatos', async () => {
      prisma.planet.findMany.mockResolvedValue([mockPlanet]);
      prisma.planet.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(prisma.planet.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 0, take: 10 }),
      );
      expect(result).toEqual({
        data: [mockPlanet],
        meta: { total: 1, page: 1, lastPage: 1, limit: 10 },
      });
    });
  });

  describe('findOne', () => {
    it('debería devolver un planeta por id', async () => {
      prisma.planet.findUnique.mockResolvedValue(mockPlanet);

      const result = await service.findOne(mockPlanet.id);

      expect(prisma.planet.findUnique).toHaveBeenCalledWith({
        where: { id: mockPlanet.id },
      });
      expect(result).toEqual(mockPlanet);
    });
  });

  describe('update', () => {
    it('debería actualizar un planeta', async () => {
      prisma.planet.update.mockResolvedValue({
        ...mockPlanet,
        name: 'Venus',
      });

      const result = await service.update(mockPlanet.id, { name: 'Venus' });

      expect(prisma.planet.update).toHaveBeenCalledWith({
        where: { id: mockPlanet.id },
        data: { name: 'Venus' },
      });
      expect(result.name).toBe('Venus');
    });

    it('debería lanzar ConflictException si el nombre nuevo ya existe', async () => {
      prisma.planet.update.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError(
          'Unique constraint failed on the fields: (`name`)',
          { code: 'P2002', clientVersion: '7.2.0' },
        ),
      );

      await expect(
        service.update(mockPlanet.id, { name: 'Tierra' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('delete', () => {
    it('debería eliminar un planeta', async () => {
      prisma.planet.delete.mockResolvedValue(mockPlanet);

      const result = await service.delete(mockPlanet.id);

      expect(prisma.planet.delete).toHaveBeenCalledWith({
        where: { id: mockPlanet.id },
      });
      expect(result).toEqual(mockPlanet);
    });
  });
});
