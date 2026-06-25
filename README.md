# GestorIQ

Sistema de gestão de estoque em API REST containerizada com Docker e orquestração via Docker 
Compose.

## Integrantes
Nome	RA
* Nicolas de Jesus Silva-6325171
* João Pedro Paulino Ferreira-6325175
* Matheus Maciel de Paula-6325065
* Renan Dias-6325033
* Yuri Sanches-6325238

## 1. Objetivo

Este repositório contém a API do GestorIQ, incluindo:

* backend Node.js com Express;
* autenticação JWT;
* CRUD de usuários, categorias, fornecedores e produtos;
* relacionamento N:N entre produtos e fornecedores;
* PostgreSQL com persistência de dados;
* Nginx como proxy reverso;
* documentação Swagger;
* migrations e seed via `command.js`;
* orquestração com Docker Compose.

## 2. Visão Geral da Arquitetura

```txt
Cliente --> Nginx (80) --> App Node.js (3000) --> PostgreSQL (5432)
```

* `nginx`: único serviço exposto ao host, acessível pela porta 80.
* `app`: API Node.js interna, rodando na porta 3000 dentro do container.
* `postgres`: banco de dados interno, acessível apenas pela rede Docker.

## 3. Tecnologias

* Node.js 24-alpine
* Express 5
* PostgreSQL 17-alpine
* Nginx 1.27-alpine
* Docker Compose
* JWT
* Swagger/OpenAPI

## 4. Pré-requisitos

Antes de executar o projeto, instale:

* Docker Desktop
* Docker Compose
* Git

Não é necessário instalar Node.js, PostgreSQL ou Nginx manualmente para rodar a aplicação, pois esses serviços são executados dentro dos containers Docker.

## 5. Configuração de Ambiente

O template de variáveis de ambiente está em:

```txt
backend/.env.example
```

Crie o arquivo local `.env`:

### Windows PowerShell

```powershell
copy .\backend\.env.example .\backend\.env
```

### Linux / WSL / Git Bash

```bash
cp backend/.env.example backend/.env
```

Depois edite o arquivo:

```txt
backend/.env
```

Confira principalmente:

```env
DB_NAME=gestoriq
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=algum_segredo
ADMIN_PASSWORD=senha123
```

> Nunca comite `backend/.env` no repositório.

## 6. Como executar com Docker

Com o Docker Desktop aberto, rode na raiz do projeto, onde está o `docker-compose.yml`:

```bash
docker compose up --build -d
```

Verifique se os containers subiram:

```bash
docker compose ps
```

O esperado é que os serviços fiquem ativos:

```txt
gestoriq_postgres   healthy
gestoriq_app        healthy
gestoriq_nginx      healthy
```

## 7. Serviços e Portas

| Serviço    | Container           | Porta no host        | Observação                     |
| ---------- | ------------------- | -------------------- | ------------------------------ |
| Nginx      | `gestoriq_nginx`    | `80:80`              | Proxy reverso para `app`       |
| App        | `gestoriq_app`      | exposto internamente | Rodando em `3000` no container |
| PostgreSQL | `gestoriq_postgres` | exposto internamente | Persistência de dados          |

## 8. Preparar o Banco de Dados

Após subir os containers, execute as migrations:

```bash
docker compose exec app node command.js migrate
```

> As migrations são idempotentes e podem ser executadas novamente sem recriar tabelas já existentes.

Depois execute o seed:

```bash
docker compose exec app node command.js seed
```

Crie o usuário administrador:

```bash
docker compose exec app node command.js seed-admin
```

Verifique a conexão com o banco:

```bash
docker compose exec app node command.js health
```

Resultado esperado:

```txt
Banco de dados OK
```

### Fluxo completo de setup

```bash
docker compose up --build -d
docker compose ps
docker compose exec app node command.js migrate
docker compose exec app node command.js seed
docker compose exec app node command.js seed-admin
docker compose exec app node command.js health
```

## 9. Acessar a Aplicação

Health check:

```txt
http://localhost/health
```

Documentação Swagger:

```txt
http://localhost/api-docs
```

