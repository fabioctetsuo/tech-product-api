import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Produto } from '../../../domain/produto/produto.entity';

@Injectable()
export class ProdutoRepository {
  constructor(private prisma: PrismaService) {}

  async save(produto: Produto) {
    return this.prisma.produto.create({
      data: {
        nome: produto.nome,
        categoria_id: produto.categoria_id,
        tempo_preparo: produto.tempo_preparo,
        preco: produto.preco,
        descricao: produto.descricao,
        imagem: produto.imagem,
      },
    });
  }

  async update(id: string, produto: Produto) {
    return this.prisma.produto.update({
      where: { id },
      data: {
        nome: produto.nome,
        categoria_id: produto.categoria_id,
        tempo_preparo: produto.tempo_preparo,
        preco: produto.preco,
        descricao: produto.descricao,
        imagem: produto.imagem,
      },
    });
  }

  async findAll() {
    return this.prisma.produto.findMany();
  }

  async findById(id: string) {
    return this.prisma.produto.findUnique({
      where: { id },
    });
  }

  async findByCategoriaId(categoria_id: string) {
    return this.prisma.produto.findMany({
      where: { categoria_id },
    });
  }

  async findByNome(nome: string) {
    return this.prisma.produto.findMany({
      where: {
        nome: {
          contains: nome,
          mode: 'insensitive',
        },
      },
    });
  }

  async delete(id: string) {
    return this.prisma.produto.delete({
      where: { id },
    });
  }
} 