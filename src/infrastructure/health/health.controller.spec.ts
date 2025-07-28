import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

describe('HealthController', () => {
  let healthController: HealthController;
  let healthService: jest.Mocked<HealthService>;

  beforeEach(async () => {
    const mockHealthService = {
      check: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthService,
          useValue: mockHealthService,
        },
      ],
    }).compile();

    healthController = module.get<HealthController>(HealthController);
    healthService = module.get(HealthService);
  });

  describe('check', () => {
    it('should call health service check method', async () => {
      const mockHealthStatus = { status: 'ok' } as any;
      healthService.check.mockResolvedValue(mockHealthStatus);

      await healthController.check();

      expect(healthService.check).toHaveBeenCalled();
    });

    it('should return health status from service', async () => {
      const mockHealthStatus = { status: 'ok' } as any;
      healthService.check.mockResolvedValue(mockHealthStatus);

      const result = await healthController.check();

      expect(result).toBe(mockHealthStatus);
    });
  });
}); 