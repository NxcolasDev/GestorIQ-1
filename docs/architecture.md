# Arquitetura do GestorIQ

> Conformidade com Opção A: Docker/Orquestração Nativa (TA001-TA008)

---

## Visão Geral

GestorIQ segue uma arquitetura em camadas com isolamento perimetral e boas práticas de produção:

```
┌─────────────────────────────────────────────────────────┐
│                    INTERNET (Port 80)                   │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│  NGINX (Reverse Proxy Layer)                            │
│  • Único serviço exposto                                │
│  • Rate limiting & compressão                           │
│  • Headers de segurança                                 │
│  • Terminação TLS (futuro)                              │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│  NODE.JS API (Application Layer)                        │
│  • Express.js                                           │
│  • Autenticação JWT                                     │
│  • Controllers → Services → Models                      │
│  • Health Check & Swagger                               │
│  • Comunicação via DNS interno                          │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│  POSTGRESQL (Data Layer)                                │
│  • Banco relacional                                     │
│  • Persistência em Named Volume                         │
│  • Inacessível de fora                                  │
│  • Replicação HA (futuro)                               │
└─────────────────────────────────────────────────────────┘
```

---

## Princípios Arquiteturais

### 1. Isolamento Perimetral (Defense in Depth - TA015)

**Rede Externa (web-network)**
```yaml
172.20.0.0/16
└─ nginx:80  [EXPOSTO → Internet]
```

**Rede Interna (app-network)**
```yaml
172.21.0.0/16
├─ app:3000    [NÃO EXPOSTO]
└─ postgres:5432 [NÃO EXPOSTO]
```

### 2. Service Discovery Nativo (TA005)

Comunicação via DNS interno do Docker:
- `nginx` → `app:3000` (resolução automática)
- `app` → `postgres:5432` (resolução automática)

**Sem IPs estáticos necessários!**

### 3. Multi-stage Build (TA002)

```
STAGE 1 (Builder):
  ├─ Base: node:24-alpine (350MB)
  ├─ RUN npm ci
  ├─ COPY src/
  └─ RUN npm prune --production

            ↓
            
STAGE 2 (Runtime):
  ├─ Base: node:24-alpine (350MB)
  ├─ COPY --from=builder /app
  ├─ User não-root
  └─ Resultado: ~150MB (70% menor!)
```

### 4. Persistência Resiliente (TA004)

```yaml
volumes:
  postgres_data:  # Named Volume (Docker-managed)
    driver: local
    driver_opts:
      device: ./data/postgres  # Bind path
```

**Vantagens:**
- ✅ Não removido com `docker rm`
- ✅ Backup/restore automáticos
- ✅ Funciona em Docker Swarm
- ✅ Docker gerencia mount points

### 5. Escalabilidade Horizontal (TA008)

Preparado para Docker Swarm:
```bash
docker service scale gestoriq_app=3
```

Health checks permitem auto-recover de réplicas problemáticas.

---

## Fluxo de Requisições HTTP

### Request Path

```
1. Client → http://localhost/api/users
2. Nginx (listener :80)
   ├─ Rate Limit: 10 req/s por IP
   ├─ Compressão: GZIP ativa
   ├─ Headers: X-Real-IP, X-Forwarded-For, etc
   └─ Proxy Pass → http://app:3000
3. App (Node.js)
   ├─ Express middleware
   ├─ Auth JWT validation
   ├─ Controller logic
   └─ Query PostgreSQL
4. PostgreSQL
   ├─ SQL execution
   └─ Return result
5. App → Response
6. Nginx → Compress → Client
```

### Response Path (JSON)

```json
{
  "status": 200,
  "data": { /* resultado */ }
}
```

Headers adicionados pelo Nginx:
```
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
```

---

## Comunicação Entre Containers

### Nginx ↔ App

```
Nginx Config:
upstream backend {
    server app:3000;  ← DNS resolve para IP do container
}

location / {
    proxy_pass http://backend;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

### App ↔ PostgreSQL

```javascript
// backend/src/config/database.js
const connection = new Sequelize({
  host: process.env.DB_HOST,  // = 'postgres'
  port: process.env.DB_PORT,  // = 5432
  database: process.env.DB_NAME,  // = 'gestoriq'
  username: process.env.DB_USER,  // = 'postgres'
  password: process.env.DB_PASSWORD,
});
// Docker DNS resolve automaticamente 'postgres' → IP do container
```

---

## Segurança da Arquitetura

### 1. Princípio do Menor Privilégio

```dockerfile
# Não root
RUN addgroup -S appgroup && adduser -S appuser
USER appuser  ← Executar como appuser
```

### 2. Isolamento de Rede

```yaml
# Nginx não pode acessar PostgreSQL diretamente
# App é o único intermediário
networks:
  web-network: [nginx]
  app-network: [nginx, app, postgres]
