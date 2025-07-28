import { Injectable } from '@nestjs/common';
import {
  ValidationException,
  ValidationErrorType,
} from '../../domain/exceptions/validation.exception';
import { CategoriaRepository } from '../../infrastructure/persistence/repositories/categoria.repository';
import {
  CreateCategoriaDto,
  UpdateCategoriaDto,
} from '../../application/dto/categoria.dto';
import { Categoria } from '../../domain/categoria/categoria.entity';
import { CategoriaType } from '../../domain/categoria/categoria.types';
import { validateCategoriaType } from '../../utils/categoria.utils';

@Injectable()
export class CategoriaUseCases {
  constructor(private categoriaRepository: CategoriaRepository) {}

  private validateCategoria(dados: CreateCategoriaDto) {
    const categoriaTipo = dados.tipo as CategoriaType;

    if (!validateCategoriaType(categoriaTipo)) {
      throw new ValidationException(ValidationErrorType.CATEGORIA_INVALID_TYPE);
    }
  }

  async create(dados: CreateCategoriaDto) {
    this.validateCategoria(dados);
    const categoria = new Categoria(dados as Partial<Categoria>);
    return this.categoriaRepository.save(categoria);
  }

  async update(id: string, dados: UpdateCategoriaDto) {
    const categoria = await this.findById(id);

    this.validateCategoria(dados);

    if (!categoria) {
      throw new ValidationException(ValidationErrorType.CATEGORIA_NOT_FOUND);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _unused, ...updateData } = dados;

    const updatedCategoria = new Categoria(updateData as Partial<Categoria>);

    return this.categoriaRepository.update(id, updatedCategoria);
  }

  async findAll() {
    return this.categoriaRepository.findAll();
  }

  async findById(id: string) {
    const categoria = await this.categoriaRepository.findById(id);

    if (!categoria) {
      throw new ValidationException(ValidationErrorType.CATEGORIA_NOT_FOUND);
    }

    return categoria;
  }

  async delete(id: string) {
    return this.categoriaRepository.delete(id);
  }
}
