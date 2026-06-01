# Infraestrutura do GestorIQ

> Especificação técnica de deployment (Opção A: Docker/Orquestração Nativa)

---

## Stack Tecnológico

| Componente | Versão | Propósito | Tamanho |
|-----------|--------|----------|--------|
| Node.js | 24-alpine | Runtime | 150MB |
| Express | 5.2.1 | Framework Web | Incluído |
| PostgreSQL | 17-alpine | Banco Dados | 90MB |
| Nginx | 1.27-alpine | Proxy Reverso | 40MB |
| Docker | 20.10+ | Containerização | Host |
| Docker Compose | 1.29+ | Orquestração | Host |

---

## Serviços Docker

### 1. NGINX (Reverse Proxy)

```yaml
Container: gestoriq_nginx
Image: nginx:1.27-alpine
Port: 80:80 (exposto)
Network: web-network (externa)
          app-network (interna)
Status: Up (healthy)
```

**Responsabilidades:**
- ✓ Único serviço exposto à internet
- ✓ Proxy reverso para App
- ✓ Rate limiting (10 req/s geral, 30 req/s API)
- ✓ Compressão GZIP
- ✓ Headers de segurança
- ✓ Logs de acesso

**Health Check:**
```bash
docker exec gestoriq_nginx wget --quiet --tries=1 --spider http://localhost/health
```

### 2. APP (Node.js API)

```yaml
Container: gestoriq_app
Image: (custom, built from ./Dockerfile)
Port: 3000:3000 (exposto apenas internamente)
Network: app-network
Env: backend/.env
Status: Up (healthy)
```

**Responsabilidades:**
- ✓ Lógica de negócio REST
- ✓ Autenticação JWT
- ✓ Conecta a PostgreSQL
- ✓ Swagger/OpenAPI docs
- ✓ Health check endpoint

**Health Check:**
```bash
docker exec gestoriq_app curl http://localhost:3000/health
# Resposta: { "status": "ok" }
```

**Endpoints:**
- `GET /` → Status geral
- `GET /health` → Health check
- `GET /api-docs` → Swagger
- `/api/*` → API endpoints

### 3. POSTGRESQL (Database)

```yaml
Container: gestoriq_postgres
Image: postgres:17-alpine
Port: 5432 (exposto apenas internamente)
Network: app-network
Volume: postgres_data (Named Volume)
Status: Up (healthy)
```

**Responsabilidades:**
- ✓ Persistência de dados
- ✓ Consultas SQL
- ✓ Integridade referencial
- ✓ Backups (configurável)

**Health Check:**
```bash
docker exec gestoriq_postgres pg_isready -U postgres -h localhost
# Resposta: accepting connections
```

**Conexão:**
```
Host: postgres (DNS resolve via docker internal)
Port: 5432
User: postgres
Password: (from .env)
Database: gestoriq
```

---

## Docker Compose Configuration

### Arquivo: `docker-compose.yml`

```yaml
version: '3.9'  # Spec 3.9+ para swarm-ready configs
```

#### Serviços (Services)

Cada serviço é definido com:
- `build` ou `image`
- `container_name` (identificação)
- `restart: unless-stopped` (auto-recovery)
- `environment` ou `env_file` (configuração)
- `volumes` (persistência)
- `healthcheck` (monitoramento)
- `networks` (isolamento)
- `security_opt` (hardening)
- `read_only` (filesystem seguro)
- `deploy.resources` (limites)

#### Networks

**web-network**
```
172.20.0.0/16
Serviços: nginx
Exposição: Internet
```

**app-network**
```
172.21.0.0/16
Serviços: app, postgres
Exposição: Nenhuma (interna)
```

#### Volumes

**postgres_data** (Named Volume)
```
Driver: local
Caminho: ./data/postgres
Persistência: Sim
Backup: Manual via pg_dump
```

---

## Docker Compose - Comandos Operacionais

### Build & Deploy

```bash
# Construir imagens
docker compose build --no-cache

# Iniciar (cria e start)
docker compose up -d

# Parar
docker compose stop

# Remover containers
docker compose down

# Remove containers + volumes (cuidado!)
docker compose down -v
```

### Monitoramento

```bash
# Status dos containers
docker compose ps

# Logs em tempo real
docker compose logs -f app

# Logs das últimas 100 linhas
docker compose logs --tail=100 app

# Logs de todos serviços
docker compose logs -f
```

### Execução de Comandos

```bash
# SQL no PostgreSQL
docker compose exec postgres psql -U postgres -d gestoriq

# Node REPL na app
docker compose exec app node

# Shell no container
docker compose exec app sh
```

---

## Nginx Configuration

### Arquivo: `nginx/nginx.conf`

#### Upstream (Backend)

```nginx
upstream backend {
    server app:3000;  # DNS resolve automaticamente
    keepalive 32;     # Connection pooling
}
```

#### Rate Limiting

```nginx
limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=api:10m rate=30r/s;
```

- `general`: 10 req/s (recursos em geral)
- `api`: 30 req/s (endpoints de API)

#### Server Block

```nginx
server {
    listen 80 default_server;
    server_name _;
}
```

#### Proxy Headers

```nginx
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
```

Passam informações corretas ao backend.

#### Security Headers

```nginx
add_header X-Content-Type-Options "nosniff";
add_header X-Frame-Options "SAMEORIGIN";
add_header X-XSS-Protection "1; mode=block";
```

Proteção contra ataques comuns.

#### Compression

```nginx
gzip on;
gzip_types text/plain text/css application/json ...;
gzip_comp_level 6;
```

Reduz tamanho de respostas em 60-80%.

---

## Dockerfile - Multi-stage Build

