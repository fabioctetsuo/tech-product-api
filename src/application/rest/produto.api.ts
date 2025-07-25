import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ProdutoService } from '../../business/produto/produto.service';
import { CreateProdutoDto, UpdateProdutoDto } from '../dto/produto.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Produtos')
@Controller('produtos')
export class ProdutoController {
  constructor(private produtoService: ProdutoService) {}

  @Get()
  @ApiOperation({ summary: 'Buscar todos os produtos' })
  @ApiResponse({
    status: 200,
    description: 'Retorna todos os produtos',
  })
  async findAll() {
    return this.produtoService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Criar um novo produto' })
  @ApiResponse({ status: 201, description: 'Produto criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Requisição inválida' })
  async create(@Body() createProdutoDto: CreateProdutoDto) {
    return this.produtoService.create(createProdutoDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um produto pelo ID' })
  @ApiResponse({ status: 200, description: 'Retorna o produto' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async findById(@Param('id') id: string) {
    return this.produtoService.findById(id);
  }

  @Get('categoria/:categoria_id')
  @ApiOperation({ summary: 'Buscar produtos por categoria ID' })
  @ApiResponse({
    status: 200,
    description: 'Retorna produtos por categoria ID',
  })
  @ApiResponse({ status: 404, description: 'Produtos não encontrados' })
  async findByCategoriaId(@Param('categoria_id') categoria_id: string) {
    return this.produtoService.findByCategoriaId(categoria_id);
  }

  @Get('nome/:nome')
  @ApiOperation({ summary: 'Buscar produtos por nome' })
  @ApiResponse({
    status: 200,
    description: 'Retorna produtos por nome',
  })
  async findByNome(@Param('nome') nome: string) {
    return this.produtoService.findByNome(nome);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar um produto pelo ID' })
  @ApiResponse({
    status: 200,
    description: 'Produto atualizado com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async update(
    @Param('id') id: string,
    @Body() updateProdutoDto: UpdateProdutoDto,
  ) {
    return this.produtoService.update(id, updateProdutoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar um produto pelo ID' })
  @ApiResponse({
    status: 200,
    description: 'Produto deletado com sucesso',
  })
  async delete(@Param('id') id: string) {
    return this.produtoService.delete(id);
  }
} 