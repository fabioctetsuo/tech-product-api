import { CategoriaType } from './categoria.types';

export class Categoria {
  private _id: string;
  private _nome: string;
  private _tipo: CategoriaType;
  private _created_at: Date;
  private _updated_at: Date;

  constructor(dados: Partial<Categoria>) {
    if (dados.id) this._id = dados.id;
    if (dados.nome) this.nome = dados.nome;
    if (dados.tipo) this.tipo = dados.tipo;
  }

  get id(): string {
    return this._id;
  }

  get nome(): string {
    return this._nome;
  }

  get tipo(): CategoriaType {
    return this._tipo;
  }

  get created_at(): Date {
    return this._created_at;
  }

  get updated_at(): Date {
    return this._updated_at;
  }

  set nome(nome: string) {
    this._nome = nome;
    this._updated_at = new Date();
  }

  set tipo(tipo: CategoriaType) {
    this._tipo = tipo;
    this._updated_at = new Date();
  }
} 