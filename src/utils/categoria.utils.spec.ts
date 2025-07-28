import { validateCategoriaType } from './categoria.utils';
import { CategoriaType } from '../domain/categoria/categoria.types';

describe('Categoria Utils', () => {
  describe('validateCategoriaType', () => {
    describe('when given valid categoria types', () => {
      it('should return true for BEBIDA type', () => {
        const result = validateCategoriaType(CategoriaType.BEBIDA);
        expect(result).toBe(true);
      });

      it('should return true for SOBREMESA type', () => {
        const result = validateCategoriaType(CategoriaType.SOBREMESA);
        expect(result).toBe(true);
      });

      it('should return true for ACOMPANHAMENTO type', () => {
        const result = validateCategoriaType(CategoriaType.ACOMPANHAMENTO);
        expect(result).toBe(true);
      });

      it('should return true for LANCHE type', () => {
        const result = validateCategoriaType(CategoriaType.LANCHE);
        expect(result).toBe(true);
      });

      it('should return true for all enum values', () => {
        const allTypes = Object.values(CategoriaType);
        
        allTypes.forEach(tipo => {
          const result = validateCategoriaType(tipo);
          expect(result).toBe(true);
        });
      });
    });

    describe('when given invalid categoria types', () => {
      it('should return false for undefined', () => {
        const result = validateCategoriaType(undefined as any);
        expect(result).toBe(false);
      });

      it('should return false for null', () => {
        const result = validateCategoriaType(null as any);
        expect(result).toBe(false);
      });

      it('should return false for empty string', () => {
        const result = validateCategoriaType('' as any);
        expect(result).toBe(false);
      });

      it('should return false for random string', () => {
        const result = validateCategoriaType('INVALID_TYPE' as any);
        expect(result).toBe(false);
      });

      it('should return false for case-sensitive variations', () => {
        const result = validateCategoriaType('bebida' as any);
        expect(result).toBe(false);
      });

      it('should return false for partial matches', () => {
        const result = validateCategoriaType('BEBID' as any);
        expect(result).toBe(false);
      });

      it('should return false for numeric values', () => {
        const result = validateCategoriaType(1 as any);
        expect(result).toBe(false);
      });

      it('should return false for boolean values', () => {
        const result = validateCategoriaType(true as any);
        expect(result).toBe(false);
      });

      it('should return false for object values', () => {
        const result = validateCategoriaType({} as any);
        expect(result).toBe(false);
      });

      it('should return false for array values', () => {
        const result = validateCategoriaType([] as any);
        expect(result).toBe(false);
      });
    });

    describe('when given edge cases', () => {
      it('should return false for whitespace strings', () => {
        const result = validateCategoriaType(' ' as any);
        expect(result).toBe(false);
      });

      it('should return false for strings with special characters', () => {
        const result = validateCategoriaType('BEBIDA!' as any);
        expect(result).toBe(false);
      });

      it('should return false for strings with numbers', () => {
        const result = validateCategoriaType('BEBIDA123' as any);
        expect(result).toBe(false);
      });

      it('should return false for strings with spaces', () => {
        const result = validateCategoriaType('BEBIDA ' as any);
        expect(result).toBe(false);
      });
    });

    describe('behavior consistency', () => {
      it('should always return the same result for the same input', () => {
        const input = CategoriaType.BEBIDA;
        const result1 = validateCategoriaType(input);
        const result2 = validateCategoriaType(input);
        const result3 = validateCategoriaType(input);

        expect(result1).toBe(result2);
        expect(result2).toBe(result3);
        expect(result1).toBe(true);
      });

      it('should handle multiple calls with different valid types', () => {
        const types = [CategoriaType.BEBIDA, CategoriaType.SOBREMESA, CategoriaType.ACOMPANHAMENTO, CategoriaType.LANCHE];
        
        types.forEach(tipo => {
          const result = validateCategoriaType(tipo);
          expect(result).toBe(true);
        });
      });

      it('should handle multiple calls with different invalid types', () => {
        const invalidTypes = ['INVALID', 'WRONG', 'TEST', 'FAKE'];
        
        invalidTypes.forEach(tipo => {
          const result = validateCategoriaType(tipo as any);
          expect(result).toBe(false);
        });
      });
    });
  });
}); 