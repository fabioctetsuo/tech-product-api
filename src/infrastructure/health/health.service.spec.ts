import { Test, TestingModule } from '@nestjs/testing';
import { HealthService } from './health.service';
import { HealthCheckService } from '@nestjs/terminus';

describe('HealthService', () => {
  let healthService: HealthService;
  let healthCheckService: jest.Mocked<HealthCheckService>;

  beforeEach(async () => {
    const mockHealthCheckService = {
      check: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthService,
        {
          provide: HealthCheckService,
          useValue: mockHealthCheckService,
        },
      ],
    }).compile();

    healthService = module.get<HealthService>(HealthService);
    healthCheckService = module.get(HealthCheckService);
  });

  describe('check', () => {
    it('should call health check service', () => {
      const mockResult = { status: 'ok' } as any;
      healthCheckService.check.mockReturnValue(mockResult);

      healthService.check();

      expect(healthCheckService.check).toHaveBeenCalledWith([]);
    });

    it('should return health check result', () => {
      const mockResult = { status: 'ok' } as any;
      healthCheckService.check.mockReturnValue(mockResult);

      const result = healthService.check();

      expect(result).toBe(mockResult);
    });
  });
}); 