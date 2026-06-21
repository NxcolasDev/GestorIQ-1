# Estudo para Prova e Apresentacao

## O que foi construido

O GestorIQ e uma API REST de gestao de estoque. Ela roda em containers Docker e usa:

- Node.js com Express para a API.
- PostgreSQL para persistencia.
- Nginx como proxy reverso.
- Docker Compose para orquestrar os servicos.
- Swagger para documentar e testar endpoints.
- JWT para proteger as rotas.

## Como a arquitetura funciona

Fluxo da requisicao:

```text
Usuario -> Nginx:80 -> App Node.js:3000 -> PostgreSQL:5432
```

O usuario acessa apenas o Nginx. O app e o banco ficam em rede interna. Isso reduz exposicao e facilita explicar seguranca.

## Banco de dados

Tabelas:

- `usuarios`: login e cadastro.
- `categorias`: classificacao dos produtos.
- `fornecedores`: empresas que fornecem produtos.
- `produtos`: itens do estoque.
- `produto_fornecedor`: tabela pivo muitos-para-muitos.

Relacao importante:

```text
produtos N:N fornecedores
```

Um produto pode ter varios fornecedores, e um fornecedor pode fornecer varios produtos.

## API REST

REST organiza recursos por URLs e metodos HTTP:

- `GET`: consultar.
- `POST`: criar.
- `PUT`: atualizar.
- `DELETE`: remover.

Exemplo:

```text
GET /api/produtos
POST /api/produtos
PUT /api/produtos/1
DELETE /api/produtos/1
```

## JWT

JWT e um token de autenticacao. O usuario faz login, recebe um token e envia esse token nas proximas requisicoes:

```http
Authorization: Bearer <token>
```

No projeto, somente login e registro ficam sem token. Os CRUDs sao protegidos.

## Dockerfile

O Dockerfile cria a imagem do backend. Ele usa multi-stage build:

- stage `builder`: instala dependencias e copia o codigo.
- stage final: roda apenas o necessario.

Tambem executa a API com usuario nao-root, o que melhora seguranca.

## Docker Compose

O Compose sobe tres servicos:

- `nginx`
- `app`
- `postgres`

Ele tambem define:

- redes Docker.
- variaveis de ambiente.
- volume persistente.
- health checks.
- politicas de restart.

## PostgreSQL e volume

O banco usa o volume `postgres_data`. Isso faz os dados sobreviverem mesmo se o container for recriado.

## Swagger

O Swagger fica em:

```text
http://localhost/api-docs
```

Ele ajuda a mostrar as rotas e testar a API ao vivo.

## Como apresentar bem

1. Abra o Docker Desktop antes.
2. Rode `docker compose ps`.
3. Mostre o Swagger.
4. Faça login.
5. Crie uma categoria.
6. Crie um fornecedor.
7. Crie um produto.
8. Mostre a associacao produto-fornecedor.
9. Explique que o banco nao esta exposto diretamente.

## Frase curta para defender o projeto

"O GestorIQ demonstra uma aplicacao web em arquitetura multicamadas, com API REST em Node.js, persistencia em PostgreSQL, proxy reverso com Nginx, autenticacao JWT, documentacao Swagger e orquestracao Docker Compose."
