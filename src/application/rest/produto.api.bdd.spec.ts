import { Test, TestingModule } from '@nestjs/testing';
import { loadFeature, defineFeature } from 'jest-cucumber';
import { ProdutoController } from './produto.api';
import { ProdutoService } from '../../business/produto/produto.service';
import { Produto } from '../../domain/produto/produto.entity';
import { Categoria } from '../../domain/categoria/categoria.entity';
import { CategoriaType } from '../../domain/categoria/categoria.types';
import { CreateProdutoDto, UpdateProdutoDto } from '../dto/produto.dto';

const feature = loadFeature('./src/application/rest/produto.api.bdd.feature');

defineFeature(feature, (test) => {
  let produtoController: ProdutoController;
  let produtoService: jest.Mocked<ProdutoService>;
  let createProdutoDto: CreateProdutoDto;
  let updateProdutoDto: UpdateProdutoDto;
  let mockProduto: Produto;
  let result: any;
  let error: any;

  const mockCategoria = new Categoria({
    id: 'categoria-1',
    nome: 'Bebidas',
    tipo: CategoriaType.BEBIDA,
  });

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
    
    // Reset for each test
    result = undefined;
    error = undefined;
  });

  test('Criar um novo produto com sucesso', ({ given, when, then, and }) => {
    given('que eu tenho os dados válidos de um produto', () => {
      createProdutoDto = {
        nome: 'Coca-Cola',
        categoria_id: 'categoria-1',
        tempo_preparo: 5,
        preco: 5.50,
        descricao: 'Refrigerante Coca-Cola 350ml',
        imagem: 'coca-cola.jpg',
      };

      mockProduto = new Produto({
        id: 'produto-1',
        nome: 'Coca-Cola',
        categoria_id: 'categoria-1',
        tempo_preparo: 5,
        preco: 5.50,
        descricao: 'Refrigerante Coca-Cola 350ml',
        imagem: 'coca-cola.jpg',
        categoria: mockCategoria,
      });
    });

    when('eu enviar a requisição para criar o produto', async () => {
      produtoService.create.mockResolvedValue(mockProduto);
      try {
        result = await produtoController.create(createProdutoDto);
      } catch (err) {
        error = err;
      }
    });

    then('o produto deve ser criado com sucesso', () => {
      expect(error).toBeUndefined();
      expect(produtoService.create).toHaveBeenCalledWith(createProdutoDto);
    });

    and('os dados do produto devem ser retornados', () => {
      expect(result).toBe(mockProduto);
      expect(result.nome).toBe('Coca-Cola');
      expect(result.preco).toBe(5.50);
    });
  });

  test('Criar produto com dados inválidos', ({ given, when, then }) => {
    given('que eu tenho dados inválidos de um produto', () => {
      createProdutoDto = {
        nome: '',
        categoria_id: '',
        tempo_preparo: -1,
        preco: -5.50,
        descricao: '',
        imagem: '',
      };
    });

    when('eu enviar a requisição para criar o produto', async () => {
      const validationError = new Error('Validation failed: nome is required');
      produtoService.create.mockRejectedValue(validationError);
      
      try {
        result = await produtoController.create(createProdutoDto);
      } catch (err) {
        error = err;
      }
    });

    then('deve retornar um erro de validação', () => {
      expect(error).toBeDefined();
      expect(error.message).toContain('Validation failed');
      expect(result).toBeUndefined();
    });
  });

  test('Buscar produto por ID existente', ({ given, when, then, and }) => {
    given('que existe um produto com ID "produto-1"', () => {
      mockProduto = new Produto({
        id: 'produto-1',
        nome: 'Coca-Cola',
        categoria_id: 'categoria-1',
        tempo_preparo: 5,
        preco: 5.50,
        descricao: 'Refrigerante Coca-Cola 350ml',
        imagem: 'coca-cola.jpg',
        categoria: mockCategoria,
      });
    });

    when('eu buscar o produto pelo ID "produto-1"', async () => {
      produtoService.findById.mockResolvedValue(mockProduto);
      
      try {
        result = await produtoController.findById('produto-1');
      } catch (err) {
        error = err;
      }
    });

    then('o produto deve ser retornado', () => {
      expect(error).toBeUndefined();
      expect(result).toBe(mockProduto);
      expect(produtoService.findById).toHaveBeenCalledWith('produto-1');
    });

    and('deve conter todos os dados do produto', () => {
      expect(result.id).toBe('produto-1');
      expect(result.nome).toBe('Coca-Cola');
      expect(result.categoria_id).toBe('categoria-1');
      expect(result.preco).toBe(5.50);
    });
  });

  test('Buscar produto por ID inexistente', ({ given, when, then }) => {
    given('que não existe um produto com ID "produto-inexistente"', () => {
      // Setup mocking for non-existent product
    });

    when('eu buscar o produto pelo ID "produto-inexistente"', async () => {
      const notFoundError = new Error('Produto not found');
      produtoService.findById.mockRejectedValue(notFoundError);
      
      try {
        result = await produtoController.findById('produto-inexistente');
      } catch (err) {
        error = err;
      }
    });

    then('deve retornar um erro de produto não encontrado', () => {
      expect(error).toBeDefined();
      expect(error.message).toBe('Produto not found');
      expect(result).toBeUndefined();
      expect(produtoService.findById).toHaveBeenCalledWith('produto-inexistente');
    });
  });

  test('Buscar produtos por categoria', ({ given, when, then, and }) => {
    let mockProdutos: Produto[];

    given('que existem produtos da categoria "categoria-1"', () => {
      mockProdutos = [
        new Produto({
          id: 'produto-1',
          nome: 'Coca-Cola',
          categoria_id: 'categoria-1',
          tempo_preparo: 5,
          preco: 5.50,
          descricao: 'Refrigerante Coca-Cola 350ml',
          imagem: 'coca-cola.jpg',
          categoria: mockCategoria,
        }),
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
    });

    when('eu buscar produtos pela categoria "categoria-1"', async () => {
      produtoService.findByCategoriaId.mockResolvedValue(mockProdutos);
      
      try {
        result = await produtoController.findByCategoriaId('categoria-1');
      } catch (err) {
        error = err;
      }
    });

    then('uma lista de produtos deve ser retornada', () => {
      expect(error).toBeUndefined();
      expect(result).toBe(mockProdutos);
      expect(result).toHaveLength(2);
      expect(produtoService.findByCategoriaId).toHaveBeenCalledWith('categoria-1');
    });

    and('todos os produtos devem pertencer à categoria "categoria-1"', () => {
      result.forEach((produto: Produto) => {
        expect(produto.categoria_id).toBe('categoria-1');
      });
    });
  });

  test('Atualizar produto existente', ({ given, when, then, and }) => {
    given('que existe um produto com ID "produto-1"', () => {
      mockProduto = new Produto({
        id: 'produto-1',
        nome: 'Coca-Cola',
        categoria_id: 'categoria-1',
        tempo_preparo: 5,
        preco: 5.50,
        descricao: 'Refrigerante Coca-Cola 350ml',
        imagem: 'coca-cola.jpg',
        categoria: mockCategoria,
      });
    });

    given('eu tenho novos dados válidos para o produto', () => {
      updateProdutoDto = {
        id: 'produto-1',
        nome: 'Coca-Cola Zero',
        categoria_id: 'categoria-1',
        tempo_preparo: 5,
        preco: 6.00,
        descricao: 'Refrigerante Coca-Cola Zero 350ml',
        imagem: 'coca-cola-zero.jpg',
      };
    });

    when('eu enviar a requisição para atualizar o produto', async () => {
      const updatedProduto = new Produto({
        ...mockProduto,
        ...updateProdutoDto,
        categoria: mockCategoria,
      });
      
      produtoService.update.mockResolvedValue(updatedProduto);
      
      try {
        result = await produtoController.update('produto-1', updateProdutoDto);
      } catch (err) {
        error = err;
      }
    });

    then('o produto deve ser atualizado com sucesso', () => {
      expect(error).toBeUndefined();
      expect(produtoService.update).toHaveBeenCalledWith('produto-1', updateProdutoDto);
    });

    and('os novos dados devem ser retornados', () => {
      expect(result.nome).toBe('Coca-Cola Zero');
      expect(result.preco).toBe(6.00);
      expect(result.descricao).toBe('Refrigerante Coca-Cola Zero 350ml');
    });
  });

  test('Deletar produto existente', ({ given, when, then, and }) => {
    given('que existe um produto com ID "produto-1"', () => {
      mockProduto = new Produto({
        id: 'produto-1',
        nome: 'Coca-Cola',
        categoria_id: 'categoria-1',
        tempo_preparo: 5,
        preco: 5.50,
        descricao: 'Refrigerante Coca-Cola 350ml',
        imagem: 'coca-cola.jpg',
        categoria: mockCategoria,
      });
    });

    when('eu enviar a requisição para deletar o produto', async () => {
      produtoService.delete.mockResolvedValue(mockProduto);
      
      try {
        result = await produtoController.delete('produto-1');
      } catch (err) {
        error = err;
      }
    });

    then('o produto deve ser deletado com sucesso', () => {
      expect(error).toBeUndefined();
      expect(produtoService.delete).toHaveBeenCalledWith('produto-1');
    });

    and('os dados do produto deletado devem ser retornados', () => {
      expect(result).toBe(mockProduto);
      expect(result.id).toBe('produto-1');
      expect(result.nome).toBe('Coca-Cola');
    });
  });
});