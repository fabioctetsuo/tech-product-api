import { CategoriaType } from '../domain/categoria/categoria.types';

const validateCategoriaType = (tipo: CategoriaType) => {
  return Object.values(CategoriaType).includes(tipo);
};

export { validateCategoriaType }; 