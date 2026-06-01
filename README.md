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

| Serviço | Container | Porta no host | Observação |
|--------|-----------|---------------|-----------|
| Nginx | `gestoriq_nginx` | `80:80` | Proxy reverso para `app` |
| App | `gestoriq_app` | exposto internamente | Rodando em `3000` no container |
| PostgreSQL | `gestoriq_postgres` | exposto internamente | Persistência de dados |

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
