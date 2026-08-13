import { Test, TestingModule } from '@nestjs/testing';
import { PlanetType } from 'generated/prisma/enums';
import { PlanetsController } from './planets.controller';
import { PlanetsService } from './planets.service';

describe('PlanetsController', () => {
  let controller: PlanetsController;
  let planetsService: {
    findOne: jest.Mock;
    findAll: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
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

  beforeEach(async () => {
    planetsService = {
      findOne: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlanetsController],
      providers: [{ provide: PlanetsService, useValue: planetsService }],
    }).compile();

    controller = module.get<PlanetsController>(PlanetsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne', () => {
    it('debería delegar al servicio con el id', async () => {
      planetsService.findOne.mockReturnValue(Promise.resolve(mockPlanet));

      await controller.findOne(mockPlanet.id);

      expect(planetsService.findOne).toHaveBeenCalledWith(mockPlanet.id);
    });
  });

  describe('findAll', () => {
    it('debería delegar al servicio con el dto de filtros', async () => {
      const dto = { name: 'mar', page: 1, limit: 10 };
      planetsService.findAll.mockReturnValue(
        Promise.resolve({ data: [], meta: {} }),
      );

      await controller.findAll(dto);

      expect(planetsService.findAll).toHaveBeenCalledWith(dto);
    });
  });

  describe('create', () => {
    it('debería delegar al servicio con el dto', async () => {
      const dto = {
        name: 'Marte',
        type: PlanetType.TERRESTRIAL,
        mass: 6.39e23,
        radius: 3389.5,
        distanceFromSun: 227.9e6,
      };
      planetsService.create.mockReturnValue(Promise.resolve(mockPlanet));

      await controller.create(dto);

      expect(planetsService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('debería delegar al servicio con id y dto', async () => {
      const dto = { name: 'Venus' };
      planetsService.update.mockReturnValue(Promise.resolve(mockPlanet));

      await controller.update(mockPlanet.id, dto);

      expect(planetsService.update).toHaveBeenCalledWith(mockPlanet.id, dto);
    });
  });

  describe('delete', () => {
    it('debería delegar al servicio con el id', async () => {
      planetsService.delete.mockReturnValue(Promise.resolve(mockPlanet));

      await controller.delete(mockPlanet.id);

      expect(planetsService.delete).toHaveBeenCalledWith(mockPlanet.id);
    });
  });
});
