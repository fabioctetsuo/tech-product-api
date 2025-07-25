import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { CategoriaType } from '../../domain/categoria/categoria.types';

export class CategoriaDto {
  @IsString()
  @IsOptional()
  id?: string;

  @ApiProperty({
    description: 'Nome da categoria',
    example: 'Lanches',
  })
  @IsString({ message: 'O nome deve ser uma string' })
  nome: string;

  @ApiProperty({
    description: 'Descrição da categoria',
    enum: CategoriaType,
    enumName: 'CategoriaType',
    example: CategoriaType.LANCHE,
    required: false,
  })
  @IsEnum(CategoriaType, { message: 'Tipo inválido' })
  tipo: CategoriaType;

  @IsOptional()
  createdAt?: Date;

  @IsOptional()
  updatedAt?: Date;
}

export class CreateCategoriaDto extends PartialType(CategoriaDto) {}

export class UpdateCategoriaDto extends PartialType(CategoriaDto) {}
