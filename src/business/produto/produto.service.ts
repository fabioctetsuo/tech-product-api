import { Injectable } from '@nestjs/common';
import { ProdutoUseCases } from './produto.usecases';
import {
  CreateProdutoDto,
  UpdateProdutoDto,
} from '../../application/dto/produto.dto';

@Injectable()
export class ProdutoService {
  constructor(private produtoUseCases: ProdutoUseCases) {}

  async findAll() {
    return this.produtoUseCases.findAll();
  }

  async create(dados: CreateProdutoDto) {
    return this.produtoUseCases.create(dados);
  }

  async findById(id: string) {
    return this.produtoUseCases.findById(id);
  }

  async update(id: string, dados: UpdateProdutoDto) {
    return this.produtoUseCases.update(id, dados);
  }

  async delete(id: string) {
    return this.produtoUseCases.delete(id);
  }

  async findByCategoriaId(categoria_id: string) {
    return this.produtoUseCases.findByCategoriaId(categoria_id);
  }

  async findByNome(nome: string) {
    return this.produtoUseCases.findByNome(nome);
  }
}
