import { Categoria } from './categoria.entity';
import { CategoriaType } from './categoria.types';

describe('Categoria Entity', () => {
  let categoria: Categoria;

  beforeEach(() => {
    categoria = new Categoria({
      id: 'categoria-1',
      nome: 'Bebidas',
      tipo: CategoriaType.BEBIDA,
    });
  });

  describe('Constructor', () => {
    it('should create a categoria with all properties', () => {
      expect(categoria.id).toBe('categoria-1');
      expect(categoria.nome).toBe('Bebidas');
      expect(categoria.tipo).toBe(CategoriaType.BEBIDA);
    });

    it('should create a categoria with partial data', () => {
      const partialCategoria = new Categoria({
        nome: 'Sobremesas',
        tipo: CategoriaType.SOBREMESA,
      });

      expect(partialCategoria.nome).toBe('Sobremesas');
      expect(partialCategoria.tipo).toBe(CategoriaType.SOBREMESA);
      expect(partialCategoria.id).toBeUndefined();
    });

    it('should create an empty categoria when no data is provided', () => {
      const emptyCategoria = new Categoria({});

      expect(emptyCategoria.id).toBeUndefined();
      expect(emptyCategoria.nome).toBeUndefined();
      expect(emptyCategoria.tipo).toBeUndefined();
    });

    it('should create categoria with different types', () => {
      const bebidaCategoria = new Categoria({
        id: 'bebida-1',
        nome: 'Bebidas',
        tipo: CategoriaType.BEBIDA,
      });

      const sobremesaCategoria = new Categoria({
        id: 'sobremesa-1',
        nome: 'Sobremesas',
        tipo: CategoriaType.SOBREMESA,
      });

      const acompanhamentoCategoria = new Categoria({
        id: 'acompanhamento-1',
        nome: 'Acompanhamentos',
        tipo: CategoriaType.ACOMPANHAMENTO,
      });

      const lancheCategoria = new Categoria({
        id: 'lanche-1',
        nome: 'Lanches',
        tipo: CategoriaType.LANCHE,
      });

      expect(bebidaCategoria.tipo).toBe(CategoriaType.BEBIDA);
      expect(sobremesaCategoria.tipo).toBe(CategoriaType.SOBREMESA);
      expect(acompanhamentoCategoria.tipo).toBe(CategoriaType.ACOMPANHAMENTO);
      expect(lancheCategoria.tipo).toBe(CategoriaType.LANCHE);
    });
  });

  describe('Getters', () => {
    it('should return correct id', () => {
      expect(categoria.id).toBe('categoria-1');
    });

    it('should return correct nome', () => {
      expect(categoria.nome).toBe('Bebidas');
    });

    it('should return correct tipo', () => {
      expect(categoria.tipo).toBe(CategoriaType.BEBIDA);
    });

    it('should return created_at and updated_at dates', () => {
      expect(categoria.created_at).toBeUndefined();
      expect(categoria.updated_at).toBeDefined();
    });
  });

  describe('Setters', () => {
    it('should update nome and set updated_at', () => {
      const originalUpdatedAt = categoria.updated_at;
      
      categoria.nome = 'Refrigerantes';
      
      expect(categoria.nome).toBe('Refrigerantes');
      expect(categoria.updated_at).not.toBe(originalUpdatedAt);
    });

    it('should update tipo and set updated_at', () => {
      const originalUpdatedAt = categoria.updated_at;
      
      categoria.tipo = CategoriaType.SOBREMESA;
      
      expect(categoria.tipo).toBe(CategoriaType.SOBREMESA);
      expect(categoria.updated_at).not.toBe(originalUpdatedAt);
    });

    it('should handle empty string nome', () => {
      categoria.nome = '';
      
      expect(categoria.nome).toBe('');
    });

    it('should handle all categoria types', () => {
      categoria.tipo = CategoriaType.BEBIDA;
      expect(categoria.tipo).toBe(CategoriaType.BEBIDA);

      categoria.tipo = CategoriaType.SOBREMESA;
      expect(categoria.tipo).toBe(CategoriaType.SOBREMESA);

      categoria.tipo = CategoriaType.ACOMPANHAMENTO;
      expect(categoria.tipo).toBe(CategoriaType.ACOMPANHAMENTO);

      categoria.tipo = CategoriaType.LANCHE;
      expect(categoria.tipo).toBe(CategoriaType.LANCHE);
    });
  });

  describe('Behavior', () => {
    it('should maintain data integrity when multiple properties are updated', () => {
      categoria.nome = 'Refrigerantes';
      categoria.tipo = CategoriaType.SOBREMESA;

      expect(categoria.nome).toBe('Refrigerantes');
      expect(categoria.tipo).toBe(CategoriaType.SOBREMESA);
      expect(categoria.id).toBe('categoria-1'); // Should remain unchanged
    });

    it('should handle multiple updates and track updated_at correctly', () => {
      categoria.nome = 'First Update';
      categoria.tipo = CategoriaType.LANCHE;

      expect(categoria.nome).toBe('First Update');
      expect(categoria.tipo).toBe(CategoriaType.LANCHE);
    });

    it('should handle special characters in nome', () => {
      categoria.nome = 'Bebidas & Refrigerantes';
      
      expect(categoria.nome).toBe('Bebidas & Refrigerantes');
    });

    it('should handle long nome strings', () => {
      const longNome = 'Categoria com nome muito longo para testar o comportamento da entidade';
      categoria.nome = longNome;
      
      expect(categoria.nome).toBe(longNome);
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined values in constructor', () => {
      const categoriaWithUndefined = new Categoria({
        id: undefined,
        nome: undefined,
        tipo: undefined,
      });

      expect(categoriaWithUndefined.id).toBeUndefined();
      expect(categoriaWithUndefined.nome).toBeUndefined();
      expect(categoriaWithUndefined.tipo).toBeUndefined();
    });

    it('should handle null values in constructor', () => {
      const categoriaWithNull = new Categoria({
        id: null as any,
        nome: null as any,
        tipo: null as any,
      });

      expect(categoriaWithNull.id).toBeUndefined();
      expect(categoriaWithNull.nome).toBeUndefined();
      expect(categoriaWithNull.tipo).toBeUndefined();
    });
  });
}); 