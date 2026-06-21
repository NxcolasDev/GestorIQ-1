# Setup de Infraestrutura

## 1. Pré-requisitos

- Docker instalado e em execução
- Docker Compose disponível
- Git para clonar o repositório
- Node.js apenas se quiser rodar localmente sem containers

## 2. Estrutura de arquivos importantes

- `Dockerfile` — build multi-stage do backend
- `docker-compose.yml` — orquestração de `nginx`, `app` e `postgres`
- `nginx/nginx.conf` — proxy reverso e headers de segurança
- `backend/.env.example` — template de variáveis de ambiente
- `backend/src/app.js` e `backend/src/server.js` — aplicação mínima

## 3. Configuração de ambiente

Copie o template para criar o `.env` local:

```bash
cp backend/.env.example backend/.env
```

Edite `backend/.env` e defina valores reais para:

- `DB_PASSWORD`
- `JWT_SECRET`
- `NODE_ENV=production` em ambiente de entrega

> Importante: `backend/.env` deve ficar local e não deve ser commitado.

## 4. Como iniciar o ambiente

Construa a imagem e inicie os serviços:

```bash
docker compose build --no-cache
docker compose up -d
```

Para interromper e remover containers:

```bash
docker compose down
```

Se mudar a configuração do Dockerfile ou do docker-compose:

```bash
docker compose up -d --build
```

## 5. Verificação pós-início

Veja os containers em execução:

```bash
docker compose ps
```

Verifique logs se houver erro:

```bash
docker compose logs -f app
docker compose logs -f nginx
docker compose logs -f postgres
```

## 6. Endpoints de teste

- Nginx: `http://localhost/`
- App via Nginx: `http://localhost/health`
- App direto (se exposto internamente): `http://localhost:3000/`

## 7. Resumo da infraestrutura

- `nginx` é o gateway público (porta 80)
- `app` roda internamente em `3000`
- `postgres` roda internamente em `5432`
- `postges_data` é o volume persistente do banco

## 8. O que os membros de backend devem fazer

Os diretórios já estão preparados. Devem ser preenchidos com:

- `backend/src/config` — configurações de banco, JWT etc.
- `backend/src/controllers` — regras de entrada e saída HTTP
- `backend/src/routes` — definição de endpoints
- `backend/src/models` — models de dados / ORM
- `backend/src/services` — lógica de negócio
- `backend/src/middlewares` — autenticação, validação e erros
- `backend/src/utils` — helpers e utilitários

## 9. Dicas de troubleshooting

### Porta 80 ocupada

```bash
# Identificar processo usando porta 80 no Windows
netstat -ano | findstr :80
```

### Problema no PostgreSQL

```bash
docker compose logs postgres
```

### Problema no app

```bash
docker compose logs app
```

### Variáveis de ambiente inválidas

- Confirme que `backend/.env` existe.
- Verifique se `backend/.env.example` contém as chaves corretas.

## 10. Documentação complementar

Para explicações técnicas mais completas, consulte:

- `docs/architecture.md`
- `docs/infrastructure.md`

## 11. Prompt para a equipe

Use `docs/prompt.md` para pedir ajuda à IA de forma organizada. Cada membro pode usar um prompt focado na função do grupo:

- infraestrutura
- banco de dados
- autenticação
- APIs/CRUD
- documentação