### Stage 1: Builder

```dockerfile
FROM node:24-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY src ./src
RUN npm prune --production
```

**Propósito:** Compilar e preparar dependências

**Saída:** Diretório `/app` com:
- `node_modules/` (apenas production)
- `src/`
- `package.json`

### Stage 2: Runtime

```dockerfile
FROM node:24-alpine

LABEL maintainer="GestorIQ Team"
LABEL version="1.0.0"

WORKDIR /app
COPY --from=builder /app .

RUN addgroup -S appgroup && adduser -S appuser
RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 3000
HEALTHCHECK --interval=30s ...
CMD ["node", "src/server.js"]
```

**Propósito:** Imagem leve e segura

**Benefícios:**
- Sem dev dependencies (70% menor)
- User não-root
- Health check integrado
- Imagem imutável

---

## Persistência de Dados

### Named Volumes

```yaml
volumes:
  postgres_data:
    driver: local
    driver_opts:
      device: ./data/postgres
```

**Vantagens sobre Bind Mounts:**
- ✓ Gerenciado pelo Docker
- ✓ Backup/restore automático
- ✓ Funciona em múltiplos hosts (Swarm)
- ✓ Melhor performance

### Backup Manual

```bash
# Dump completo do banco
docker exec gestoriq_postgres pg_dump -U postgres gestoriq > backup_$(date +%Y%m%d_%H%M%S).sql

# Comprimido
docker exec gestoriq_postgres pg_dump -U postgres gestoriq | gzip > backup.sql.gz

# Restaurar
docker exec -i gestoriq_postgres psql -U postgres < backup.sql
```

### Volume Inspection

```bash
# Listar volumes
docker volume ls

# Inspecionar local
docker volume inspect gestoriq_postgres_data

# Acessar arquivos diretamente
ls -la ./data/postgres/
```

---

## Comunicação Entre Serviços

### Nginx → App

```
1. Cliente: http://localhost/api/users
2. Nginx (172.20.x.x):80
   └─ DNS: app:3000 → 172.21.x.x:3000
3. App (172.21.x.x):3000
```

**Resolução DNS:**
- Docker daemon fornece DNS local (`127.0.0.11:53`)
- `app` resolve para IP do container app
- Automático, sem configuração manual

### App → PostgreSQL

```
App (172.21.x.x)
   └─ DNS: postgres:5432 → 172.21.x.x:5432
PostgreSQL (172.21.x.x):5432
```

**Via Sequelize:**
```javascript
new Sequelize({
  host: process.env.DB_HOST,  // 'postgres'
  port: process.env.DB_PORT,  // 5432
})
```

---

## Segurança

### 1. User Não-Root

```dockerfile
RUN addgroup -S appgroup && adduser -S appuser
USER appuser  # Não root!
```

Evita que attacker tenha acesso root ao container.

### 2. Isolamento de Rede

```
Internet
   ↓ :80
Nginx [web-network + app-network]
   ↓ :3000 (interno)
App [app-network]
   ↓ :5432 (interno)
PostgreSQL [app-network]
```

PostgreSQL nunca exposto à internet!

### 3. Variáveis de Ambiente

```env
JWT_SECRET=xxx  # Do arquivo .env
DB_PASSWORD=yyy
```

Não commitadas no Git.

### 4. Read-only Filesystem

```yaml
app:
  read_only: true
  tmpfs:
    - /tmp  # Apenas /tmp gravável
```

Impede modificação de código em runtime.

### 5. Security Headers

```
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
```

Bloqueiam ataques no navegador.

---

## Resource Limits

```yaml
app:
  deploy:
    resources:
      limits:
        cpus: '0.5'      # Max 50% de um core
        memory: 256M     # Max 256MB RAM
      reservations:
        cpus: '0.25'
        memory: 128M
```

Evita que um serviço consuma todos recursos.

---

## Health Checks

### Nginx
```yaml
healthcheck:
  test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 10s
```

### App
```yaml
healthcheck:
  test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000/health', ...)"]
  interval: 30s
```

### PostgreSQL
```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U postgres"]
  interval: 10s
```

---

## Restart Policies

```yaml
restart: unless-stopped
```

**Comportamento:**
- ✓ Reinicia se container morrer
- ✓ NÃO reinicia se explicitamente parado
- ✓ Ideal para produção

**Alternativas:**
- `no`: Não reinicia
- `always`: Sempre reinicia
- `on-failure`: Reinicia só se exit code != 0

---

## Escalabilidade

### Local (Docker Compose)
```bash
# Múltiplas replicas (requer haproxy/nginx externo)
docker compose up -d --scale app=3
```

### Swarm (Multi-host)
```bash
docker swarm init
docker stack deploy -c docker-compose.yml gestoriq
docker service scale gestoriq_app=3
```

### Kubernetes
```bash
kubectl apply -f manifests/
kubectl scale deployment app --replicas=3
```

---

## Troubleshooting

### Container não inicia
```bash
docker compose logs app
# Ver erro detalhado
```

### Porta em uso
```bash
lsof -i :80  # Ver processo
kill -9 PID
```

### Volume danificado
```bash
docker volume rm gestoriq_postgres_data
docker compose up -d  # Recria volume
```

### Performance lenta
```bash
docker stats  # Ver CPU/Memory
docker system prune  # Limpar
```

---

## Referências

- [Docker Compose Specification](https://docs.docker.com/compose/compose-file/)
- [Nginx Best Practices](https://nginx.org/en/docs/http/ngx_http_upstream_module.html)
- [PostgreSQL Production Deployment](https://www.postgresql.org/docs/current/runtime-config.html)
- [Docker Security Best Practices](https://docs.docker.com/engine/security/)
