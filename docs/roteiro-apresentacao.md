# Roteiro de Apresentacao

## Tempo sugerido

5 a 7 minutos.

## 1. Abertura

Fala sugerida:

"Este e o GestorIQ, uma API REST para gestao de estoque. O projeto foi preparado para demonstrar infraestrutura web com Docker, Docker Compose, Nginx, Node.js, PostgreSQL, Swagger e JWT."

Mostrar:

- README.
- Estrutura de pastas.
- `docker-compose.yml`.

## 2. Arquitetura

Fala sugerida:

"A arquitetura tem tres camadas. O Nginx e o ponto de entrada na porta 80. Ele encaminha as requisicoes para o app Node.js. O app acessa o PostgreSQL pela rede interna do Docker."

Mostrar:

- `docker-compose.yml`.
- Servicos `nginx`, `app`, `postgres`.
- Redes `web-network` e `app-network`.

Comando:

```bash
docker compose ps
```

## 3. Dockerfile

Fala sugerida:

"O Dockerfile usa multi-stage build. A primeira etapa prepara dependencias e codigo. A imagem final executa somente o necessario e roda com usuario nao-root."

Mostrar:

- `FROM node:24-alpine AS builder`.
- `RUN npm install --omit=dev`.
- `USER appuser`.
- `HEALTHCHECK`.

## 4. Banco de dados

Fala sugerida:

"O PostgreSQL armazena usuarios, categorias, fornecedores, produtos e a tabela pivo entre produtos e fornecedores. As tabelas sao criadas automaticamente quando a API inicia com `DB_SYNC=true`."

Mostrar:

- `backend/src/config/database.js`.
- `docs/database.md`.

Comando:

```bash
docker compose exec postgres psql -U postgres -d gestoriq -c "\dt"
```

## 5. Swagger e API REST

Fala sugerida:

"O Swagger permite testar a API pelo navegador. Primeiro fazemos login, depois usamos o token JWT nas rotas protegidas."

Abrir:

```text
http://localhost/api-docs
```

Demonstrar:

1. `POST /api/login`.
2. Autorizar com Bearer Token.
3. `POST /api/categorias`.
4. `POST /api/fornecedores`.
5. `POST /api/produtos`.
6. `GET /api/produtos`.

## 6. Seguranca

Fala sugerida:

"O banco nao fica exposto no host. O app tambem nao publica porta direta. O acesso externo passa pelo Nginx, e as rotas de negocio usam JWT."

Mostrar:

- `ports` apenas no Nginx.
- `expose` no app.
- ausencia de `ports` no PostgreSQL.
- middleware `backend/src/middlewares/auth.js`.

## 7. Fechamento

Fala sugerida:

"Com isso, o projeto fica pronto para rodar em ambiente Docker, demonstrando infraestrutura, persistencia, API REST, autenticacao e documentacao. A equipe consegue explicar tanto a parte de codigo quanto a parte de deploy."

## Plano B se Docker falhar no dia

Se o Docker Desktop nao iniciar:

1. Mostrar `docker info` com o erro.
2. Abrir Docker Desktop manualmente.
3. Aguardar engine iniciar.
4. Rodar:

```bash
docker compose up -d --build
docker compose ps
```

Se a porta 80 estiver ocupada, alterar temporariamente:

```yaml
ports:
  - "8080:80"
```

E acessar:

```text
http://localhost:8080
```
