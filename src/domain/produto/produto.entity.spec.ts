import { Produto } from './produto.entity';
import { Categoria } from '../categoria/categoria.entity';
import { CategoriaType } from '../categoria/categoria.types';

describe('Produto Entity', () => {
  let produto: Produto;
  let categoria: Categoria;

  beforeEach(() => {
    categoria = new Categoria({
      id: 'categoria-1',
      nome: 'Bebidas',
      tipo: CategoriaType.BEBIDA,
    });

    produto = new Produto({
      id: 'produto-1',
      nome: 'Coca-Cola',
      categoria_id: 'categoria-1',
      tempo_preparo: 5,
      preco: 5.50,
      descricao: 'Refrigerante Coca-Cola 350ml',
      imagem: 'coca-cola.jpg',
      categoria: categoria,
    });
  });

  describe('Constructor', () => {
    it('should create a produto with all properties', () => {
      expect(produto.id).toBe('produto-1');
      expect(produto.nome).toBe('Coca-Cola');
      expect(produto.categoria_id).toBe('categoria-1');
      expect(produto.tempo_preparo).toBe(5);
      expect(produto.preco).toBe(5.50);
      expect(produto.descricao).toBe('Refrigerante Coca-Cola 350ml');
      expect(produto.imagem).toBe('coca-cola.jpg');
      expect(produto.categoria).toBe(categoria);
    });

    it('should create a produto with partial data', () => {
      const partialProduto = new Produto({
        nome: 'Pepsi',
        preco: 4.50,
      });

      expect(partialProduto.nome).toBe('Pepsi');
      expect(partialProduto.preco).toBe(4.50);
      expect(partialProduto.id).toBeUndefined();
      expect(partialProduto.categoria_id).toBeUndefined();
    });

    it('should create an empty produto when no data is provided', () => {
      const emptyProduto = new Produto({});

      expect(emptyProduto.id).toBeUndefined();
      expect(emptyProduto.nome).toBeUndefined();
      expect(emptyProduto.categoria_id).toBeUndefined();
      expect(emptyProduto.tempo_preparo).toBeUndefined();
      expect(emptyProduto.preco).toBeUndefined();
      expect(emptyProduto.descricao).toBeUndefined();
      expect(emptyProduto.imagem).toBeUndefined();
      expect(emptyProduto.categoria).toBeUndefined();
    });
  });

  describe('Getters', () => {
    it('should return correct id', () => {
      expect(produto.id).toBe('produto-1');
    });

    it('should return correct nome', () => {
      expect(produto.nome).toBe('Coca-Cola');
    });

    it('should return correct categoria_id', () => {
      expect(produto.categoria_id).toBe('categoria-1');
    });

    it('should return correct tempo_preparo', () => {
      expect(produto.tempo_preparo).toBe(5);
    });

    it('should return correct preco', () => {
      expect(produto.preco).toBe(5.50);
    });

    it('should return correct descricao', () => {
      expect(produto.descricao).toBe('Refrigerante Coca-Cola 350ml');
    });

    it('should return correct imagem', () => {
      expect(produto.imagem).toBe('coca-cola.jpg');
    });

    it('should return correct categoria', () => {
      expect(produto.categoria).toBe(categoria);
    });
  });

  describe('Setters', () => {
    it('should update nome and set updated_at', () => {
      const originalUpdatedAt = produto.updated_at;
      
      produto.nome = 'Coca-Cola Zero';
      
      expect(produto.nome).toBe('Coca-Cola Zero');
      expect(produto.updated_at).not.toBe(originalUpdatedAt);
    });

    it('should update categoria_id and set updated_at', () => {
      const originalUpdatedAt = produto.updated_at;
      
      produto.categoria_id = 'categoria-2';
      
      expect(produto.categoria_id).toBe('categoria-2');
      expect(produto.updated_at).not.toBe(originalUpdatedAt);
    });

    it('should update tempo_preparo and set updated_at', () => {
      const originalUpdatedAt = produto.updated_at;
      
      produto.tempo_preparo = 10;
      
      expect(produto.tempo_preparo).toBe(10);
      expect(produto.updated_at).not.toBe(originalUpdatedAt);
    });

    it('should update preco and set updated_at', () => {
      const originalUpdatedAt = produto.updated_at;
      
      produto.preco = 6.00;
      
      expect(produto.preco).toBe(6.00);
      expect(produto.updated_at).not.toBe(originalUpdatedAt);
    });

    it('should update descricao and set updated_at', () => {
      const originalUpdatedAt = produto.updated_at;
      
      produto.descricao = 'Refrigerante Coca-Cola Zero 350ml';
      
      expect(produto.descricao).toBe('Refrigerante Coca-Cola Zero 350ml');
      expect(produto.updated_at).not.toBe(originalUpdatedAt);
    });

    it('should update imagem and set updated_at', () => {
      const originalUpdatedAt = produto.updated_at;
      
      produto.imagem = 'coca-cola-zero.jpg';
      
      expect(produto.imagem).toBe('coca-cola-zero.jpg');
      expect(produto.updated_at).not.toBe(originalUpdatedAt);
    });

    it('should update categoria without affecting updated_at', () => {
      const originalUpdatedAt = produto.updated_at;
      const newCategoria = new Categoria({
        id: 'categoria-2',
        nome: 'Sobremesas',
        tipo: CategoriaType.SOBREMESA,
      });
      
      produto.categoria = newCategoria;
      
      expect(produto.categoria).toBe(newCategoria);
      expect(produto.updated_at).toBe(originalUpdatedAt);
    });

    it('should set categoria to undefined', () => {
      produto.categoria = undefined;
      
      expect(produto.categoria).toBeUndefined();
    });
  });

  describe('Behavior', () => {
    it('should maintain data integrity when multiple properties are updated', () => {
      produto.nome = 'Coca-Cola Zero';
      produto.preco = 6.00;
      produto.descricao = 'Refrigerante Coca-Cola Zero 350ml';

      expect(produto.nome).toBe('Coca-Cola Zero');
      expect(produto.preco).toBe(6.00);
      expect(produto.descricao).toBe('Refrigerante Coca-Cola Zero 350ml');
      expect(produto.categoria_id).toBe('categoria-1'); // Should remain unchanged
      expect(produto.tempo_preparo).toBe(5); // Should remain unchanged
    });

    it('should handle numeric values correctly', () => {
      produto.tempo_preparo = 0;
      produto.preco = 0;

      expect(produto.tempo_preparo).toBe(0);
      expect(produto.preco).toBe(0);
    });

    it('should handle empty string values', () => {
      produto.nome = '';
      produto.descricao = '';
      produto.imagem = '';

      expect(produto.nome).toBe('');
      expect(produto.descricao).toBe('');
      expect(produto.imagem).toBe('');
    });

    it('should handle negative numeric values', () => {
      produto.tempo_preparo = -5;
      produto.preco = -10.50;

      expect(produto.tempo_preparo).toBe(-5);
      expect(produto.preco).toBe(-10.50);
    });

    it('should handle decimal numeric values', () => {
      produto.tempo_preparo = 5.5;
      produto.preco = 10.99;

      expect(produto.tempo_preparo).toBe(5.5);
      expect(produto.preco).toBe(10.99);
    });

    it('should handle special characters in strings', () => {
      produto.nome = 'Coca-Cola & Pepsi';
      produto.descricao = 'Refrigerante com açúcar (350ml)';
      produto.imagem = 'coca-cola_pepsi.jpg';

      expect(produto.nome).toBe('Coca-Cola & Pepsi');
      expect(produto.descricao).toBe('Refrigerante com açúcar (350ml)');
      expect(produto.imagem).toBe('coca-cola_pepsi.jpg');
    });

    it('should handle long string values', () => {
      const longNome = 'Produto com nome muito longo para testar o comportamento da entidade quando recebe strings extensas';
      const longDescricao = 'Descrição muito longa do produto que pode conter muitas informações detalhadas sobre as características, ingredientes, modo de preparo e outras informações relevantes para o cliente';
      
      produto.nome = longNome;
      produto.descricao = longDescricao;

      expect(produto.nome).toBe(longNome);
      expect(produto.descricao).toBe(longDescricao);
    });
  });
}); 