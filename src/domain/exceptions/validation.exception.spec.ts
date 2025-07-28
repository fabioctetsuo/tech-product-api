import { ValidationException, ValidationErrorType } from './validation.exception';

describe('ValidationException', () => {
  describe('Constructor', () => {
    it('should create ValidationException with CATEGORIA_NOT_FOUND error type', () => {
      const exception = new ValidationException(ValidationErrorType.CATEGORIA_NOT_FOUND);

      expect(exception).toBeInstanceOf(ValidationException);
      expect(exception.message).toBe(`Validation error: ${ValidationErrorType.CATEGORIA_NOT_FOUND}`);
      expect(exception.name).toBe('ValidationException');
    });

    it('should create ValidationException with PRODUTO_NOT_FOUND error type', () => {
      const exception = new ValidationException(ValidationErrorType.PRODUTO_NOT_FOUND);

      expect(exception).toBeInstanceOf(ValidationException);
      expect(exception.message).toBe(`Validation error: ${ValidationErrorType.PRODUTO_NOT_FOUND}`);
      expect(exception.name).toBe('ValidationException');
    });

    it('should create ValidationException with CATEGORIA_INVALID_TYPE error type', () => {
      const exception = new ValidationException(ValidationErrorType.CATEGORIA_INVALID_TYPE);

      expect(exception).toBeInstanceOf(ValidationException);
      expect(exception.message).toBe(`Validation error: ${ValidationErrorType.CATEGORIA_INVALID_TYPE}`);
      expect(exception.name).toBe('ValidationException');
    });
  });

  describe('Error Types', () => {
    it('should have CATEGORIA_NOT_FOUND error type', () => {
      expect(ValidationErrorType.CATEGORIA_NOT_FOUND).toBe('CATEGORIA_NOT_FOUND');
    });

    it('should have PRODUTO_NOT_FOUND error type', () => {
      expect(ValidationErrorType.PRODUTO_NOT_FOUND).toBe('PRODUTO_NOT_FOUND');
    });

    it('should have CATEGORIA_INVALID_TYPE error type', () => {
      expect(ValidationErrorType.CATEGORIA_INVALID_TYPE).toBe('CATEGORIA_INVALID_TYPE');
    });

    it('should have all expected error types', () => {
      const expectedErrorTypes = [
        'CATEGORIA_NOT_FOUND',
        'PRODUTO_NOT_FOUND',
        'CATEGORIA_INVALID_TYPE',
      ];

      const actualErrorTypes = Object.values(ValidationErrorType);

      expect(actualErrorTypes).toEqual(expect.arrayContaining(expectedErrorTypes));
      expect(actualErrorTypes).toContain('CATEGORIA_NOT_FOUND');
      expect(actualErrorTypes).toContain('PRODUTO_NOT_FOUND');
      expect(actualErrorTypes).toContain('CATEGORIA_INVALID_TYPE');
    });
  });

  describe('Exception Behavior', () => {
    it('should be throwable', () => {
      expect(() => {
        throw new ValidationException(ValidationErrorType.CATEGORIA_NOT_FOUND);
      }).toThrow(ValidationException);
    });

    it('should be catchable with specific error type', () => {
      try {
        throw new ValidationException(ValidationErrorType.PRODUTO_NOT_FOUND);
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationException);
        expect(error.message).toBe(`Validation error: ${ValidationErrorType.PRODUTO_NOT_FOUND}`);
      }
    });

    it('should maintain error type information', () => {
      const exception = new ValidationException(ValidationErrorType.CATEGORIA_INVALID_TYPE);

      expect(exception.message).toBe(`Validation error: ${ValidationErrorType.CATEGORIA_INVALID_TYPE}`);
    });

    it('should be instanceof Error', () => {
      const exception = new ValidationException(ValidationErrorType.CATEGORIA_NOT_FOUND);

      expect(exception).toBeInstanceOf(Error);
    });
  });

  describe('Error Type Validation', () => {
    it('should validate CATEGORIA_NOT_FOUND error type', () => {
      const exception = new ValidationException(ValidationErrorType.CATEGORIA_NOT_FOUND);

      expect(exception.message).toBe(`Validation error: ${ValidationErrorType.CATEGORIA_NOT_FOUND}`);
    });

    it('should validate PRODUTO_NOT_FOUND error type', () => {
      const exception = new ValidationException(ValidationErrorType.PRODUTO_NOT_FOUND);

      expect(exception.message).toBe(`Validation error: ${ValidationErrorType.PRODUTO_NOT_FOUND}`);
    });

    it('should validate CATEGORIA_INVALID_TYPE error type', () => {
      const exception = new ValidationException(ValidationErrorType.CATEGORIA_INVALID_TYPE);

      expect(exception.message).toBe(`Validation error: ${ValidationErrorType.CATEGORIA_INVALID_TYPE}`);
    });
  });

  describe('Exception Stack Trace', () => {
    it('should have stack trace', () => {
      const exception = new ValidationException(ValidationErrorType.CATEGORIA_NOT_FOUND);

      expect(exception.stack).toBeDefined();
      expect(typeof exception.stack).toBe('string');
    });

    it('should include exception name in stack trace', () => {
      const exception = new ValidationException(ValidationErrorType.PRODUTO_NOT_FOUND);

      expect(exception.stack).toContain('ValidationException');
    });
  });

  describe('Multiple Exception Instances', () => {
    it('should create different instances with different error types', () => {
      const exception1 = new ValidationException(ValidationErrorType.CATEGORIA_NOT_FOUND);
      const exception2 = new ValidationException(ValidationErrorType.PRODUTO_NOT_FOUND);

      expect(exception1).not.toBe(exception2);
      expect(exception1.message).not.toBe(exception2.message);
    });

    it('should create different instances with same error type', () => {
      const exception1 = new ValidationException(ValidationErrorType.CATEGORIA_INVALID_TYPE);
      const exception2 = new ValidationException(ValidationErrorType.CATEGORIA_INVALID_TYPE);

      expect(exception1).not.toBe(exception2);
      expect(exception1.message).toBe(exception2.message);
    });
  });

  describe('Error Type Enum', () => {
    it('should have correct enum values', () => {
      expect(ValidationErrorType.CATEGORIA_NOT_FOUND).toBe('CATEGORIA_NOT_FOUND');
      expect(ValidationErrorType.PRODUTO_NOT_FOUND).toBe('PRODUTO_NOT_FOUND');
      expect(ValidationErrorType.CATEGORIA_INVALID_TYPE).toBe('CATEGORIA_INVALID_TYPE');
    });

    it('should contain all expected error types', () => {
      expect(ValidationErrorType).toHaveProperty('CATEGORIA_NOT_FOUND');
      expect(ValidationErrorType).toHaveProperty('PRODUTO_NOT_FOUND');
      expect(ValidationErrorType).toHaveProperty('CATEGORIA_INVALID_TYPE');
    });
  });
}); 