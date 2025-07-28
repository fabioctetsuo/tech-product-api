import { Test, TestingModule } from '@nestjs/testing';
import { ProdutoService } from './produto.service';
import { ProdutoUseCases } from './produto.usecases';
import { Produto } from '../../domain/produto/produto.entity';
import { Categoria } from '../../domain/categoria/categoria.entity';
import { CategoriaType } from '../../domain/categoria/categoria.types';
import { CreateProdutoDto, UpdateProdutoDto } from '../../application/dto/produto.dto';

describe('ProdutoService', () => {
  let produtoService: ProdutoService;
  let produtoUseCases: jest.Mocked<ProdutoUseCases>;

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
    const mockProdutoUseCases = {
      findAll: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByCategoriaId: jest.fn(),
      findByNome: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutoService,
        {
          provide: ProdutoUseCases,
          useValue: mockProdutoUseCases,
        },
      ],
    }).compile();

    produtoService = module.get<ProdutoService>(ProdutoService);
    produtoUseCases = module.get(ProdutoUseCases);
  });

  describe('findAll', () => {
    describe('when retrieving all produtos', () => {
      it('should return all produtos successfully', async () => {
        const mockProdutos = [mockProduto];
        produtoUseCases.findAll.mockResolvedValue(mockProdutos);

        const result = await produtoService.findAll();

        expect(produtoUseCases.findAll).toHaveBeenCalled();
        expect(result).toBe(mockProdutos);
      });

      it('should return empty array when no produtos exist', async () => {
        produtoUseCases.findAll.mockResolvedValue([]);

        const result = await produtoService.findAll();

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
        produtoUseCases.findAll.mockResolvedValue(mockProdutos);

        const result = await produtoService.findAll();

        expect(result).toBe(mockProdutos);
        expect(result).toHaveLength(2);
      });
    });

    describe('when use cases fail', () => {
      it('should propagate errors from use cases', async () => {
        const error = new Error('Database connection failed');
        produtoUseCases.findAll.mockRejectedValue(error);

        await expect(produtoService.findAll()).rejects.toThrow('Database connection failed');
      });
    });
  });

  describe('create', () => {
    describe('when creating a valid produto', () => {
      it('should create produto successfully', async () => {
        produtoUseCases.create.mockResolvedValue(mockProduto);

        const result = await produtoService.create(mockCreateProdutoDto);

        expect(produtoUseCases.create).toHaveBeenCalledWith(mockCreateProdutoDto);
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
        produtoUseCases.create.mockResolvedValue(differentProduto);

        const result = await produtoService.create(differentDto);

        expect(produtoUseCases.create).toHaveBeenCalledWith(differentDto);
        expect(result).toBe(differentProduto);
      });
    });

    describe('when use cases fail', () => {
      it('should propagate validation errors', async () => {
        const error = new Error('Validation failed');
        produtoUseCases.create.mockRejectedValue(error);

        await expect(produtoService.create(mockCreateProdutoDto)).rejects.toThrow('Validation failed');
      });
    });
  });

  describe('findById', () => {
    describe('when finding an existing produto', () => {
      it('should return produto by id successfully', async () => {
        produtoUseCases.findById.mockResolvedValue(mockProduto);

        const result = await produtoService.findById('produto-1');

        expect(produtoUseCases.findById).toHaveBeenCalledWith('produto-1');
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
        produtoUseCases.findById.mockResolvedValue(differentProduto);

        const result = await produtoService.findById('produto-2');

        expect(produtoUseCases.findById).toHaveBeenCalledWith('produto-2');
        expect(result).toBe(differentProduto);
      });
    });

    describe('when produto not found', () => {
      it('should propagate not found errors', async () => {
        const error = new Error('Produto not found');
        produtoUseCases.findById.mockRejectedValue(error);

        await expect(produtoService.findById('non-existent')).rejects.toThrow('Produto not found');
      });
    });
  });

  describe('update', () => {
    describe('when updating an existing produto', () => {
      it('should update produto successfully', async () => {
        produtoUseCases.update.mockResolvedValue(mockProduto);

        const result = await produtoService.update('produto-1', mockUpdateProdutoDto);

        expect(produtoUseCases.update).toHaveBeenCalledWith('produto-1', mockUpdateProdutoDto);
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
        produtoUseCases.update.mockResolvedValue(updatedProduto);

        const result = await produtoService.update('produto-1', differentDto);

        expect(produtoUseCases.update).toHaveBeenCalledWith('produto-1', differentDto);
        expect(result).toBe(updatedProduto);
      });
    });

    describe('when update fails', () => {
      it('should propagate update errors', async () => {
        const error = new Error('Update failed');
        produtoUseCases.update.mockRejectedValue(error);

        await expect(produtoService.update('produto-1', mockUpdateProdutoDto)).rejects.toThrow('Update failed');
      });
    });
  });

  describe('delete', () => {
    describe('when deleting a produto', () => {
      it('should delete produto successfully', async () => {
        produtoUseCases.delete.mockResolvedValue(mockProduto);

        const result = await produtoService.delete('produto-1');

        expect(produtoUseCases.delete).toHaveBeenCalledWith('produto-1');
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
        produtoUseCases.delete.mockResolvedValue(differentProduto);

        const result = await produtoService.delete('produto-2');

        expect(produtoUseCases.delete).toHaveBeenCalledWith('produto-2');
        expect(result).toBe(differentProduto);
      });
    });

    describe('when delete fails', () => {
      it('should propagate delete errors', async () => {
        const error = new Error('Delete failed');
        produtoUseCases.delete.mockRejectedValue(error);

        await expect(produtoService.delete('produto-1')).rejects.toThrow('Delete failed');
      });
    });
  });

  describe('findByCategoriaId', () => {
    describe('when finding produtos by categoria', () => {
      it('should return produtos by categoria id successfully', async () => {
        const mockProdutos = [mockProduto];
        produtoUseCases.findByCategoriaId.mockResolvedValue(mockProdutos);

        const result = await produtoService.findByCategoriaId('categoria-1');

        expect(produtoUseCases.findByCategoriaId).toHaveBeenCalledWith('categoria-1');
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
        produtoUseCases.findByCategoriaId.mockResolvedValue(mockProdutos);

        const result = await produtoService.findByCategoriaId('categoria-1');

        expect(result).toBe(mockProdutos);
        expect(result).toHaveLength(2);
      });
    });

    describe('when no produtos found for categoria', () => {
      it('should propagate not found errors', async () => {
        const error = new Error('No produtos found for categoria');
        produtoUseCases.findByCategoriaId.mockRejectedValue(error);

        await expect(produtoService.findByCategoriaId('non-existent')).rejects.toThrow('No produtos found for categoria');
      });
    });
  });

  describe('findByNome', () => {
    describe('when finding produtos by nome', () => {
      it('should return produtos by nome successfully', async () => {
        const mockProdutos = [mockProduto];
        produtoUseCases.findByNome.mockResolvedValue(mockProdutos);

        const result = await produtoService.findByNome('Coca-Cola');

        expect(produtoUseCases.findByNome).toHaveBeenCalledWith('Coca-Cola');
        expect(result).toBe(mockProdutos);
      });

      it('should return empty array when no produtos found', async () => {
        produtoUseCases.findByNome.mockResolvedValue([]);

        const result = await produtoService.findByNome('Non-existent');

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
        produtoUseCases.findByNome.mockResolvedValue(mockProdutos);

        const result = await produtoService.findByNome('Coca');

        expect(result).toBe(mockProdutos);
        expect(result).toHaveLength(2);
      });
    });

    describe('when search fails', () => {
      it('should propagate search errors', async () => {
        const error = new Error('Search failed');
        produtoUseCases.findByNome.mockRejectedValue(error);

        await expect(produtoService.findByNome('Coca-Cola')).rejects.toThrow('Search failed');
      });
    });
  });

  describe('Service Integration', () => {
    it('should handle multiple operations in sequence', async () => {
      // Create
      produtoUseCases.create.mockResolvedValue(mockProduto);
      const created = await produtoService.create(mockCreateProdutoDto);
      expect(created).toBe(mockProduto);

      // Find by ID
      produtoUseCases.findById.mockResolvedValue(mockProduto);
      const found = await produtoService.findById('produto-1');
      expect(found).toBe(mockProduto);

      // Update
      produtoUseCases.update.mockResolvedValue(mockProduto);
      const updated = await produtoService.update('produto-1', mockUpdateProdutoDto);
      expect(updated).toBe(mockProduto);

      // Find all
      produtoUseCases.findAll.mockResolvedValue([mockProduto]);
      const all = await produtoService.findAll();
      expect(all).toEqual([mockProduto]);

      // Delete
      produtoUseCases.delete.mockResolvedValue(mockProduto);
      const deleted = await produtoService.delete('produto-1');
      expect(deleted).toBe(mockProduto);
    });
  });
}); 