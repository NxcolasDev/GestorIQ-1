# GestorIQ

Sistema de gestão de estoque em API REST containerizada com Docker e orquestração via Docker Compose.

## 1. Objetivo

Este repositório contém a infraestrutura do GestorIQ, incluindo:

- build e imagem do backend Node.js
- serviço PostgreSQL com persistência
- proxy reverso Nginx
- orquestração com Docker Compose

O backend atual é um esqueleto funcional para iniciar a aplicação em containers.

## 2. Visão Geral da Arquitetura

```
Cliente --> Nginx (80) --> App Node.js (3000) --> PostgreSQL (5432)
```

- `nginx`: único serviço exposto ao host
- `app`: API Node.js interna
- `postgres`: banco de dados interno

## 3. Tecnologias

- Node.js 24-alpine
- Express 5
- PostgreSQL 17-alpine
- Nginx 1.27-alpine
- Docker Compose 3.9

## 4. Pré-requisitos

- Docker Desktop instalado e em execução
- Docker Compose disponível
- Git para clonar o repositório

## 5. Configuração de Ambiente

O template de variáveis de ambiente está em `backend/.env.example`.

```bash
cp backend/.env.example backend/.env
```

Edite `backend/.env` e altere ao menos:

- `DB_PASSWORD`
- `JWT_SECRET`
- `NODE_ENV=production` para produção

> Nunca comite `backend/.env` no repositório.

## 6. Como executar

```bash
docker compose build --no-cache
docker compose up -d
```

Para parar:

```bash
docker compose down
```

Para reiniciar após alteração do Dockerfile ou do Compose:

```bash
docker compose up -d --build
```

## 7. Serviços e portas

| Serviço    | Container           | Porta no host        | Observação                     |
| ---------- | ------------------- | -------------------- | ------------------------------ |
| Nginx      | `gestoriq_nginx`    | `80:80`              | Proxy reverso para `app`       |
| App        | `gestoriq_app`      | exposto internamente | Rodando em `3000` no container |
| PostgreSQL | `gestoriq_postgres` | exposto internamente | Persistência de dados          |

## 8. O que está pronto

- `Dockerfile` com multi-stage build e healthcheck
- `docker-compose.yml` com redes e volume para PostgreSQL
- `nginx/nginx.conf` configurado para proxy e headers básicos
- `backend/.env.example` com variáveis necessárias
- `backend/src/app.js` e `backend/src/server.js` com endpoints de status

## 9. Health checks

- `GET /health` no app retorna status de serviço
- Nginx também responde `/health` internamente
- Use `docker compose ps` para ver status de containers

## 10. Verificação rápida

```bash
docker compose ps
docker compose logs -f app
docker compose logs -f nginx
docker compose logs -f postgres
```

Acesse:

- `http://localhost/` pelo Nginx
- `http://localhost/health` pelo Nginx

## 11. Estrutura do projeto

```
GestorIQ-1/
├── backend/
│   ├── .env.example
│   ├── package.json
│   └── src/
├── nginx/
│   └── nginx.conf
├── Dockerfile
├── docker-compose.yml
└── docs/
    ├── architecture.md
    └── infrastructure.md
```

## 12. Notas para o time de backend

A infraestrutura já está configurada, mas o backend precisa de implementação adicional nas pastas:

- `backend/src/controllers`
- `backend/src/routes`
- `backend/src/models`
- `backend/src/services`
- `backend/src/middlewares`

## 13. Troubleshooting

### Erro de porta ocupada

```bash
docker compose down
docker compose up -d
```

Se o problema persistir, verifique qual processo usa a porta 80 no host.

### Erro de conexão com Postgres

- Verifique se o serviço está saudável: `docker compose ps`
- Verifique logs: `docker compose logs postgres`

### Erro de variáveis de ambiente

- Confirme que `backend/.env` existe
- Verifique se `backend/.env.example` está correto

## 14. Documentação complementar

Os detalhes técnicos completos e a justificativa da infraestrutura estão em:

- `docs/architecture.md`
- `docs/infrastructure.md`

## 15. Observações finais

- Use `backend/.env.example` como único template de ambiente.
- O arquivo `backend/.env` deve ficar local, não versionado.
- O backend atual é mínimo, mas a infraestrutura está configurada para rodar.

---

## 16. Entidades e Relacionamentos

| Tabela               | Descrição                                                   |
| -------------------- | ----------------------------------------------------------- |
| `usuarios`           | Usuários do sistema com autenticação                        |
| `produtos`           | Produtos do estoque                                         |
| `categorias`         | Categorias dos produtos                                     |
| `fornecedores`       | Fornecedores dos produtos                                   |
| `produto_fornecedor` | **Tabela pivô** — relação N:N entre produtos e fornecedores |

### Relação N:N

Um produto pode ter vários fornecedores e um fornecedor pode fornecer vários produtos.
Essa relação é gerenciada pela tabela pivô `produto_fornecedor`, que possui Model própria.

---

## 17. CRUD das Entidades

### Produtos

| Método | Rota                | Descrição                |
| ------ | ------------------- | ------------------------ |
| GET    | `/api/produtos`     | Listar todos os produtos |
| GET    | `/api/produtos/:id` | Buscar produto por ID    |
| POST   | `/api/produtos`     | Criar produto            |
| PUT    | `/api/produtos/:id` | Atualizar produto        |
| DELETE | `/api/produtos/:id` | Remover produto          |

