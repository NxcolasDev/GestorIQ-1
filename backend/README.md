# GestorIQ - Infraestrutura

Este repositório contém a infraestrutura mínima para o backend do GestorIQ.

## O que está pronto
- `Dockerfile` para construir a imagem da aplicação.
- `docker-compose.yml` para orquestrar `app`, `postgres` e `nginx`.
- `nginx/nginx.conf` como proxy reverso.
- `src/server.js` e `src/app.js` como app mínimo de validação.
- Pastas de infraestrutura para backend: `config/`, `controllers/`, `middlewares/`, `models/`, `routes/`, `services/`, `utils/`.

## Como rodar
1. Copie as variáveis de ambiente:
```bash
cp .env.example .env
```
2. Suba a stack:
```bash
docker compose up --build
```
3. Acesse:
- `http://localhost/` para Nginx
- `http://localhost:3000/` para a API direta
- `http://localhost:3000/health` para health check

## Observação
- Os diretórios estão prontos para os desenvolvedores preencherem a regra de negócio e rotas.
- Para orientação com IA e divisão de tarefas, use `docs/prompt.md`.
