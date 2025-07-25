import { Module } from '@nestjs/common';
import { PrismaModule } from './infrastructure/persistence/prisma/prisma.module';
import { CategoriaController } from './application/rest/categoria.api';
import { CategoriaService } from './business/categoria/categoria.service';
import { CategoriaRepository } from './infrastructure/persistence/repositories/categoria.repository';
import { CategoriaUseCases } from './business/categoria/categoria.usecases';
import { ProdutoService } from './business/produto/produto.service';
import { ProdutoRepository } from './infrastructure/persistence/repositories/produto.repository';
import { ProdutoUseCases } from './business/produto/produto.usecases';
import { ProdutoController } from './application/rest/produto.api';
import { HealthModule } from './infrastructure/health/health.module';

@Module({
  imports: [PrismaModule, HealthModule],
  controllers: [CategoriaController, ProdutoController],
  providers: [
    CategoriaService,
    CategoriaRepository,
    CategoriaUseCases,
    ProdutoService,
    ProdutoRepository,
    ProdutoUseCases,
  ],
})
export class AppModule {} 