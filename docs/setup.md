# Setup de Infraestrutura

## Pré-requisitos
- Docker
- Docker Compose
- Node.js (apenas se quiser rodar localmente sem containers)

## Como iniciar o projeto
1. Copie o arquivo de ambiente:
```bash
cp .env.example .env
```
2. Verifique se o arquivo `.env` contém os valores corretos.
3. Execute o Docker Compose:
```bash
docker compose up --build
```

## Endpoints disponíveis
- API básica: http://localhost:3000/
- Nginx: http://localhost/
- Health check: http://localhost:3000/health

## O que deve ser feito pelos membros do backend
- Os diretórios `src/config`, `src/controllers`, `src/middlewares`, `src/models`, `src/routes`, `src/services` e `src/utils` estão criados e prontos para implementação.
- A infraestrutura já está configurada e funciona no Docker Compose.
- O time de backend deve preencher esses diretórios com a lógica do sistema.

## Notas para o time
- O `Dockerfile` e o `docker-compose.yml` são os principais arquivos de infraestrutura.
- O Nginx já está configurado para encaminhar requisições para `app` em `http://app:3000`.
- O PostgreSQL é iniciado com dados persistentes em `postgres_data`.

## Prompt para a equipe
- Use `docs/prompt.md` para pedir ajuda à IA de forma organizada.
- Cada pessoa deve escolher sua função (1 a 5) e usar o prompt de exemplo.
- Isso ajuda a manter a divisão de trabalho clara entre infraestrutura, banco, auth, CRUD e documentação.
