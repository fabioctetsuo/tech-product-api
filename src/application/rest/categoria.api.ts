import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { CategoriaService } from '../../business/categoria/categoria.service';
import { CreateCategoriaDto, UpdateCategoriaDto } from '../dto/categoria.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Categorias')
@Controller('categorias')
export class CategoriaController {
  constructor(private categoriaService: CategoriaService) {}

  @Get()
  @ApiOperation({ summary: 'Buscar todas as categorias' })
  @ApiResponse({
    status: 200,
    description: 'Lista de todas as categorias',
  })
  async findAll() {
    return this.categoriaService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Criar uma nova categoria' })
  @ApiResponse({
    status: 201,
    description: 'Categoria criada com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  async create(@Body() createCategoriaDto: CreateCategoriaDto) {
    return this.categoriaService.create(createCategoriaDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma categoria pelo ID' })
  @ApiResponse({
    status: 200,
    description: 'Retorna uma categoria específica',
  })
  @ApiResponse({
    status: 404,
    description: 'Categoria não encontrada',
  })
  async findById(@Param('id') id: string) {
    return this.categoriaService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar uma categoria' })
  @ApiResponse({
    status: 200,
    description: 'Categoria atualizada com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Categoria não encontrada',
  })
  async update(
    @Param('id') id: string,
    @Body() updateCategoriaDto: UpdateCategoriaDto,
  ) {
    return this.categoriaService.update(id, updateCategoriaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir uma categoria' })
  @ApiResponse({
    status: 204,
    description: 'Categoria excluída com sucesso',
  })
  async delete(@Param('id') id: string) {
    return this.categoriaService.delete(id);
  }
} 