### Categorias

| Método | Rota                  | Descrição                  |
| ------ | --------------------- | -------------------------- |
| GET    | `/api/categorias`     | Listar todas as categorias |
| GET    | `/api/categorias/:id` | Buscar categoria por ID    |
| POST   | `/api/categorias`     | Criar categoria            |
| PUT    | `/api/categorias/:id` | Atualizar categoria        |
| DELETE | `/api/categorias/:id` | Remover categoria          |

### Fornecedores

| Método | Rota                    | Descrição                    |
| ------ | ----------------------- | ---------------------------- |
| GET    | `/api/fornecedores`     | Listar todos os fornecedores |
| GET    | `/api/fornecedores/:id` | Buscar fornecedor por ID     |
| POST   | `/api/fornecedores`     | Criar fornecedor             |
| PUT    | `/api/fornecedores/:id` | Atualizar fornecedor         |
| DELETE | `/api/fornecedores/:id` | Remover fornecedor           |

### Usuários

| Método | Rota                | Descrição                |
| ------ | ------------------- | ------------------------ |
| GET    | `/api/usuarios`     | Listar todos os usuários |
| GET    | `/api/usuarios/:id` | Buscar usuário por ID    |
| POST   | `/api/usuarios`     | Criar usuário            |
| PUT    | `/api/usuarios/:id` | Atualizar usuário        |
| DELETE | `/api/usuarios/:id` | Remover usuário          |

### Tabela Pivô — Produtos × Fornecedores

| Método | Rota                                            | Descrição                         |
| ------ | ----------------------------------------------- | --------------------------------- |
| GET    | `/api/produtos/:id/fornecedores`                | Listar fornecedores de um produto |
| POST   | `/api/produtos/:id/fornecedores`                | Associar fornecedor a produto     |
| DELETE | `/api/produtos/:id/fornecedores/:fornecedor_id` | Remover associação                |

---

## 18. Autenticação JWT

### Como fazer login

```http
POST /api/login
Content-Type: application/json

{
  "email": "admin@gestoriq.com",
  "senha": "senha123"
}
```

### Resposta

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Como usar o token

Em todas as requisições após o login, envie o token no cabeçalho: Authorization: Bearer SEU_TOKEN_AQUI

> Todas as rotas são protegidas por JWT, exceto o `POST /login`.

---

## 19. Documentação Swagger

Com o projeto rodando, acesse a documentação interativa em: http://localhost/api-docs

Na página do Swagger é possível visualizar e testar todas as rotas da API diretamente pelo navegador.

---

## 20. Migrations e Seeding

### 20.1 Criar as tabelas (Migrations)

Após subir os containers com `docker compose up -d`, execute:

```bash
docker compose exec app node command.js migrate
```

Isso criará as 5 tabelas normalizadas:
- `usuarios` — Usuários do sistema
- `categorias` — Categorias de produtos
- `fornecedores` — Fornecedores
- `produtos` — Produtos do estoque
- `produto_fornecedor` — Relação N:N

> As migrations são **idempotentes** — podem ser executadas múltiplas vezes sem causar erros.

### 20.2 Popular com dados de teste (Seeding)

Após as migrations, popular com 100+ registros de teste:

```bash
docker compose exec app node command.js seed
```

Isso insere:
- 10 usuários de teste
- 15 categorias
- 20 fornecedores
- 60+ produtos
- 150+ relacionamentos N:N

### 20.3 Criar usuário admin automático

Criar um usuário admin especial:

```bash
docker compose exec app node command.js seed-admin
```

Credenciais padrão:
- Email: `admin@gestoriq.com`
- Senha: `senha123` (configurável em `backend/.env` via `ADMIN_PASSWORD`)

### 20.4 Verificar saúde da aplicação

```bash
docker compose exec app node command.js health
```

Esperado: 
```json
{"status":"ok","database":"connected","timestamp":"2026-01-17T..."}
```

### 20.5 Fluxo completo de setup

```bash
# 1. Subir containers
docker compose up --build -d

# 2. Aguardar health checks ficarem green (~30 segundos)
docker compose ps

# 3. Criar tabelas
docker compose exec app node command.js migrate

# 4. Popular com dados de teste
docker compose exec app node command.js seed

# 5. Criar admin
docker compose exec app node command.js seed-admin

# 6. Verificar tudo está ok
docker compose exec app node command.js health

# 7. Acessar Swagger para testar
# Abra: http://localhost/api-docs
```

### 20.6 Fazer login e testar

No Swagger ou via curl:

```bash
curl -X POST http://localhost/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gestoriq.com","senha":"senha123"}'
```

Resposta esperada:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Copiar o token e usar em requisições posteriores:

```bash
curl http://localhost/api/categorias \
  -H "Authorization: Bearer {SEU_TOKEN}"
```

### 20.7 Resetar banco de dados

Para recomeçar do zero (deleta todos os dados):

```bash
# Parar containers e remover volume
docker compose down -v

# Recriar tudo
docker compose up --build -d
```

⚠️ **Cuidado:** `-v` deleta o volume PostgreSQL permanentemente!
