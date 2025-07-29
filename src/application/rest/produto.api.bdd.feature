# language: pt
Funcionalidade: Gerenciar produtos
  Como um usuário do sistema
  Eu quero gerenciar produtos
  Para manter o catálogo atualizado

  Cenário: Criar um novo produto com sucesso
    Dado que eu tenho os dados válidos de um produto
    Quando eu enviar a requisição para criar o produto
    Então o produto deve ser criado com sucesso
    E os dados do produto devem ser retornados

  Cenário: Criar produto com dados inválidos
    Dado que eu tenho dados inválidos de um produto
    Quando eu enviar a requisição para criar o produto
    Então deve retornar um erro de validação

  Cenário: Buscar produto por ID existente
    Dado que existe um produto com ID "produto-1"
    Quando eu buscar o produto pelo ID "produto-1"
    Então o produto deve ser retornado
    E deve conter todos os dados do produto

  Cenário: Buscar produto por ID inexistente
    Dado que não existe um produto com ID "produto-inexistente"
    Quando eu buscar o produto pelo ID "produto-inexistente"
    Então deve retornar um erro de produto não encontrado

  Cenário: Buscar produtos por categoria
    Dado que existem produtos da categoria "categoria-1"
    Quando eu buscar produtos pela categoria "categoria-1"
    Então uma lista de produtos deve ser retornada
    E todos os produtos devem pertencer à categoria "categoria-1"

  Cenário: Atualizar produto existente
    Dado que existe um produto com ID "produto-1"
    E eu tenho novos dados válidos para o produto
    Quando eu enviar a requisição para atualizar o produto
    Então o produto deve ser atualizado com sucesso
    E os novos dados devem ser retornados

  Cenário: Deletar produto existente
    Dado que existe um produto com ID "produto-1"
    Quando eu enviar a requisição para deletar o produto
    Então o produto deve ser deletado com sucesso
    E os dados do produto deletado devem ser retornados