```

### 3. Dados Sensíveis

```bash
# Arquivo .env (ignorado no Git)
JWT_SECRET=xxx
DB_PASSWORD=yyy

# Carregado em tempo de runtime
docker compose up -d
```

### 4. Read-only Filesystem

```yaml
app:
  read_only: true
  tmpfs:
    - /tmp  # Apenas /tmp é gravável
```

### 5. Health Checks

```yaml
healthcheck:
  test: ["CMD", "node", "-e", "require('http').get(...)"]
  interval: 30s
  retries: 3
  start_period: 10s
```

Docker recupera automaticamente containers não-saudáveis.

---

## Layer Caching (TA003)

### Ordem Ótima no Dockerfile

```dockerfile
# 1. Base image (quase nunca muda)
FROM node:24-alpine

# 2. Dependencies (muda raramente)
COPY package*.json ./
RUN npm ci

# 3. Código-fonte (muda frequentemente)
COPY src ./src

# 4. User/User (setup raro)
USER appuser

# 5. CMD (nunca muda)
CMD ["node", "src/server.js"]
```

### Cache Hit Pattern

```
Build 1: FROM [cache] → COPY package [miss] → RUN npm [miss] → COPY src [miss]
Build 2: FROM [cache] → COPY package [HIT] → RUN npm [HIT] → COPY src [miss]
                                              (não refez npm, economizou 2 min!)
Build 3: FROM [cache] → COPY package [HIT] → RUN npm [HIT] → COPY src [HIT]
                                              (build rápido, mudou apenas src!)
```

---

## Imagens Base Escolhidas

### Node.js Alpine
```
Tag: node:24-alpine
Size: ~150MB (vs 1GB+ Debian)
Vantagem: Lightweight, segurança, layer caching eficiente
```

### PostgreSQL Alpine
```
Tag: postgres:17-alpine
Size: ~90MB
Vantagem: Rápido build, menor consumo de memória
```

### Nginx Alpine
```
Tag: nginx:1.27-alpine
Size: ~40MB
Vantagem: Reverse proxy eficiente, footprint mínimo
```

---

## Estrutura de Diretórios

```
GestorIQ/
├── backend/src/
│   ├── config/           # Configurações (DB, JWT, etc)
│   ├── controllers/      # Lógica de HTTP (req/res)
│   ├── middlewares/      # Auth, CORS, validação, logs
│   ├── models/           # Schema de dados (Sequelize)
│   ├── routes/           # Definição de endpoints
│   ├── services/         # Lógica de negócio
│   ├── utils/            # Helpers (validação, hash, etc)
│   ├── docs/             # Swagger/OpenAPI
│   ├── app.js            # Express app config
│   └── server.js         # HTTP listen
│
├── nginx/
│   └── nginx.conf        # Proxy reverso, rate limit, etc
│
└── docker-compose.yml    # Orquestração
```

---

## Escalabilidade Futura

### Docker Swarm (Multi-host)

```bash
# 1. Iniciar swarm
docker swarm init

# 2. Deploy como Stack
docker stack deploy -c docker-compose.yml gestoriq

# 3. Escalar aplicação
docker service scale gestoriq_app=3

# Nginx automaticamente balanceia entre 3 replicas
```

### Kubernetes (futuro)

Converter `docker-compose.yml` → Helm charts:
```bash
helm template gestoriq ./charts | kubectl apply -f -
```

---

## Monitoramento e Observabilidade

### Health Checks

```bash
# Docker monitora automaticamente
docker compose ps
# Mostra se cada container está "healthy" ou "unhealthy"
```

### Logs

```bash
docker compose logs -f app
docker compose logs -f postgres
docker compose logs -f nginx
```

### Métricas

```bash
docker stats  # CPU, Memory, I/O em tempo real
```

---

## Conformidade com Guia de Avaliação

| Requisito | Status | Implementação |
|-----------|--------|---------------|
| Multi-stage builds | ✅ | builder + runtime stage |
| Layer caching | ✅ | Dependencies antes de código |
| .dockerignore | ✅ | Reduz build context |
| 3+ serviços | ✅ | nginx + app + postgres |
| Named Volumes | ✅ | postgres_data resiliente |
| Custom Bridge | ✅ | web-network + app-network |
| DNS interno | ✅ | Service discovery automático |
| Security | ✅ | User não-root, isolamento |
| Health checks | ✅ | Todos serviços monitorados |
| Restart policy | ✅ | unless-stopped |

---

## Referências

- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Docker Compose Specification](https://docs.docker.com/compose/compose-file/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [PostgreSQL Production Checklist](https://wiki.postgresql.org/wiki/Performance_Optimization)
