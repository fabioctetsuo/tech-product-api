import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Categoria } from '../../../domain/categoria/categoria.entity';

@Injectable()
export class CategoriaRepository {
  constructor(private prisma: PrismaService) {}

  async save(categoria: Categoria) {
    return this.prisma.categoria.create({
      data: {
        nome: categoria.nome,
        tipo: categoria.tipo,
      },
    });
  }

  async update(id: string, categoria: Categoria) {
    return this.prisma.categoria.update({
      where: { id },
      data: {
        nome: categoria.nome,
        tipo: categoria.tipo,
      },
    });
  }

  async findAll() {
    return this.prisma.categoria.findMany();
  }

  async findById(id: string) {
    return this.prisma.categoria.findUnique({
      where: { id },
    });
  }

  async delete(id: string) {
    return this.prisma.categoria.delete({
      where: { id },
    });
  }
} 