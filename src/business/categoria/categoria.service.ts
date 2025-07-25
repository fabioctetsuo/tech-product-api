import { Injectable } from '@nestjs/common';
import { CategoriaUseCases } from './categoria.usecases';
import {
  CreateCategoriaDto,
  UpdateCategoriaDto,
} from '../../application/dto/categoria.dto';

@Injectable()
export class CategoriaService {
  constructor(private categoriaUseCases: CategoriaUseCases) {}

  async findAll() {
    return this.categoriaUseCases.findAll();
  }

  async create(dados: CreateCategoriaDto) {
    return this.categoriaUseCases.create(dados);
  }

  async findById(id: string) {
    return this.categoriaUseCases.findById(id);
  }

  async update(id: string, dados: UpdateCategoriaDto) {
    return this.categoriaUseCases.update(id, dados);
  }

  async delete(id: string) {
    return this.categoriaUseCases.delete(id);
  }
} 