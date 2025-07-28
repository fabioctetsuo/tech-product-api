import { Test, TestingModule } from '@nestjs/testing';
import { CategoriaController } from './categoria.api';
import { CategoriaService } from '../../business/categoria/categoria.service';
import { Categoria } from '../../domain/categoria/categoria.entity';
import { CategoriaType } from '../../domain/categoria/categoria.types';
import { CreateCategoriaDto, UpdateCategoriaDto } from '../dto/categoria.dto';

describe('CategoriaController', () => {
  let categoriaController: CategoriaController;
  let categoriaService: jest.Mocked<CategoriaService>;

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
    const mockCategoriaService = {
      findAll: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriaController],
      providers: [
        {
          provide: CategoriaService,
          useValue: mockCategoriaService,
        },
      ],
    }).compile();

    categoriaController = module.get<CategoriaController>(CategoriaController);
    categoriaService = module.get(CategoriaService);
  });

  describe('findAll', () => {
    describe('when retrieving all categorias', () => {
      it('should return all categorias successfully', async () => {
        const mockCategorias = [mockCategoria];
        categoriaService.findAll.mockResolvedValue(mockCategorias);

        const result = await categoriaController.findAll();

        expect(categoriaService.findAll).toHaveBeenCalled();
        expect(result).toBe(mockCategorias);
      });

      it('should return empty array when no categorias exist', async () => {
        categoriaService.findAll.mockResolvedValue([]);

        const result = await categoriaController.findAll();

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
        categoriaService.findAll.mockResolvedValue(mockCategorias);

        const result = await categoriaController.findAll();

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
        categoriaService.findAll.mockResolvedValue(mockCategorias);

        const result = await categoriaController.findAll();

        expect(result).toBe(mockCategorias);
        expect(result).toHaveLength(4);
        expect(result[0].tipo).toBe(CategoriaType.BEBIDA);
        expect(result[1].tipo).toBe(CategoriaType.SOBREMESA);
        expect(result[2].tipo).toBe(CategoriaType.ACOMPANHAMENTO);
        expect(result[3].tipo).toBe(CategoriaType.LANCHE);
      });
    });

    describe('when service fails', () => {
      it('should propagate errors from service', async () => {
        const error = new Error('Database connection failed');
        categoriaService.findAll.mockRejectedValue(error);

        await expect(categoriaController.findAll()).rejects.toThrow('Database connection failed');
      });
    });
  });

  describe('create', () => {
    describe('when creating a valid categoria', () => {
      it('should create categoria successfully', async () => {
        categoriaService.create.mockResolvedValue(mockCategoria);

        const result = await categoriaController.create(mockCreateCategoriaDto);

        expect(categoriaService.create).toHaveBeenCalledWith(mockCreateCategoriaDto);
        expect(result).toBe(mockCategoria);
      });

      it('should create categoria with BEBIDA type', async () => {
        const bebidaDto = { nome: 'Bebidas', tipo: CategoriaType.BEBIDA };
        const bebidaCategoria = new Categoria({ id: 'bebida-1', ...bebidaDto });
        categoriaService.create.mockResolvedValue(bebidaCategoria);

        const result = await categoriaController.create(bebidaDto);

        expect(categoriaService.create).toHaveBeenCalledWith(bebidaDto);
        expect(result).toBe(bebidaCategoria);
        expect(result.tipo).toBe(CategoriaType.BEBIDA);
      });

      it('should create categoria with SOBREMESA type', async () => {
        const sobremesaDto = { nome: 'Sobremesas', tipo: CategoriaType.SOBREMESA };
        const sobremesaCategoria = new Categoria({ id: 'sobremesa-1', ...sobremesaDto });
        categoriaService.create.mockResolvedValue(sobremesaCategoria);

        const result = await categoriaController.create(sobremesaDto);

        expect(categoriaService.create).toHaveBeenCalledWith(sobremesaDto);
        expect(result).toBe(sobremesaCategoria);
        expect(result.tipo).toBe(CategoriaType.SOBREMESA);
      });

      it('should create categoria with ACOMPANHAMENTO type', async () => {
        const acompanhamentoDto = { nome: 'Acompanhamentos', tipo: CategoriaType.ACOMPANHAMENTO };
        const acompanhamentoCategoria = new Categoria({ id: 'acompanhamento-1', ...acompanhamentoDto });
        categoriaService.create.mockResolvedValue(acompanhamentoCategoria);

        const result = await categoriaController.create(acompanhamentoDto);

        expect(categoriaService.create).toHaveBeenCalledWith(acompanhamentoDto);
        expect(result).toBe(acompanhamentoCategoria);
        expect(result.tipo).toBe(CategoriaType.ACOMPANHAMENTO);
      });

      it('should create categoria with LANCHE type', async () => {
        const lancheDto = { nome: 'Lanches', tipo: CategoriaType.LANCHE };
        const lancheCategoria = new Categoria({ id: 'lanche-1', ...lancheDto });
        categoriaService.create.mockResolvedValue(lancheCategoria);

        const result = await categoriaController.create(lancheDto);

        expect(categoriaService.create).toHaveBeenCalledWith(lancheDto);
        expect(result).toBe(lancheCategoria);
        expect(result.tipo).toBe(CategoriaType.LANCHE);
      });
    });

    describe('when service fails', () => {
      it('should propagate validation errors', async () => {
        const error = new Error('Validation failed');
        categoriaService.create.mockRejectedValue(error);

        await expect(categoriaController.create(mockCreateCategoriaDto)).rejects.toThrow('Validation failed');
      });
    });
  });

  describe('findById', () => {
    describe('when finding an existing categoria', () => {
      it('should return categoria by id successfully', async () => {
        categoriaService.findById.mockResolvedValue(mockCategoria);

        const result = await categoriaController.findById('categoria-1');

        expect(categoriaService.findById).toHaveBeenCalledWith('categoria-1');
        expect(result).toBe(mockCategoria);
      });

      it('should find categoria with different id', async () => {
        const differentCategoria = new Categoria({
          id: 'categoria-2',
          nome: 'Sobremesas',
          tipo: CategoriaType.SOBREMESA,
        });
        categoriaService.findById.mockResolvedValue(differentCategoria);

        const result = await categoriaController.findById('categoria-2');

        expect(categoriaService.findById).toHaveBeenCalledWith('categoria-2');
        expect(result).toBe(differentCategoria);
      });
    });

    describe('when categoria not found', () => {
      it('should propagate not found errors', async () => {
        const error = new Error('Categoria not found');
        categoriaService.findById.mockRejectedValue(error);

        await expect(categoriaController.findById('non-existent')).rejects.toThrow('Categoria not found');
      });
    });
  });

  describe('update', () => {
    describe('when updating an existing categoria', () => {
      it('should update categoria successfully', async () => {
        categoriaService.update.mockResolvedValue(mockCategoria);

        const result = await categoriaController.update('categoria-1', mockUpdateCategoriaDto);

        expect(categoriaService.update).toHaveBeenCalledWith('categoria-1', mockUpdateCategoriaDto);
        expect(result).toBe(mockCategoria);
      });

      it('should update categoria with different data', async () => {
        const differentDto = {
          id: 'categoria-1',
          nome: 'Bebidas Alcoólicas',
          tipo: CategoriaType.BEBIDA,
        };
        const updatedCategoria = new Categoria({ ...mockCategoria, ...differentDto });
        categoriaService.update.mockResolvedValue(updatedCategoria);

        const result = await categoriaController.update('categoria-1', differentDto);

        expect(categoriaService.update).toHaveBeenCalledWith('categoria-1', differentDto);
        expect(result).toBe(updatedCategoria);
      });

      it('should update categoria type', async () => {
        const typeChangeDto = {
          id: 'categoria-1',
          nome: 'Bebidas',
          tipo: CategoriaType.SOBREMESA,
        };
        const typeChangedCategoria = new Categoria({ ...mockCategoria, ...typeChangeDto });
        categoriaService.update.mockResolvedValue(typeChangedCategoria);

        const result = await categoriaController.update('categoria-1', typeChangeDto);

        expect(categoriaService.update).toHaveBeenCalledWith('categoria-1', typeChangeDto);
        expect(result).toBe(typeChangedCategoria);
        expect(result.tipo).toBe(CategoriaType.SOBREMESA);
      });
    });

    describe('when update fails', () => {
      it('should propagate update errors', async () => {
        const error = new Error('Update failed');
        categoriaService.update.mockRejectedValue(error);

        await expect(categoriaController.update('categoria-1', mockUpdateCategoriaDto)).rejects.toThrow('Update failed');
      });
    });
  });

  describe('delete', () => {
    describe('when deleting a categoria', () => {
      it('should delete categoria successfully', async () => {
        categoriaService.delete.mockResolvedValue(mockCategoria);

        const result = await categoriaController.delete('categoria-1');

        expect(categoriaService.delete).toHaveBeenCalledWith('categoria-1');
        expect(result).toBe(mockCategoria);
      });

      it('should delete categoria with different id', async () => {
        const differentCategoria = new Categoria({
          id: 'categoria-2',
          nome: 'Sobremesas',
          tipo: CategoriaType.SOBREMESA,
        });
        categoriaService.delete.mockResolvedValue(differentCategoria);

        const result = await categoriaController.delete('categoria-2');

        expect(categoriaService.delete).toHaveBeenCalledWith('categoria-2');
        expect(result).toBe(differentCategoria);
      });
    });

    describe('when delete fails', () => {
      it('should propagate delete errors', async () => {
        const error = new Error('Delete failed');
        categoriaService.delete.mockRejectedValue(error);

        await expect(categoriaController.delete('categoria-1')).rejects.toThrow('Delete failed');
      });
    });
  });

  describe('Controller Integration', () => {
    it('should handle multiple operations in sequence', async () => {
      // Create
      categoriaService.create.mockResolvedValue(mockCategoria);
      const created = await categoriaController.create(mockCreateCategoriaDto);
      expect(created).toBe(mockCategoria);

      // Find by ID
      categoriaService.findById.mockResolvedValue(mockCategoria);
      const found = await categoriaController.findById('categoria-1');
      expect(found).toBe(mockCategoria);

      // Update
      categoriaService.update.mockResolvedValue(mockCategoria);
      const updated = await categoriaController.update('categoria-1', mockUpdateCategoriaDto);
      expect(updated).toBe(mockCategoria);

      // Find all
      categoriaService.findAll.mockResolvedValue([mockCategoria]);
      const all = await categoriaController.findAll();
      expect(all).toEqual([mockCategoria]);

      // Delete
      categoriaService.delete.mockResolvedValue(mockCategoria);
      const deleted = await categoriaController.delete('categoria-1');
      expect(deleted).toBe(mockCategoria);
    });

    it('should handle different categoria types in sequence', async () => {
      const bebidaCategoria = new Categoria({ id: 'bebida-1', nome: 'Bebidas', tipo: CategoriaType.BEBIDA });
      const sobremesaCategoria = new Categoria({ id: 'sobremesa-1', nome: 'Sobremesas', tipo: CategoriaType.SOBREMESA });
      const acompanhamentoCategoria = new Categoria({ id: 'acompanhamento-1', nome: 'Acompanhamentos', tipo: CategoriaType.ACOMPANHAMENTO });
      const lancheCategoria = new Categoria({ id: 'lanche-1', nome: 'Lanches', tipo: CategoriaType.LANCHE });

      // Create different types
      categoriaService.create.mockResolvedValueOnce(bebidaCategoria);
      categoriaService.create.mockResolvedValueOnce(sobremesaCategoria);
      categoriaService.create.mockResolvedValueOnce(acompanhamentoCategoria);
      categoriaService.create.mockResolvedValueOnce(lancheCategoria);

      const createdBebida = await categoriaController.create({ nome: 'Bebidas', tipo: CategoriaType.BEBIDA });
      const createdSobremesa = await categoriaController.create({ nome: 'Sobremesas', tipo: CategoriaType.SOBREMESA });
      const createdAcompanhamento = await categoriaController.create({ nome: 'Acompanhamentos', tipo: CategoriaType.ACOMPANHAMENTO });
      const createdLanche = await categoriaController.create({ nome: 'Lanches', tipo: CategoriaType.LANCHE });

      expect(createdBebida.tipo).toBe(CategoriaType.BEBIDA);
      expect(createdSobremesa.tipo).toBe(CategoriaType.SOBREMESA);
      expect(createdAcompanhamento.tipo).toBe(CategoriaType.ACOMPANHAMENTO);
      expect(createdLanche.tipo).toBe(CategoriaType.LANCHE);

      // Find all
      categoriaService.findAll.mockResolvedValue([bebidaCategoria, sobremesaCategoria, acompanhamentoCategoria, lancheCategoria]);
      const all = await categoriaController.findAll();
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