import { Test, TestingModule } from '@nestjs/testing';
import { CategoriaService } from './categoria.service';
import { CategoriaUseCases } from './categoria.usecases';
import { Categoria } from '../../domain/categoria/categoria.entity';
import { CategoriaType } from '../../domain/categoria/categoria.types';
import { CreateCategoriaDto, UpdateCategoriaDto } from '../../application/dto/categoria.dto';

describe('CategoriaService', () => {
  let categoriaService: CategoriaService;
  let categoriaUseCases: jest.Mocked<CategoriaUseCases>;

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
    const mockCategoriaUseCases = {
      findAll: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriaService,
        {
          provide: CategoriaUseCases,
          useValue: mockCategoriaUseCases,
        },
      ],
    }).compile();

    categoriaService = module.get<CategoriaService>(CategoriaService);
    categoriaUseCases = module.get(CategoriaUseCases);
  });

  describe('findAll', () => {
    describe('when retrieving all categorias', () => {
      it('should return all categorias successfully', async () => {
        const mockCategorias = [mockCategoria];
        categoriaUseCases.findAll.mockResolvedValue(mockCategorias);

        const result = await categoriaService.findAll();

        expect(categoriaUseCases.findAll).toHaveBeenCalled();
        expect(result).toBe(mockCategorias);
      });

      it('should return empty array when no categorias exist', async () => {
        categoriaUseCases.findAll.mockResolvedValue([]);

        const result = await categoriaService.findAll();

        expect(result).toEqual([]);
      });

      it('should return multiple categorias', async () => {
        const mockCategorias = [
          mockCategoria,
          new Categoria({
            id: 'categoria-2',
            nome: 'Sobremesas',
            tipo: CategoriaType.SOBREMESA,
          }),
          new Categoria({
            id: 'categoria-3',
            nome: 'Acompanhamentos',
            tipo: CategoriaType.ACOMPANHAMENTO,
          }),
        ];
        categoriaUseCases.findAll.mockResolvedValue(mockCategorias);

        const result = await categoriaService.findAll();

        expect(result).toBe(mockCategorias);
        expect(result).toHaveLength(3);
      });

      it('should return categorias with different types', async () => {
        const mockCategorias = [
          new Categoria({ id: 'bebida-1', nome: 'Bebidas', tipo: CategoriaType.BEBIDA }),
          new Categoria({ id: 'sobremesa-1', nome: 'Sobremesas', tipo: CategoriaType.SOBREMESA }),
          new Categoria({ id: 'acompanhamento-1', nome: 'Acompanhamentos', tipo: CategoriaType.ACOMPANHAMENTO }),
          new Categoria({ id: 'lanche-1', nome: 'Lanches', tipo: CategoriaType.LANCHE }),
        ];
        categoriaUseCases.findAll.mockResolvedValue(mockCategorias);

        const result = await categoriaService.findAll();

        expect(result).toBe(mockCategorias);
        expect(result).toHaveLength(4);
        expect(result[0].tipo).toBe(CategoriaType.BEBIDA);
        expect(result[1].tipo).toBe(CategoriaType.SOBREMESA);
        expect(result[2].tipo).toBe(CategoriaType.ACOMPANHAMENTO);
        expect(result[3].tipo).toBe(CategoriaType.LANCHE);
      });
    });

    describe('when use cases fail', () => {
      it('should propagate errors from use cases', async () => {
        const error = new Error('Database connection failed');
        categoriaUseCases.findAll.mockRejectedValue(error);

        await expect(categoriaService.findAll()).rejects.toThrow('Database connection failed');
      });
    });
  });

  describe('create', () => {
    describe('when creating a valid categoria', () => {
      it('should create categoria successfully', async () => {
        categoriaUseCases.create.mockResolvedValue(mockCategoria);

        const result = await categoriaService.create(mockCreateCategoriaDto);

        expect(categoriaUseCases.create).toHaveBeenCalledWith(mockCreateCategoriaDto);
        expect(result).toBe(mockCategoria);
      });

      it('should create categoria with BEBIDA type', async () => {
        const bebidaDto = { nome: 'Bebidas', tipo: CategoriaType.BEBIDA };
        const bebidaCategoria = new Categoria({ id: 'bebida-1', ...bebidaDto });
        categoriaUseCases.create.mockResolvedValue(bebidaCategoria);

        const result = await categoriaService.create(bebidaDto);

        expect(categoriaUseCases.create).toHaveBeenCalledWith(bebidaDto);
        expect(result).toBe(bebidaCategoria);
        expect(result.tipo).toBe(CategoriaType.BEBIDA);
      });

      it('should create categoria with SOBREMESA type', async () => {
        const sobremesaDto = { nome: 'Sobremesas', tipo: CategoriaType.SOBREMESA };
        const sobremesaCategoria = new Categoria({ id: 'sobremesa-1', ...sobremesaDto });
        categoriaUseCases.create.mockResolvedValue(sobremesaCategoria);

        const result = await categoriaService.create(sobremesaDto);

        expect(categoriaUseCases.create).toHaveBeenCalledWith(sobremesaDto);
        expect(result).toBe(sobremesaCategoria);
        expect(result.tipo).toBe(CategoriaType.SOBREMESA);
      });

      it('should create categoria with ACOMPANHAMENTO type', async () => {
        const acompanhamentoDto = { nome: 'Acompanhamentos', tipo: CategoriaType.ACOMPANHAMENTO };
        const acompanhamentoCategoria = new Categoria({ id: 'acompanhamento-1', ...acompanhamentoDto });
        categoriaUseCases.create.mockResolvedValue(acompanhamentoCategoria);

        const result = await categoriaService.create(acompanhamentoDto);

        expect(categoriaUseCases.create).toHaveBeenCalledWith(acompanhamentoDto);
        expect(result).toBe(acompanhamentoCategoria);
        expect(result.tipo).toBe(CategoriaType.ACOMPANHAMENTO);
      });

      it('should create categoria with LANCHE type', async () => {
        const lancheDto = { nome: 'Lanches', tipo: CategoriaType.LANCHE };
        const lancheCategoria = new Categoria({ id: 'lanche-1', ...lancheDto });
        categoriaUseCases.create.mockResolvedValue(lancheCategoria);

        const result = await categoriaService.create(lancheDto);

        expect(categoriaUseCases.create).toHaveBeenCalledWith(lancheDto);
        expect(result).toBe(lancheCategoria);
        expect(result.tipo).toBe(CategoriaType.LANCHE);
      });
    });

    describe('when use cases fail', () => {
      it('should propagate validation errors', async () => {
        const error = new Error('Validation failed');
        categoriaUseCases.create.mockRejectedValue(error);

        await expect(categoriaService.create(mockCreateCategoriaDto)).rejects.toThrow('Validation failed');
      });
    });
  });

  describe('findById', () => {
    describe('when finding an existing categoria', () => {
      it('should return categoria by id successfully', async () => {
        categoriaUseCases.findById.mockResolvedValue(mockCategoria);

        const result = await categoriaService.findById('categoria-1');

        expect(categoriaUseCases.findById).toHaveBeenCalledWith('categoria-1');
        expect(result).toBe(mockCategoria);
      });

      it('should find categoria with different id', async () => {
        const differentCategoria = new Categoria({
          id: 'categoria-2',
          nome: 'Sobremesas',
          tipo: CategoriaType.SOBREMESA,
        });
        categoriaUseCases.findById.mockResolvedValue(differentCategoria);

        const result = await categoriaService.findById('categoria-2');

        expect(categoriaUseCases.findById).toHaveBeenCalledWith('categoria-2');
        expect(result).toBe(differentCategoria);
      });
    });

    describe('when categoria not found', () => {
      it('should propagate not found errors', async () => {
        const error = new Error('Categoria not found');
        categoriaUseCases.findById.mockRejectedValue(error);

        await expect(categoriaService.findById('non-existent')).rejects.toThrow('Categoria not found');
      });
    });
  });

  describe('update', () => {
    describe('when updating an existing categoria', () => {
      it('should update categoria successfully', async () => {
        categoriaUseCases.update.mockResolvedValue(mockCategoria);

        const result = await categoriaService.update('categoria-1', mockUpdateCategoriaDto);

        expect(categoriaUseCases.update).toHaveBeenCalledWith('categoria-1', mockUpdateCategoriaDto);
        expect(result).toBe(mockCategoria);
      });

      it('should update categoria with different data', async () => {
        const differentDto = {
          id: 'categoria-1',
          nome: 'Bebidas Alcoólicas',
          tipo: CategoriaType.BEBIDA,
        };
        const updatedCategoria = new Categoria({ ...mockCategoria, ...differentDto });
        categoriaUseCases.update.mockResolvedValue(updatedCategoria);

        const result = await categoriaService.update('categoria-1', differentDto);

        expect(categoriaUseCases.update).toHaveBeenCalledWith('categoria-1', differentDto);
        expect(result).toBe(updatedCategoria);
      });

      it('should update categoria type', async () => {
        const typeChangeDto = {
          id: 'categoria-1',
          nome: 'Bebidas',
          tipo: CategoriaType.SOBREMESA,
        };
        const typeChangedCategoria = new Categoria({ ...mockCategoria, ...typeChangeDto });
        categoriaUseCases.update.mockResolvedValue(typeChangedCategoria);

        const result = await categoriaService.update('categoria-1', typeChangeDto);

        expect(categoriaUseCases.update).toHaveBeenCalledWith('categoria-1', typeChangeDto);
        expect(result).toBe(typeChangedCategoria);
        expect(result.tipo).toBe(CategoriaType.SOBREMESA);
      });
    });

    describe('when update fails', () => {
      it('should propagate update errors', async () => {
        const error = new Error('Update failed');
        categoriaUseCases.update.mockRejectedValue(error);

        await expect(categoriaService.update('categoria-1', mockUpdateCategoriaDto)).rejects.toThrow('Update failed');
      });
    });
  });

  describe('delete', () => {
    describe('when deleting a categoria', () => {
      it('should delete categoria successfully', async () => {
        categoriaUseCases.delete.mockResolvedValue(mockCategoria);

        const result = await categoriaService.delete('categoria-1');

        expect(categoriaUseCases.delete).toHaveBeenCalledWith('categoria-1');
        expect(result).toBe(mockCategoria);
      });

      it('should delete categoria with different id', async () => {
        const differentCategoria = new Categoria({
          id: 'categoria-2',
          nome: 'Sobremesas',
          tipo: CategoriaType.SOBREMESA,
        });
        categoriaUseCases.delete.mockResolvedValue(differentCategoria);

        const result = await categoriaService.delete('categoria-2');

        expect(categoriaUseCases.delete).toHaveBeenCalledWith('categoria-2');
        expect(result).toBe(differentCategoria);
      });
    });

    describe('when delete fails', () => {
      it('should propagate delete errors', async () => {
        const error = new Error('Delete failed');
        categoriaUseCases.delete.mockRejectedValue(error);

        await expect(categoriaService.delete('categoria-1')).rejects.toThrow('Delete failed');
      });
    });
  });

  describe('Service Integration', () => {
    it('should handle multiple operations in sequence', async () => {
      // Create
      categoriaUseCases.create.mockResolvedValue(mockCategoria);
      const created = await categoriaService.create(mockCreateCategoriaDto);
      expect(created).toBe(mockCategoria);

      // Find by ID
      categoriaUseCases.findById.mockResolvedValue(mockCategoria);
      const found = await categoriaService.findById('categoria-1');
      expect(found).toBe(mockCategoria);

      // Update
      categoriaUseCases.update.mockResolvedValue(mockCategoria);
      const updated = await categoriaService.update('categoria-1', mockUpdateCategoriaDto);
      expect(updated).toBe(mockCategoria);

      // Find all
      categoriaUseCases.findAll.mockResolvedValue([mockCategoria]);
      const all = await categoriaService.findAll();
      expect(all).toEqual([mockCategoria]);

      // Delete
      categoriaUseCases.delete.mockResolvedValue(mockCategoria);
      const deleted = await categoriaService.delete('categoria-1');
      expect(deleted).toBe(mockCategoria);
    });

    it('should handle different categoria types in sequence', async () => {
      const bebidaCategoria = new Categoria({ id: 'bebida-1', nome: 'Bebidas', tipo: CategoriaType.BEBIDA });
      const sobremesaCategoria = new Categoria({ id: 'sobremesa-1', nome: 'Sobremesas', tipo: CategoriaType.SOBREMESA });
      const acompanhamentoCategoria = new Categoria({ id: 'acompanhamento-1', nome: 'Acompanhamentos', tipo: CategoriaType.ACOMPANHAMENTO });
      const lancheCategoria = new Categoria({ id: 'lanche-1', nome: 'Lanches', tipo: CategoriaType.LANCHE });

      // Create different types
      categoriaUseCases.create.mockResolvedValueOnce(bebidaCategoria);
      categoriaUseCases.create.mockResolvedValueOnce(sobremesaCategoria);
      categoriaUseCases.create.mockResolvedValueOnce(acompanhamentoCategoria);
      categoriaUseCases.create.mockResolvedValueOnce(lancheCategoria);

      const createdBebida = await categoriaService.create({ nome: 'Bebidas', tipo: CategoriaType.BEBIDA });
      const createdSobremesa = await categoriaService.create({ nome: 'Sobremesas', tipo: CategoriaType.SOBREMESA });
      const createdAcompanhamento = await categoriaService.create({ nome: 'Acompanhamentos', tipo: CategoriaType.ACOMPANHAMENTO });
      const createdLanche = await categoriaService.create({ nome: 'Lanches', tipo: CategoriaType.LANCHE });

      expect(createdBebida.tipo).toBe(CategoriaType.BEBIDA);
      expect(createdSobremesa.tipo).toBe(CategoriaType.SOBREMESA);
      expect(createdAcompanhamento.tipo).toBe(CategoriaType.ACOMPANHAMENTO);
      expect(createdLanche.tipo).toBe(CategoriaType.LANCHE);

      // Find all
      categoriaUseCases.findAll.mockResolvedValue([bebidaCategoria, sobremesaCategoria, acompanhamentoCategoria, lancheCategoria]);
      const all = await categoriaService.findAll();
      expect(all).toHaveLength(4);
      expect(all.map(c => c.tipo)).toEqual([
        CategoriaType.BEBIDA,
        CategoriaType.SOBREMESA,
        CategoriaType.ACOMPANHAMENTO,
        CategoriaType.LANCHE,
      ]);
    });
  });
}); 