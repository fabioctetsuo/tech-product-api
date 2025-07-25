import { Injectable } from '@nestjs/common';
import {
  ValidationException,
  ValidationErrorType,
} from '../../domain/exceptions/validation.exception';
import { ProdutoRepository } from '../../infrastructure/persistence/repositories/produto.repository';
import { Produto } from '../../domain/produto/produto.entity';
import {
  CreateProdutoDto,
  UpdateProdutoDto,
} from '../../application/dto/produto.dto';
import { CategoriaUseCases } from '../categoria/categoria.usecases';

@Injectable()
export class ProdutoUseCases {
  constructor(
    private produtoRepository: ProdutoRepository,
    private categoriaUseCases: CategoriaUseCases,
  ) {}

  private async validateProduto(dados: CreateProdutoDto) {
    const categoryId = dados.categoria_id as string;

    if (categoryId) {
      const categoria = await this.categoriaUseCases.findById(categoryId);

      if (!categoria) {
        throw new ValidationException(ValidationErrorType.CATEGORIA_NOT_FOUND);
      }
    }
  }

  async create(dados: CreateProdutoDto) {
    await this.validateProduto(dados);
    const produto = new Produto(dados as Partial<Produto>);
    return this.produtoRepository.save(produto);
  }

  async update(id: string, dados: UpdateProdutoDto) {
    const produto = await this.findById(id);

    await this.validateProduto(dados);

    if (!produto) {
      throw new ValidationException(ValidationErrorType.PRODUTO_NOT_FOUND);
    }

    const { id: _, ...updateData } = dados;

    const updatedProduto = new Produto(updateData as Partial<Produto>);

    console.log({ id, updatedProduto });
    return this.produtoRepository.update(id, updatedProduto);
  }

  async findAll() {
    return this.produtoRepository.findAll();
  }

  async findById(id: string) {
    const produto = await this.produtoRepository.findById(id);

    if (!produto) {
      throw new ValidationException(ValidationErrorType.PRODUTO_NOT_FOUND);
    }

    return produto;
  }

  async findByCategoriaId(categoria_id: string) {
    const produtos =
      await this.produtoRepository.findByCategoriaId(categoria_id);

    if (!produtos || produtos.length === 0) {
      throw new ValidationException(ValidationErrorType.PRODUTO_NOT_FOUND);
    }

    return produtos;
  }

  async findByNome(nome: string) {
    return this.produtoRepository.findByNome(nome);
  }

  async delete(id: string) {
    return this.produtoRepository.delete(id);
  }
}