## 10. Login

A rota correta de login é:

```http
POST /api/auth/login
Content-Type: application/json
```

Body:

```json
{
  "email": "admin@gestoriq.com",
  "senha": "senha123"
}
```

Resposta esperada:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
}
```

Use o token retornado nas rotas protegidas com o cabeçalho:

```http
Authorization: Bearer SEU_TOKEN_AQUI
```

> Todas as rotas protegidas exigem JWT válido.

### Exemplo via curl

```bash
curl -X POST http://localhost/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gestoriq.com","senha":"senha123"}'
```

Exemplo de requisição autenticada:

```bash
curl http://localhost/api/categorias \
  -H "Authorization: Bearer SEU_TOKEN"
```

## 11. Entidades e Relacionamentos

| Tabela               | Descrição                                                |
| -------------------- | -------------------------------------------------------- |
| `usuarios`           | Usuários do sistema com autenticação                     |
| `produtos`           | Produtos do estoque                                      |
| `categorias`         | Categorias dos produtos                                  |
| `fornecedores`       | Fornecedores dos produtos                                |
| `produto_fornecedor` | Tabela pivô da relação N:N entre produtos e fornecedores |

### Relação N:N

Um produto pode ter vários fornecedores, e um fornecedor pode fornecer vários produtos.

Essa relação é gerenciada pela tabela pivô `produto_fornecedor`.

## 12. Rotas Principais

### Autenticação

| Método | Rota              | Descrição              |
| ------ | ----------------- | ---------------------- |
| POST   | `/api/auth/login` | Login e geração de JWT |

### Produtos

| Método | Rota                | Descrição                |
| ------ | ------------------- | ------------------------ |
| GET    | `/api/produtos`     | Listar todos os produtos |
| GET    | `/api/produtos/:id` | Buscar produto por ID    |
| POST   | `/api/produtos`     | Criar produto            |
| PUT    | `/api/produtos/:id` | Atualizar produto        |
| DELETE | `/api/produtos/:id` | Remover produto          |

Exemplo de criação de produto:

```json
{
  "nome": "Mouse Gamer",
  "descricao": "Mouse para teste",
  "preco": 99.9,
  "quantidade_estoque": 10,
  "categoria_id": 1
}
```

> O campo correto para estoque é `quantidade_estoque`.

### Categorias

| Método | Rota                  | Descrição                  |
| ------ | --------------------- | -------------------------- |
| GET    | `/api/categorias`     | Listar todas as categorias |
| GET    | `/api/categorias/:id` | Buscar categoria por ID    |
| POST   | `/api/categorias`     | Criar categoria            |
| PUT    | `/api/categorias/:id` | Atualizar categoria        |
| DELETE | `/api/categorias/:id` | Remover categoria          |

Exemplo de criação de categoria:

```json
{
  "nome": "Eletrônicos",
  "descricao": "Produtos eletrônicos em geral"
}
```

### Fornecedores

| Método | Rota                    | Descrição                    |
| ------ | ----------------------- | ---------------------------- |
| GET    | `/api/fornecedores`     | Listar todos os fornecedores |
| GET    | `/api/fornecedores/:id` | Buscar fornecedor por ID     |
| POST   | `/api/fornecedores`     | Criar fornecedor             |
| PUT    | `/api/fornecedores/:id` | Atualizar fornecedor         |
| DELETE | `/api/fornecedores/:id` | Remover fornecedor           |

Exemplo de criação de fornecedor:

```json
{
  "nome": "Fornecedor Teste",
  "cnpj": "12345678000199",
  "email": "fornecedor@teste.com",
  "telefone": "11999999999"
}
```

> O campo `cnpj` é obrigatório.

### Usuários

| Método | Rota                | Descrição                |
| ------ | ------------------- | ------------------------ |
| GET    | `/api/usuarios`     | Listar todos os usuários |
| GET    | `/api/usuarios/:id` | Buscar usuário por ID    |
| POST   | `/api/usuarios`     | Criar usuário            |
| PUT    | `/api/usuarios/:id` | Atualizar usuário        |
| DELETE | `/api/usuarios/:id` | Remover usuário          |

### Produtos × Fornecedores

| Método | Rota                                            | Descrição                         |
| ------ | ----------------------------------------------- | --------------------------------- |
| GET    | `/api/produtos/:id/fornecedores`                | Listar fornecedores de um produto |
| POST   | `/api/produtos/:id/fornecedores`                | Associar fornecedor a produto     |
| DELETE | `/api/produtos/:id/fornecedores/:fornecedor_id` | Remover associação                |

Exemplo de associação:

```json
{
  "fornecedor_id": 1
}
```

## 13. Testes Manuais Recomendados

Após subir o projeto, valide:

```bash
docker compose ps
docker compose exec app node command.js health
```

Depois acesse:

```txt
http://localhost/health
http://localhost/api-docs
```

No Swagger:

1. Faça login em `POST /api/auth/login`.
2. Copie o token JWT.
3. Use o token no botão `Authorize`.
4. Teste:

   * CRUD de categorias;
   * CRUD de fornecedores;
   * CRUD de produtos;
   * associação produto-fornecedor.

Para acompanhar logs dos serviços:

```bash
docker compose logs -f app
docker compose logs -f nginx
docker compose logs -f postgres
```

## 14. Parar a Aplicação

Para parar os containers sem apagar os dados:

```bash
docker compose down
```

Para parar e apagar os dados locais do banco:

```bash
docker compose down -v
```

> Atenção: o comando com `-v` remove o volume/dados locais do PostgreSQL.

## 15. Estrutura do Projeto

```txt
GestorIQ-1/
├── backend/
│   ├── .env.example
│   ├── command.js
│   ├── package.json
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── docs/
│       ├── middlewares/
│       ├── routes/
│       ├── services/
│       └── utils/
├── data/
│   └── seed.sql
├── docs/
├── nginx/
│   └── nginx.conf
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## 16. Arquivos que Não Devem Ser Versionados

