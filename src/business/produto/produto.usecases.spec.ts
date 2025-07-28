import { Test, TestingModule } from '@nestjs/testing';
import { ProdutoUseCases } from './produto.usecases';
import { ProdutoRepository } from '../../infrastructure/persistence/repositories/produto.repository';
import { CategoriaUseCases } from '../categoria/categoria.usecases';
import { Produto } from '../../domain/produto/produto.entity';
import { Categoria } from '../../domain/categoria/categoria.entity';
import { CategoriaType } from '../../domain/categoria/categoria.types';
import { ValidationException, ValidationErrorType } from '../../domain/exceptions/validation.exception';
import { CreateProdutoDto, UpdateProdutoDto } from '../../application/dto/produto.dto';

describe('ProdutoUseCases', () => {
  let produtoUseCases: ProdutoUseCases;
  let produtoRepository: jest.Mocked<ProdutoRepository>;
  let categoriaUseCases: jest.Mocked<CategoriaUseCases>;

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
    const mockProdutoRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByCategoriaId: jest.fn(),
      findByNome: jest.fn(),
    };

    const mockCategoriaUseCases = {
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutoUseCases,
        {
          provide: ProdutoRepository,
          useValue: mockProdutoRepository,
        },
        {
          provide: CategoriaUseCases,
          useValue: mockCategoriaUseCases,
        },
      ],
    }).compile();

    produtoUseCases = module.get<ProdutoUseCases>(ProdutoUseCases);
    produtoRepository = module.get(ProdutoRepository);
    categoriaUseCases = module.get(CategoriaUseCases);
  });

  describe('create', () => {
    describe('when creating a valid produto with existing categoria', () => {
      it('should create a produto successfully', async () => {
        categoriaUseCases.findById.mockResolvedValue(mockCategoria);
        produtoRepository.save.mockResolvedValue(mockProduto);

        const result = await produtoUseCases.create(mockCreateProdutoDto);

        expect(categoriaUseCases.findById).toHaveBeenCalledWith('categoria-1');
        expect(produtoRepository.save).toHaveBeenCalledWith(expect.any(Produto));
        expect(result).toBe(mockProduto);
      });

      it('should create produto without categoria_id', async () => {
        const produtoWithoutCategoria = { ...mockCreateProdutoDto };
        delete produtoWithoutCategoria.categoria_id;
        
        produtoRepository.save.mockResolvedValue(mockProduto);

        const result = await produtoUseCases.create(produtoWithoutCategoria);

        expect(categoriaUseCases.findById).not.toHaveBeenCalled();
        expect(produtoRepository.save).toHaveBeenCalledWith(expect.any(Produto));
        expect(result).toBe(mockProduto);
      });

      it('should create produto with null categoria_id', async () => {
        const produtoWithNullCategoria = { ...mockCreateProdutoDto, categoria_id: null as any };
        
        produtoRepository.save.mockResolvedValue(mockProduto);

        const result = await produtoUseCases.create(produtoWithNullCategoria);

        expect(categoriaUseCases.findById).not.toHaveBeenCalled();
        expect(produtoRepository.save).toHaveBeenCalledWith(expect.any(Produto));
        expect(result).toBe(mockProduto);
      });
    });

    describe('when creating a produto with non-existent categoria', () => {
      it('should throw ValidationException when categoria not found', async () => {
        categoriaUseCases.findById.mockResolvedValue(null);

        await expect(produtoUseCases.create(mockCreateProdutoDto)).rejects.toThrow(ValidationException);
        await expect(produtoUseCases.create(mockCreateProdutoDto)).rejects.toThrow(ValidationErrorType.CATEGORIA_NOT_FOUND);
      });
    });

    describe('when repository fails', () => {
      it('should propagate categoria validation errors', async () => {
        const error = new Error('Categoria service failed');
        categoriaUseCases.findById.mockRejectedValue(error);

        await expect(produtoUseCases.create(mockCreateProdutoDto)).rejects.toThrow('Categoria service failed');
      });

      it('should propagate produto save errors', async () => {
        categoriaUseCases.findById.mockResolvedValue(mockCategoria);
        const error = new Error('Database connection failed');
        produtoRepository.save.mockRejectedValue(error);

        await expect(produtoUseCases.create(mockCreateProdutoDto)).rejects.toThrow('Database connection failed');
      });
    });
  });

  describe('update', () => {
    describe('when updating an existing produto', () => {
      it('should update produto successfully', async () => {
        produtoRepository.findById.mockResolvedValue(mockProduto);
        categoriaUseCases.findById.mockResolvedValue(mockCategoria);
        produtoRepository.update.mockResolvedValue(mockProduto);

        const result = await produtoUseCases.update('produto-1', mockUpdateProdutoDto);

        expect(produtoRepository.findById).toHaveBeenCalledWith('produto-1');
        expect(categoriaUseCases.findById).toHaveBeenCalledWith('categoria-1');
        expect(produtoRepository.update).toHaveBeenCalledWith('produto-1', expect.any(Produto));
        expect(result).toBe(mockProduto);
      });

      it('should update produto without categoria_id', async () => {
        produtoRepository.findById.mockResolvedValue(mockProduto);
        const updateDtoWithoutCategoria = { ...mockUpdateProdutoDto };
        delete updateDtoWithoutCategoria.categoria_id;
        
        produtoRepository.update.mockResolvedValue(mockProduto);

        const result = await produtoUseCases.update('produto-1', updateDtoWithoutCategoria);

        expect(categoriaUseCases.findById).not.toHaveBeenCalled();
        expect(produtoRepository.update).toHaveBeenCalledWith('produto-1', expect.any(Produto));
        expect(result).toBe(mockProduto);
      });
    });

    describe('when updating a non-existent produto', () => {
      it('should throw ValidationException when produto not found', async () => {
        produtoRepository.findById.mockResolvedValue(null);

        await expect(produtoUseCases.update('non-existent', mockUpdateProdutoDto)).rejects.toThrow(ValidationException);
        await expect(produtoUseCases.update('non-existent', mockUpdateProdutoDto)).rejects.toThrow(ValidationErrorType.PRODUTO_NOT_FOUND);
      });
    });

    describe('when updating with non-existent categoria', () => {
      it('should throw ValidationException when categoria not found', async () => {
        produtoRepository.findById.mockResolvedValue(mockProduto);
        categoriaUseCases.findById.mockResolvedValue(null);

        await expect(produtoUseCases.update('produto-1', mockUpdateProdutoDto)).rejects.toThrow(ValidationException);
        await expect(produtoUseCases.update('produto-1', mockUpdateProdutoDto)).rejects.toThrow(ValidationErrorType.CATEGORIA_NOT_FOUND);
      });
    });

    describe('when repository fails', () => {
      it('should propagate findById errors', async () => {
        const error = new Error('Database connection failed');
        produtoRepository.findById.mockRejectedValue(error);

        await expect(produtoUseCases.update('produto-1', mockUpdateProdutoDto)).rejects.toThrow('Database connection failed');
      });

      it('should propagate update errors', async () => {
        produtoRepository.findById.mockResolvedValue(mockProduto);
        categoriaUseCases.findById.mockResolvedValue(mockCategoria);
        const error = new Error('Update failed');
        produtoRepository.update.mockRejectedValue(error);

        await expect(produtoUseCases.update('produto-1', mockUpdateProdutoDto)).rejects.toThrow('Update failed');
      });
    });
  });

  describe('findAll', () => {
    describe('when finding all produtos', () => {
      it('should return all produtos', async () => {
        const mockProdutos = [mockProduto];
        produtoRepository.findAll.mockResolvedValue(mockProdutos);

        const result = await produtoUseCases.findAll();

        expect(produtoRepository.findAll).toHaveBeenCalled();
        expect(result).toBe(mockProdutos);
      });

      it('should return empty array when no produtos exist', async () => {
        produtoRepository.findAll.mockResolvedValue([]);

        const result = await produtoUseCases.findAll();

        expect(result).toEqual([]);
      });
    });

    describe('when repository fails', () => {
      it('should propagate repository errors', async () => {
        const error = new Error('Database connection failed');
        produtoRepository.findAll.mockRejectedValue(error);

        await expect(produtoUseCases.findAll()).rejects.toThrow('Database connection failed');
      });
    });
  });

  describe('findById', () => {
    describe('when finding an existing produto', () => {
      it('should return produto by id', async () => {
        produtoRepository.findById.mockResolvedValue(mockProduto);

        const result = await produtoUseCases.findById('produto-1');

        expect(produtoRepository.findById).toHaveBeenCalledWith('produto-1');
        expect(result).toBe(mockProduto);
      });
    });

    describe('when finding a non-existent produto', () => {
      it('should throw ValidationException when produto not found', async () => {
        produtoRepository.findById.mockResolvedValue(null);

        await expect(produtoUseCases.findById('non-existent')).rejects.toThrow(ValidationException);
        await expect(produtoUseCases.findById('non-existent')).rejects.toThrow(ValidationErrorType.PRODUTO_NOT_FOUND);
      });
    });

    describe('when repository fails', () => {
      it('should propagate repository errors', async () => {
        const error = new Error('Database connection failed');
        produtoRepository.findById.mockRejectedValue(error);

        await expect(produtoUseCases.findById('produto-1')).rejects.toThrow('Database connection failed');
      });
    });
  });

  describe('findByCategoriaId', () => {
    describe('when finding produtos by existing categoria', () => {
      it('should return produtos by categoria id', async () => {
        const mockProdutos = [mockProduto];
        produtoRepository.findByCategoriaId.mockResolvedValue(mockProdutos);

        const result = await produtoUseCases.findByCategoriaId('categoria-1');

        expect(produtoRepository.findByCategoriaId).toHaveBeenCalledWith('categoria-1');
        expect(result).toBe(mockProdutos);
      });
    });

    describe('when finding produtos by non-existent categoria', () => {
      it('should throw ValidationException when no produtos found', async () => {
        produtoRepository.findByCategoriaId.mockResolvedValue([]);

        await expect(produtoUseCases.findByCategoriaId('non-existent')).rejects.toThrow(ValidationException);
        await expect(produtoUseCases.findByCategoriaId('non-existent')).rejects.toThrow(ValidationErrorType.PRODUTO_NOT_FOUND);
      });

      it('should throw ValidationException when null produtos returned', async () => {
        produtoRepository.findByCategoriaId.mockResolvedValue(null);

        await expect(produtoUseCases.findByCategoriaId('non-existent')).rejects.toThrow(ValidationException);
        await expect(produtoUseCases.findByCategoriaId('non-existent')).rejects.toThrow(ValidationErrorType.PRODUTO_NOT_FOUND);
      });
    });

    describe('when repository fails', () => {
      it('should propagate repository errors', async () => {
        const error = new Error('Database connection failed');
        produtoRepository.findByCategoriaId.mockRejectedValue(error);

        await expect(produtoUseCases.findByCategoriaId('categoria-1')).rejects.toThrow('Database connection failed');
      });
    });
  });

  describe('findByNome', () => {
    describe('when finding produtos by nome', () => {
      it('should return produtos by nome', async () => {
        const mockProdutos = [mockProduto];
        produtoRepository.findByNome.mockResolvedValue(mockProdutos);

        const result = await produtoUseCases.findByNome('Coca-Cola');

        expect(produtoRepository.findByNome).toHaveBeenCalledWith('Coca-Cola');
        expect(result).toBe(mockProdutos);
      });

      it('should return empty array when no produtos found by nome', async () => {
        produtoRepository.findByNome.mockResolvedValue([]);

        const result = await produtoUseCases.findByNome('Non-existent');

        expect(result).toEqual([]);
      });
    });

    describe('when repository fails', () => {
      it('should propagate repository errors', async () => {
        const error = new Error('Database connection failed');
        produtoRepository.findByNome.mockRejectedValue(error);

        await expect(produtoUseCases.findByNome('Coca-Cola')).rejects.toThrow('Database connection failed');
      });
    });
  });

  describe('delete', () => {
    describe('when deleting a produto', () => {
      it('should delete produto successfully', async () => {
        produtoRepository.delete.mockResolvedValue(mockProduto);

        const result = await produtoUseCases.delete('produto-1');

        expect(produtoRepository.delete).toHaveBeenCalledWith('produto-1');
        expect(result).toBe(mockProduto);
      });
    });

    describe('when repository fails', () => {
      it('should propagate repository errors', async () => {
        const error = new Error('Database connection failed');
        produtoRepository.delete.mockRejectedValue(error);

        await expect(produtoUseCases.delete('produto-1')).rejects.toThrow('Database connection failed');
      });
    });
  });
}); 