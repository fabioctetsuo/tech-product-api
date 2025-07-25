import { Categoria } from '../categoria/categoria.entity';

export class Produto {
  private _id: string;
  private _nome: string;
  private _categoria_id: string;
  private _tempo_preparo: number;
  private _preco: number;
  private _descricao: string;
  private _imagem: string;
  private _created_at: Date;
  private _updated_at: Date;
  private _categoria?: Categoria;

  constructor(dados: Partial<Produto>) {
    if (dados.id) this._id = dados.id;
    if (dados.nome) this.nome = dados.nome;
    if (dados.categoria_id) this.categoria_id = dados.categoria_id;
    if (dados.tempo_preparo) this.tempo_preparo = dados.tempo_preparo;
    if (dados.preco) this.preco = dados.preco;
    if (dados.descricao) this.descricao = dados.descricao;
    if (dados.imagem) this.imagem = dados.imagem;
    if (dados.categoria) this.categoria = dados.categoria;
  }

  get id(): string {
    return this._id;
  }

  get nome(): string {
    return this._nome;
  }

  get categoria_id(): string {
    return this._categoria_id;
  }

  get tempo_preparo(): number {
    return this._tempo_preparo;
  }

  get preco(): number {
    return this._preco;
  }

  get descricao(): string {
    return this._descricao;
  }

  get imagem(): string {
    return this._imagem;
  }

  get created_at(): Date {
    return this._created_at;
  }

  get updated_at(): Date {
    return this._updated_at;
  }

  get categoria(): Categoria | undefined {
    return this._categoria;
  }

  set nome(nome: string) {
    this._nome = nome;
    this._updated_at = new Date();
  }

  set categoria_id(categoria_id: string) {
    this._categoria_id = categoria_id;
    this._updated_at = new Date();
  }

  set tempo_preparo(tempo_preparo: number) {
    this._tempo_preparo = tempo_preparo;
    this._updated_at = new Date();
  }

  set preco(preco: number) {
    this._preco = preco;
    this._updated_at = new Date();
  }

  set descricao(descricao: string) {
    this._descricao = descricao;
    this._updated_at = new Date();
  }

  set imagem(imagem: string) {
    this._imagem = imagem;
    this._updated_at = new Date();
  }

  set categoria(categoria: Categoria | undefined) {
    this._categoria = categoria;
  }
} 