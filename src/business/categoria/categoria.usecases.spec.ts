import { Test, TestingModule } from '@nestjs/testing';
import { CategoriaUseCases } from './categoria.usecases';
import { CategoriaRepository } from '../../infrastructure/persistence/repositories/categoria.repository';
import { Categoria } from '../../domain/categoria/categoria.entity';
import { CategoriaType } from '../../domain/categoria/categoria.types';
import { ValidationException, ValidationErrorType } from '../../domain/exceptions/validation.exception';
import { CreateCategoriaDto, UpdateCategoriaDto } from '../../application/dto/categoria.dto';

describe('CategoriaUseCases', () => {
  let categoriaUseCases: CategoriaUseCases;
  let categoriaRepository: jest.Mocked<CategoriaRepository>;

  const mockCategoria = new Categoria({
    id: 'categoria-1',
    nome: 'Bebidas',
    tipo: CategoriaType.BEBIDA,
  });

  const mockCreateCategoriaDto: CreateCategoriaDto = {
    nome: 'Bebidas',
    tipo: CategoriaType.BEBIDA,
  };

  const mockUpdateCategoriaDto: UpdateCategoriaDto = {
    id: 'categoria-1',
    nome: 'Refrigerantes',
    tipo: CategoriaType.BEBIDA,
  };

  beforeEach(async () => {
    const mockCategoriaRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriaUseCases,
        {
          provide: CategoriaRepository,
          useValue: mockCategoriaRepository,
        },
      ],
    }).compile();

    categoriaUseCases = module.get<CategoriaUseCases>(CategoriaUseCases);
    categoriaRepository = module.get(CategoriaRepository);
  });

  describe('create', () => {
    describe('when creating a valid categoria', () => {
      it('should create a categoria successfully', async () => {
        categoriaRepository.save.mockResolvedValue(mockCategoria);

        const result = await categoriaUseCases.create(mockCreateCategoriaDto);

        expect(categoriaRepository.save).toHaveBeenCalledWith(expect.any(Categoria));
        expect(result).toBe(mockCategoria);
      });

      it('should create categoria with BEBIDA type', async () => {
        const bebidaDto = { ...mockCreateCategoriaDto, tipo: CategoriaType.BEBIDA };
        categoriaRepository.save.mockResolvedValue(mockCategoria);

        const result = await categoriaUseCases.create(bebidaDto);

        expect(result).toBe(mockCategoria);
        expect(categoriaRepository.save).toHaveBeenCalledWith(expect.any(Categoria));
      });

      it('should create categoria with SOBREMESA type', async () => {
        const sobremesaDto = { ...mockCreateCategoriaDto, tipo: CategoriaType.SOBREMESA };
        const sobremesaCategoria = new Categoria({ ...mockCategoria, tipo: CategoriaType.SOBREMESA });
        categoriaRepository.save.mockResolvedValue(sobremesaCategoria);

        const result = await categoriaUseCases.create(sobremesaDto);

        expect(result).toBe(sobremesaCategoria);
        expect(categoriaRepository.save).toHaveBeenCalledWith(expect.any(Categoria));
      });

      it('should create categoria with ACOMPANHAMENTO type', async () => {
        const acompanhamentoDto = { ...mockCreateCategoriaDto, tipo: CategoriaType.ACOMPANHAMENTO };
        const acompanhamentoCategoria = new Categoria({ ...mockCategoria, tipo: CategoriaType.ACOMPANHAMENTO });
        categoriaRepository.save.mockResolvedValue(acompanhamentoCategoria);

        const result = await categoriaUseCases.create(acompanhamentoDto);

        expect(result).toBe(acompanhamentoCategoria);
        expect(categoriaRepository.save).toHaveBeenCalledWith(expect.any(Categoria));
      });

      it('should create categoria with LANCHE type', async () => {
        const lancheDto = { ...mockCreateCategoriaDto, tipo: CategoriaType.LANCHE };
        const lancheCategoria = new Categoria({ ...mockCategoria, tipo: CategoriaType.LANCHE });
        categoriaRepository.save.mockResolvedValue(lancheCategoria);

        const result = await categoriaUseCases.create(lancheDto);

        expect(result).toBe(lancheCategoria);
        expect(categoriaRepository.save).toHaveBeenCalledWith(expect.any(Categoria));
      });
    });

    describe('when creating a categoria with invalid type', () => {
      it('should throw ValidationException for invalid tipo', async () => {
        const invalidDto = { ...mockCreateCategoriaDto, tipo: 'INVALID_TYPE' as any };

        await expect(categoriaUseCases.create(invalidDto)).rejects.toThrow(ValidationException);
        await expect(categoriaUseCases.create(invalidDto)).rejects.toThrow(ValidationErrorType.CATEGORIA_INVALID_TYPE);
      });

      it('should throw ValidationException for undefined tipo', async () => {
        const invalidDto = { ...mockCreateCategoriaDto, tipo: undefined as any };

        await expect(categoriaUseCases.create(invalidDto)).rejects.toThrow(ValidationException);
        await expect(categoriaUseCases.create(invalidDto)).rejects.toThrow(ValidationErrorType.CATEGORIA_INVALID_TYPE);
      });

      it('should throw ValidationException for null tipo', async () => {
        const invalidDto = { ...mockCreateCategoriaDto, tipo: null as any };

        await expect(categoriaUseCases.create(invalidDto)).rejects.toThrow(ValidationException);
        await expect(categoriaUseCases.create(invalidDto)).rejects.toThrow(ValidationErrorType.CATEGORIA_INVALID_TYPE);
      });
    });

    describe('when repository fails', () => {
      it('should propagate repository errors', async () => {
        const error = new Error('Database connection failed');
        categoriaRepository.save.mockRejectedValue(error);

        await expect(categoriaUseCases.create(mockCreateCategoriaDto)).rejects.toThrow('Database connection failed');
      });
    });
  });

  describe('update', () => {
    describe('when updating an existing categoria', () => {
      it('should update categoria successfully', async () => {
        categoriaRepository.findById.mockResolvedValue(mockCategoria);
        categoriaRepository.update.mockResolvedValue(mockCategoria);

        const result = await categoriaUseCases.update('categoria-1', mockUpdateCategoriaDto);

        expect(categoriaRepository.findById).toHaveBeenCalledWith('categoria-1');
        expect(categoriaRepository.update).toHaveBeenCalledWith('categoria-1', expect.any(Categoria));
        expect(result).toBe(mockCategoria);
      });

      it('should validate categoria type before updating', async () => {
        categoriaRepository.findById.mockResolvedValue(mockCategoria);
        categoriaRepository.update.mockResolvedValue(mockCategoria);

        await categoriaUseCases.update('categoria-1', mockUpdateCategoriaDto);

        expect(categoriaRepository.update).toHaveBeenCalledWith('categoria-1', expect.any(Categoria));
      });
    });

    describe('when updating a non-existent categoria', () => {
      it('should throw ValidationException when categoria not found', async () => {
        categoriaRepository.findById.mockResolvedValue(null);

        await expect(categoriaUseCases.update('non-existent', mockUpdateCategoriaDto)).rejects.toThrow(ValidationException);
        await expect(categoriaUseCases.update('non-existent', mockUpdateCategoriaDto)).rejects.toThrow(ValidationErrorType.CATEGORIA_NOT_FOUND);
      });
    });

    describe('when updating with invalid type', () => {
      it('should throw ValidationException for invalid tipo', async () => {
        categoriaRepository.findById.mockResolvedValue(mockCategoria);
        const invalidDto = { ...mockUpdateCategoriaDto, tipo: 'INVALID_TYPE' as any };

        await expect(categoriaUseCases.update('categoria-1', invalidDto)).rejects.toThrow(ValidationException);
        await expect(categoriaUseCases.update('categoria-1', invalidDto)).rejects.toThrow(ValidationErrorType.CATEGORIA_INVALID_TYPE);
      });
    });

    describe('when repository fails', () => {
      it('should propagate findById errors', async () => {
        const error = new Error('Database connection failed');
        categoriaRepository.findById.mockRejectedValue(error);

        await expect(categoriaUseCases.update('categoria-1', mockUpdateCategoriaDto)).rejects.toThrow('Database connection failed');
      });

      it('should propagate update errors', async () => {
        categoriaRepository.findById.mockResolvedValue(mockCategoria);
        const error = new Error('Update failed');
        categoriaRepository.update.mockRejectedValue(error);

        await expect(categoriaUseCases.update('categoria-1', mockUpdateCategoriaDto)).rejects.toThrow('Update failed');
      });
    });
  });

  describe('findAll', () => {
    describe('when finding all categorias', () => {
      it('should return all categorias', async () => {
        const mockCategorias = [mockCategoria];
        categoriaRepository.findAll.mockResolvedValue(mockCategorias);

        const result = await categoriaUseCases.findAll();

        expect(categoriaRepository.findAll).toHaveBeenCalled();
        expect(result).toBe(mockCategorias);
      });

      it('should return empty array when no categorias exist', async () => {
        categoriaRepository.findAll.mockResolvedValue([]);

        const result = await categoriaUseCases.findAll();

        expect(result).toEqual([]);
      });
    });

    describe('when repository fails', () => {
      it('should propagate repository errors', async () => {
        const error = new Error('Database connection failed');
        categoriaRepository.findAll.mockRejectedValue(error);

        await expect(categoriaUseCases.findAll()).rejects.toThrow('Database connection failed');
      });
    });
  });

  describe('findById', () => {
    describe('when finding an existing categoria', () => {
      it('should return categoria by id', async () => {
        categoriaRepository.findById.mockResolvedValue(mockCategoria);

        const result = await categoriaUseCases.findById('categoria-1');

        expect(categoriaRepository.findById).toHaveBeenCalledWith('categoria-1');
        expect(result).toBe(mockCategoria);
      });
    });

    describe('when finding a non-existent categoria', () => {
      it('should throw ValidationException when categoria not found', async () => {
        categoriaRepository.findById.mockResolvedValue(null);

        await expect(categoriaUseCases.findById('non-existent')).rejects.toThrow(ValidationException);
        await expect(categoriaUseCases.findById('non-existent')).rejects.toThrow(ValidationErrorType.CATEGORIA_NOT_FOUND);
      });
    });

    describe('when repository fails', () => {
      it('should propagate repository errors', async () => {
        const error = new Error('Database connection failed');
        categoriaRepository.findById.mockRejectedValue(error);

        await expect(categoriaUseCases.findById('categoria-1')).rejects.toThrow('Database connection failed');
      });
    });
  });

  describe('delete', () => {
    describe('when deleting a categoria', () => {
      it('should delete categoria successfully', async () => {
        categoriaRepository.delete.mockResolvedValue(mockCategoria);

        const result = await categoriaUseCases.delete('categoria-1');

        expect(categoriaRepository.delete).toHaveBeenCalledWith('categoria-1');
        expect(result).toBe(mockCategoria);
      });
    });

    describe('when repository fails', () => {
      it('should propagate repository errors', async () => {
        const error = new Error('Database connection failed');
        categoriaRepository.delete.mockRejectedValue(error);

        await expect(categoriaUseCases.delete('categoria-1')).rejects.toThrow('Database connection failed');
      });
    });
  });
}); 