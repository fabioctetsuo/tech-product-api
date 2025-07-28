import { Test, TestingModule } from '@nestjs/testing';
import { ProdutoController } from './produto.api';
import { ProdutoService } from '../../business/produto/produto.service';
import { Produto } from '../../domain/produto/produto.entity';
import { Categoria } from '../../domain/categoria/categoria.entity';
import { CategoriaType } from '../../domain/categoria/categoria.types';
import { CreateProdutoDto, UpdateProdutoDto } from '../dto/produto.dto';

describe('ProdutoController', () => {
  let produtoController: ProdutoController;
  let produtoService: jest.Mocked<ProdutoService>;

  const mockCategoria = new Categoria({
    id: 'categoria-1',
    nome: 'Bebidas',
    tipo: CategoriaType.BEBIDA,
  });

  const mockProduto = new Produto({
    id: 'produto-1',
    nome: 'Coca-Cola',
    categoria_id: 'categoria-1',
    tempo_preparo: 5,
    preco: 5.50,
    descricao: 'Refrigerante Coca-Cola 350ml',
    imagem: 'coca-cola.jpg',
    categoria: mockCategoria,
  });

  const mockCreateProdutoDto: CreateProdutoDto = {
    nome: 'Coca-Cola',
    categoria_id: 'categoria-1',
    tempo_preparo: 5,
    preco: 5.50,
    descricao: 'Refrigerante Coca-Cola 350ml',
    imagem: 'coca-cola.jpg',
  };

  const mockUpdateProdutoDto: UpdateProdutoDto = {
    id: 'produto-1',
    nome: 'Coca-Cola Zero',
    categoria_id: 'categoria-1',
    tempo_preparo: 5,
    preco: 6.00,
    descricao: 'Refrigerante Coca-Cola Zero 350ml',
    imagem: 'coca-cola-zero.jpg',
  };

  beforeEach(async () => {
    const mockProdutoService = {
      findAll: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByCategoriaId: jest.fn(),
      findByNome: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProdutoController],
      providers: [
        {
          provide: ProdutoService,
          useValue: mockProdutoService,
        },
      ],
    }).compile();

    produtoController = module.get<ProdutoController>(ProdutoController);
    produtoService = module.get(ProdutoService);
  });

  describe('findAll', () => {
    describe('when retrieving all produtos', () => {
      it('should return all produtos successfully', async () => {
        const mockProdutos = [mockProduto];
        produtoService.findAll.mockResolvedValue(mockProdutos);

        const result = await produtoController.findAll();

        expect(produtoService.findAll).toHaveBeenCalled();
        expect(result).toBe(mockProdutos);
      });

      it('should return empty array when no produtos exist', async () => {
        produtoService.findAll.mockResolvedValue([]);

        const result = await produtoController.findAll();

        expect(result).toEqual([]);
      });

      it('should return multiple produtos', async () => {
        const mockProdutos = [
          mockProduto,
          new Produto({
            id: 'produto-2',
            nome: 'Pepsi',
            categoria_id: 'categoria-1',
            tempo_preparo: 5,
            preco: 4.50,
            descricao: 'Refrigerante Pepsi 350ml',
            imagem: 'pepsi.jpg',
            categoria: mockCategoria,
          }),
        ];
        produtoService.findAll.mockResolvedValue(mockProdutos);

        const result = await produtoController.findAll();

        expect(result).toBe(mockProdutos);
        expect(result).toHaveLength(2);
      });
    });

    describe('when service fails', () => {
      it('should propagate errors from service', async () => {
        const error = new Error('Database connection failed');
        produtoService.findAll.mockRejectedValue(error);

        await expect(produtoController.findAll()).rejects.toThrow('Database connection failed');
      });
    });
  });

  describe('create', () => {
    describe('when creating a valid produto', () => {
      it('should create produto successfully', async () => {
        produtoService.create.mockResolvedValue(mockProduto);

        const result = await produtoController.create(mockCreateProdutoDto);

        expect(produtoService.create).toHaveBeenCalledWith(mockCreateProdutoDto);
        expect(result).toBe(mockProduto);
      });

      it('should create produto with different data', async () => {
        const differentDto = {
          nome: 'Pepsi',
          categoria_id: 'categoria-1',
          tempo_preparo: 5,
          preco: 4.50,
          descricao: 'Refrigerante Pepsi 350ml',
          imagem: 'pepsi.jpg',
        };
        const differentProduto = new Produto({ ...mockProduto, ...differentDto });
        produtoService.create.mockResolvedValue(differentProduto);

        const result = await produtoController.create(differentDto);

        expect(produtoService.create).toHaveBeenCalledWith(differentDto);
        expect(result).toBe(differentProduto);
      });
    });

    describe('when service fails', () => {
      it('should propagate validation errors', async () => {
        const error = new Error('Validation failed');
        produtoService.create.mockRejectedValue(error);

        await expect(produtoController.create(mockCreateProdutoDto)).rejects.toThrow('Validation failed');
      });
    });
  });

  describe('findById', () => {
    describe('when finding an existing produto', () => {
      it('should return produto by id successfully', async () => {
        produtoService.findById.mockResolvedValue(mockProduto);

        const result = await produtoController.findById('produto-1');

        expect(produtoService.findById).toHaveBeenCalledWith('produto-1');
        expect(result).toBe(mockProduto);
      });

      it('should find produto with different id', async () => {
        const differentProduto = new Produto({
          id: 'produto-2',
          nome: 'Pepsi',
          categoria_id: 'categoria-1',
          tempo_preparo: 5,
          preco: 4.50,
          descricao: 'Refrigerante Pepsi 350ml',
          imagem: 'pepsi.jpg',
          categoria: mockCategoria,
        });
        produtoService.findById.mockResolvedValue(differentProduto);

        const result = await produtoController.findById('produto-2');

        expect(produtoService.findById).toHaveBeenCalledWith('produto-2');
        expect(result).toBe(differentProduto);
      });
    });

    describe('when produto not found', () => {
      it('should propagate not found errors', async () => {
        const error = new Error('Produto not found');
        produtoService.findById.mockRejectedValue(error);

        await expect(produtoController.findById('non-existent')).rejects.toThrow('Produto not found');
      });
    });
  });

  describe('findByCategoriaId', () => {
    describe('when finding produtos by categoria', () => {
      it('should return produtos by categoria id successfully', async () => {
        const mockProdutos = [mockProduto];
        produtoService.findByCategoriaId.mockResolvedValue(mockProdutos);

        const result = await produtoController.findByCategoriaId('categoria-1');

        expect(produtoService.findByCategoriaId).toHaveBeenCalledWith('categoria-1');
        expect(result).toBe(mockProdutos);
      });

      it('should return multiple produtos for categoria', async () => {
        const mockProdutos = [
          mockProduto,
          new Produto({
            id: 'produto-2',
            nome: 'Pepsi',
            categoria_id: 'categoria-1',
            tempo_preparo: 5,
            preco: 4.50,
            descricao: 'Refrigerante Pepsi 350ml',
            imagem: 'pepsi.jpg',
            categoria: mockCategoria,
          }),
        ];
        produtoService.findByCategoriaId.mockResolvedValue(mockProdutos);

        const result = await produtoController.findByCategoriaId('categoria-1');

        expect(result).toBe(mockProdutos);
        expect(result).toHaveLength(2);
      });
    });

    describe('when no produtos found for categoria', () => {
      it('should propagate not found errors', async () => {
        const error = new Error('No produtos found for categoria');
        produtoService.findByCategoriaId.mockRejectedValue(error);

        await expect(produtoController.findByCategoriaId('non-existent')).rejects.toThrow('No produtos found for categoria');
      });
    });
  });

  describe('findByNome', () => {
    describe('when finding produtos by nome', () => {
      it('should return produtos by nome successfully', async () => {
        const mockProdutos = [mockProduto];
        produtoService.findByNome.mockResolvedValue(mockProdutos);

        const result = await produtoController.findByNome('Coca-Cola');

        expect(produtoService.findByNome).toHaveBeenCalledWith('Coca-Cola');
        expect(result).toBe(mockProdutos);
      });

      it('should return empty array when no produtos found', async () => {
        produtoService.findByNome.mockResolvedValue([]);

        const result = await produtoController.findByNome('Non-existent');

        expect(result).toEqual([]);
      });

      it('should find produtos with partial nome match', async () => {
        const mockProdutos = [
          mockProduto,
          new Produto({
            id: 'produto-2',
            nome: 'Coca-Cola Zero',
            categoria_id: 'categoria-1',
            tempo_preparo: 5,
            preco: 6.00,
            descricao: 'Refrigerante Coca-Cola Zero 350ml',
            imagem: 'coca-cola-zero.jpg',
            categoria: mockCategoria,
          }),
        ];
        produtoService.findByNome.mockResolvedValue(mockProdutos);

        const result = await produtoController.findByNome('Coca');

        expect(result).toBe(mockProdutos);
        expect(result).toHaveLength(2);
      });
    });

    describe('when search fails', () => {
      it('should propagate search errors', async () => {
        const error = new Error('Search failed');
        produtoService.findByNome.mockRejectedValue(error);

        await expect(produtoController.findByNome('Coca-Cola')).rejects.toThrow('Search failed');
      });
    });
  });

  describe('update', () => {
    describe('when updating an existing produto', () => {
      it('should update produto successfully', async () => {
        produtoService.update.mockResolvedValue(mockProduto);

        const result = await produtoController.update('produto-1', mockUpdateProdutoDto);

        expect(produtoService.update).toHaveBeenCalledWith('produto-1', mockUpdateProdutoDto);
        expect(result).toBe(mockProduto);
      });

      it('should update produto with different data', async () => {
        const differentDto = {
          id: 'produto-1',
          nome: 'Coca-Cola Zero',
          categoria_id: 'categoria-1',
          tempo_preparo: 5,
          preco: 6.00,
          descricao: 'Refrigerante Coca-Cola Zero 350ml',
          imagem: 'coca-cola-zero.jpg',
        };
        const updatedProduto = new Produto({ ...mockProduto, ...differentDto });
        produtoService.update.mockResolvedValue(updatedProduto);

        const result = await produtoController.update('produto-1', differentDto);

        expect(produtoService.update).toHaveBeenCalledWith('produto-1', differentDto);
        expect(result).toBe(updatedProduto);
      });
    });

    describe('when update fails', () => {
      it('should propagate update errors', async () => {
        const error = new Error('Update failed');
        produtoService.update.mockRejectedValue(error);

        await expect(produtoController.update('produto-1', mockUpdateProdutoDto)).rejects.toThrow('Update failed');
      });
    });
  });

  describe('delete', () => {
    describe('when deleting a produto', () => {
      it('should delete produto successfully', async () => {
        produtoService.delete.mockResolvedValue(mockProduto);

        const result = await produtoController.delete('produto-1');

        expect(produtoService.delete).toHaveBeenCalledWith('produto-1');
        expect(result).toBe(mockProduto);
      });

      it('should delete produto with different id', async () => {
        const differentProduto = new Produto({
          id: 'produto-2',
          nome: 'Pepsi',
          categoria_id: 'categoria-1',
          tempo_preparo: 5,
          preco: 4.50,
          descricao: 'Refrigerante Pepsi 350ml',
          imagem: 'pepsi.jpg',
          categoria: mockCategoria,
        });
        produtoService.delete.mockResolvedValue(differentProduto);

        const result = await produtoController.delete('produto-2');

        expect(produtoService.delete).toHaveBeenCalledWith('produto-2');
        expect(result).toBe(differentProduto);
      });
    });

    describe('when delete fails', () => {
      it('should propagate delete errors', async () => {
        const error = new Error('Delete failed');
        produtoService.delete.mockRejectedValue(error);

        await expect(produtoController.delete('produto-1')).rejects.toThrow('Delete failed');
      });
    });
  });

  describe('Controller Integration', () => {
    it('should handle multiple operations in sequence', async () => {
      // Create
      produtoService.create.mockResolvedValue(mockProduto);
      const created = await produtoController.create(mockCreateProdutoDto);
      expect(created).toBe(mockProduto);

      // Find by ID
      produtoService.findById.mockResolvedValue(mockProduto);
      const found = await produtoController.findById('produto-1');
      expect(found).toBe(mockProduto);

      // Update
      produtoService.update.mockResolvedValue(mockProduto);
      const updated = await produtoController.update('produto-1', mockUpdateProdutoDto);
      expect(updated).toBe(mockProduto);

      // Find all
      produtoService.findAll.mockResolvedValue([mockProduto]);
      const all = await produtoController.findAll();
      expect(all).toEqual([mockProduto]);

      // Delete
      produtoService.delete.mockResolvedValue(mockProduto);
      const deleted = await produtoController.delete('produto-1');
      expect(deleted).toBe(mockProduto);
    });

    it('should handle search operations correctly', async () => {
      const mockProdutos = [mockProduto];

      // Find by categoria
      produtoService.findByCategoriaId.mockResolvedValue(mockProdutos);
      const byCategoria = await produtoController.findByCategoriaId('categoria-1');
      expect(byCategoria).toBe(mockProdutos);

      // Find by nome
      produtoService.findByNome.mockResolvedValue(mockProdutos);
      const byNome = await produtoController.findByNome('Coca-Cola');
      expect(byNome).toBe(mockProdutos);
    });
  });
}); 