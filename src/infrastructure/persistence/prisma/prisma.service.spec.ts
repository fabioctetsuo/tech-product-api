import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('onModuleInit', () => {
    it('should connect to database', async () => {
      // Mock the $connect method
      prismaService.$connect = jest.fn().mockResolvedValue(undefined);

      await prismaService.onModuleInit();

      expect(prismaService.$connect).toHaveBeenCalled();
    });
  });

  describe('onModuleDestroy', () => {
    it('should disconnect from database', async () => {
      // Mock the $disconnect method
      prismaService.$disconnect = jest.fn().mockResolvedValue(undefined);

      await prismaService.onModuleDestroy();

      expect(prismaService.$disconnect).toHaveBeenCalled();
    });
  });

  describe('database connection', () => {
    it('should handle connection errors gracefully', async () => {
      const error = new Error('Connection failed');
      prismaService.$connect = jest.fn().mockRejectedValue(error);

      await expect(prismaService.onModuleInit()).rejects.toThrow('Connection failed');
    });

    it('should handle disconnection errors gracefully', async () => {
      const error = new Error('Disconnection failed');
      prismaService.$disconnect = jest.fn().mockRejectedValue(error);

      await expect(prismaService.onModuleDestroy()).rejects.toThrow('Disconnection failed');
    });
  });
}); 