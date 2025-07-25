import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsDate,
} from 'class-validator';

export class ProdutoDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'Nome do produto',
    example: 'Batata Frita',
  })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({
    description: 'ID da categoria do produto',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  categoria_id: string;

  @ApiProperty({
    description: 'Tempo de preparo do produto em segundos',
    example: 300,
  })
  @IsNumber()
  @IsNotEmpty()
  tempo_preparo: number;

  @ApiProperty({
    description: 'Preço do produto',
    example: 14.9,
  })
  @IsNumber()
  @IsNotEmpty()
  preco: number;

  @ApiProperty({
    description: 'Descrição do produto',
    example: 'Batata frita crocante e macio',
  })
  @IsString()
  @IsNotEmpty()
  descricao: string;

  @ApiProperty({
    description: 'URL da imagem do produto',
    example: 'https://images.unsplash.com/photo-1630431341973-02e1b662ec35',
  })
  @IsString()
  @IsOptional()
  imagem?: string;

  @IsDate()
  @IsOptional()
  created_at?: Date;

  @IsDate()
  @IsOptional()
  updated_at?: Date;
}

export class CreateProdutoDto extends PartialType(ProdutoDto) {}

export class UpdateProdutoDto extends PartialType(ProdutoDto) {} 