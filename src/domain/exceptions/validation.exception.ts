export enum ValidationErrorType {
  CLIENTE_NOT_FOUND = 'CLIENTE_NOT_FOUND',
  CLIENTE_INVALID_CPF = 'CLIENTE_INVALID_CPF',
  CLIENTE_DUPLICATE_CPF = 'CLIENTE_DUPLICATE_CPF',
  CLIENTE_INVALID_EMAIL = 'CLIENTE_INVALID_EMAIL',
  CLIENTE_DUPLICATE_EMAIL = 'CLIENTE_DUPLICATE_EMAIL',
  PEDIDO_NOT_FOUND = 'PEDIDO_NOT_FOUND',
  PEDIDO_INVALID_STATUS = 'PEDIDO_INVALID_STATUS',
  PEDIDO_INVALID_ITEMS = 'PEDIDO_INVALID_ITEMS',
  PRODUTO_NOT_FOUND = 'PRODUTO_NOT_FOUND',
  CATEGORIA_NOT_FOUND = 'CATEGORIA_NOT_FOUND',
  CATEGORIA_INVALID_TYPE = 'CATEGORIA_INVALID_TYPE',
  PAGAMENTO_NOT_FOUND = 'PAGAMENTO_NOT_FOUND',
  PAGAMENTO_INVALID_STATUS = 'PAGAMENTO_INVALID_STATUS',
  UNAUTHORIZED = 'UNAUTHORIZED',
  INVALID_REQUEST = 'INVALID_REQUEST',
}

export class ValidationException extends Error {
  constructor(public readonly type: ValidationErrorType) {
    super(`Validation error: ${type}`);
    this.name = 'ValidationException';
  }
} 