Não versionar:

```txt
backend/.env
data/postgres/
node_modules/
backend/node_modules/
```

Manter versionado:

```txt
backend/.env.example
data/seed.sql
```

## 17. Troubleshooting

### Erro: porta 80 ocupada

Se a porta 80 estiver ocupada:

```bash
docker compose down
```

Verifique qual processo está usando a porta 80 ou altere a porta no `docker-compose.yml`.

### Erro: Postgres unhealthy

Se o Postgres falhar ao iniciar por problema no diretório de dados, confira se o `docker-compose.yml` possui:

```yaml
PGDATA: /var/lib/postgresql/data/pgdata
```

Também é possível limpar os dados locais e recriar o ambiente:

```bash
docker compose down -v
docker compose up --build -d
```

### Erro: Nginx unhealthy

Confirme se o healthcheck do Nginx usa `127.0.0.1`:

```yaml
healthcheck:
  test: ["CMD-SHELL", "wget --quiet --tries=1 --spider http://127.0.0.1/health || exit 1"]
```

### Erro: `Cannot find module '/app/command.js'`

Confirme se o Dockerfile copia o arquivo `command.js`:

```dockerfile
COPY command.js ./command.js
```

Depois reconstrua a imagem:

```bash
docker compose up --build -d
```

### Erro: `data/seed.sql` não encontrado

Confirme se o serviço `app` no `docker-compose.yml` monta a pasta `data`:

```yaml
volumes:
  - ./data:/app/data:ro
```

E confirme se o arquivo existe:

```txt
data/seed.sql
```

### Erro: conflito de rede Docker

Se aparecer erro como:

```txt
Pool overlaps with other one on this address space
```

remova subnets fixas do `docker-compose.yml` e deixe as redes assim:

```yaml
networks:
  web-network:
    driver: bridge

  app-network:
    driver: bridge
    internal: true
```

Depois rode:

```bash
docker compose down
docker compose up --build -d
```

## 18. Documentação Complementar

A pasta `docs/` contém documentação técnica complementar do projeto, como arquitetura, banco de dados, infraestrutura, decisões técnicas e scripts SQL.
