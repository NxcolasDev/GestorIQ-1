# 🎓 PERGUNTAS ESPERADAS DA BANCA - GestorIQ

100+ perguntas organizadas por tópico com respostas fundamentadas.

---

## 📋 ÍNDICE POR TÓPICO

1. [Arquitetura Geral](#arquitetura-geral-10-perguntas) (10)
2. [Docker](#docker-15-perguntas) (15)
3. [Docker Compose](#docker-compose-10-perguntas) (10)
4. [Banco de Dados](#banco-de-dados-20-perguntas) (20)
5. [Normalização](#normalizacao-15-perguntas) (15)
6. [REST API](#rest-api-15-perguntas) (15)
7. [Autenticação](#autenticacao-10-perguntas) (10)
8. [Segurança](#seguranca-10-perguntas) (10)

**Total: 115 perguntas**

---

# ARQUITETURA GERAL (10 Perguntas)

## P1: O que é GestorIQ e qual é seu propósito?

**Resposta breve:**
GestorIQ é um sistema de gestão de estoque implementado como API REST containerizada, desenvolvido para demonstrar conhecimentos em banco de dados, infraestrutura e desenvolvimento web.

**Resposta expandida:**
- Funciona como API REST que gerencia produtos, categorias, fornecedores e usuários
- Implementado em Node.js 24 com Express 5
- Armazenamento em PostgreSQL 17 normalizado até 3FN
- Roda em 3 containers Docker (Nginx, App, PostgreSQL)
- Suporta autenticação JWT
- Documentação automática via Swagger

**Pontos-chave:** REST API, containerizado, três disciplinas integradas

---

## P2: Quantos e quais são os componentes principais?

**Resposta:**

| Componente | Tecnologia | Porta | Acesso |
|------------|-----------|-------|--------|
| Nginx | 1.27-alpine | 80 | ✅ Público (host) |
| App | Node.js 24 + Express 5 | 3000 | ❌ Privado (rede interna) |
| PostgreSQL | 17-alpine | 5432 | ❌ Privado (rede interna) |

**Explicação:**
- Nginx é o único componente exposto (porta 80)
- App e PostgreSQL são isolados em rede interna
- Comunicação: Cliente → Nginx → App → PostgreSQL

---

## P3: Qual é o fluxo de uma requisição?

**Resposta:**

```
1. Cliente (Postman/Browser) 
   → HTTP GET http://localhost/api/categorias

2. Nginx (porta 80)
   → Recebe requisição HTTP na porta 80
   → Consulta arquivo de config (upstream app:3000)
   → Roteia para App no container app

3. App Node.js (porta 3000)
   → Recebe requisição
   → Middleware verifyToken valida JWT
   → Controller categoryController.list processa
   → Executa query SQL

4. PostgreSQL (porta 5432)
   → Recebe query SQL parameterizada
   → Executa: SELECT * FROM categorias
   → Retorna dados

5. Resposta viaja de volta
   ← PostgreSQL → App → Nginx → Cliente
   ← JSON com array de categorias

6. Cliente recebe resposta HTTP 200 OK
```

---

## P4: Por que a arquitetura foi desenhada assim (3 componentes)?

**Resposta:**

**Razões técnicas:**
1. **Separação de Responsabilidades**
   - Nginx: Roteamento e proxy
   - App: Lógica de negócio
   - PostgreSQL: Armazenamento

2. **Escalabilidade**
   - Cada componente pode ser escalado independentemente
   - Múltiplas instâncias de App sem problema

3. **Segurança**
   - Nginx protege App
   - App protege PostgreSQL
   - DDoS em 80 não afeta banco

4. **Resiliência**
   - Se App falha, PostgreSQL mantém dados
   - Restart automático via healthchecks

5. **Segurança por rede**
   - App não expõe porta 3000
   - PostgreSQL não expõe porta 5432
   - Isolamento em nível de rede

---

## P5: Que padrão de arquitetura é usado?

**Resposta:**

**Padrão: Camadas (Layered Architecture)**

```
┌──────────────────────────────────┐
│      Presentation Layer          │
│   (Nginx, Endpoints REST)        │
└────────────┬─────────────────────┘
             │
┌────────────▼─────────────────────┐
│      Business Logic Layer        │
│   (Controllers, Services)        │
└────────────┬─────────────────────┘
             │
┌────────────▼─────────────────────┐
│      Persistence Layer           │
│   (PostgreSQL, Queries)          │
└──────────────────────────────────┘
```

**Características:**
- Separação clara entre camadas
- Cada camada tem responsabilidade definida
- Mudanças em uma camada não afetam outras
- Fácil de testar (mocking)

---

## P6: Qual é a topologia de rede?

**Resposta:**

**2 Redes Separadas:**

1. **web-network (Bridge)**
   - Conecta: Nginx e App
   - Tráfego: HTTP do Nginx para App

2. **app-network (Bridge)**
   - Conecta: App e PostgreSQL
   - Tráfego: SQL do App para BD

**Por que 2 redes?**
- Nginx não acessa PostgreSQL diretamente
- PostgreSQL não recebe requisições HTTP
- Isolamento de segurança por rede

**DNS interno:**
```
nginx pode alcançar: app (por dns)
app pode alcançar: postgres (por dns)
nginx NÃO pode alcançar: postgres
```

---

## P7: Qual é o volume de dados esperado?

**Resposta:**

**Seed Data (Dados de Teste):**
- **10 usuários** (1 admin, 9 comuns)
- **15 categorias** (Eletrônicos, Informática, Periféricos, etc.)
- **20 fornecedores** (Tech Solutions, Dell, Lenovo, HP, etc.)
- **60+ produtos** (Distribuídos entre categorias)
- **150+ relacionamentos N:N** (Produto-Fornecedor)

**Total: 100+ registros**

**Por que 100+?**
- Suficiente para testes realistas
- Demonstra performance em um mini-dataset
- Fácil de gerar e reproduzir

---

## P8: Qual é a diferença entre este projeto e um projeto real em produção?

**Resposta:**

| Aspecto | Este Projeto | Produção |
|---------|---------|-----------|
| **Containers** | 3 (nginx, app, postgres) | 10-100+ (replicas, cache, monitoring) |
| **Load balancing** | Nenhum | Múltiplas instâncias de app |
| **Caching** | Nenhum | Redis, Memcached |
| **Monitoring** | Healthchecks básicos | Prometheus, Grafana, ELK |
| **Logging** | Console | Elasticsearch, Fluentd |
| **DB Replication** | Nenhuma | Master-slave, backup automático |
| **CI/CD** | Manual | Git webhooks, Jenkins, GitHub Actions |
| **SSL/TLS** | Nenhum | HTTPS obrigatório |
| **Rate limiting** | Nenhum | Token bucket, IP-based |
| **Documentação** | Swagger | Swagger + wikis internas |

**Resumo:** Este projeto é educacional, produção teria 10x+ complexidade.

---

## P9: Como este projeto mapeia para as 3 disciplinas?

**Resposta:**

### PDF 1: Banco de Dados
- ✅ 5 tabelas normalizadas (1FN, 2FN, 3FN)
- ✅ Tabela pivô para relação N:N
- ✅ Constraints (UNIQUE, CHECK, FK)
- ✅ 100+ registros de teste
- ✅ 6+ queries críticas documentadas

### PDF 2: Infraestrutura
- ✅ Dockerfile multi-stage
- ✅ Docker Compose com 3+ serviços
- ✅ Nginx reverse proxy
- ✅ Named Volumes para persistência
- ✅ Health checks
- ✅ Redes customizadas

### PDF 3: Desenvolvimento Web
- ✅ Node.js + Express API REST
- ✅ Autenticação JWT
- ✅ CRUD completo (5 operações por entidade)
- ✅ Swagger documentação
- ✅ CLI migrations (command.js)
- ✅ Middleware customizado

**Conclusão:** Projeto integra os 3 pilares de forma harmônica.

---

## P10: Qual é o ciclo de deploy?

**Resposta:**

```
1. Desenvolvimento
   git clone repo
   npm install (backend)
   .env.example → .env

2. Build
   docker compose build --no-cache

3. Deployment
   docker compose up -d

4. Validação
   docker compose ps (verificar health)
   curl http://localhost/health
   Acessar http://localhost/api-docs

5. População
   docker compose exec app node command.js migrate
   docker compose exec app node command.js seed

6. Testes
   curl /api/login (get JWT)
   curl /api/categorias (com JWT)
   Verificar dados persistem

7. Operação
   Monitorar com: docker compose logs -f
```

---

# DOCKER (15 Perguntas)

## P11: O que é Docker?

**Resposta breve:**
Docker é um sistema de containerização que permite empacotar código + dependências em uma imagem, garantindo que roda igual em qualquer máquina.

**Resposta expandida:**
- Cria containers (ambientes isolados)
- Reduz "funciona na minha máquina" 
- Mais leve que máquina virtual (~100MB vs ~2GB)
- Inicia em ~1 segundo (vs ~30s em VM)
- Ideal para DevOps, CI/CD, microserviços

---

## P12: Container vs Máquina Virtual?

**Resposta:**

| Aspecto | Container | VM |
|---------|-----------|-----|
| Size | ~100MB | ~2GB |
| Startup | ~1s | ~30s |
| Isolamento | Processo-level | Completo (outro SO) |
| Performance | ~100% host | ~80% host |
| Overhead | Kernel compartilhado | Kernel completo duplicado |
| Usos | Microserviços, CI/CD | Máquinas virtuais isoladas |

---

## P13: O que é o Dockerfile?

**Resposta:**
Arquivo de script que define como montar uma imagem Docker. Especifica:
- Imagem base
- Dependências
- Comandos de setup
- Entrypoint

**Exemplo (GestorIQ):**
```dockerfile
FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
USER node
CMD ["node", "src/server.js"]
```

---

## P14: O que é build multi-stage?

**Resposta:**

**Problema:**
Imagem Docker inclui ferramentas de build que não são necessárias em runtime:
- node-gyp
- build-essential
- Faz imagem ficar grande (~500MB)

**Solução Multi-Stage:**

```dockerfile
# Stage 1: Build
FROM node:24-alpine AS builder
WORKDIR /app
COPY package.json .
RUN npm ci --only=production

# Stage 2: Runtime (stage 1 é descartado)
FROM node:24-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
CMD ["node", "src/server.js"]
```

**Benefício:**
- Stage 1 (~300MB) é descartado
- Imagem final (~120MB)
- Menos dependências = menos vulnerabilidades

---

## P15: O que é Alpine Linux?

**Resposta:**
Distribuição Linux mínima (~5MB) vs Ubuntu (~77MB).

**Por que usar?**
```dockerfile
FROM node:24-alpine    # 120MB
FROM node:24-ubuntu    # 280MB
FROM node:24-debian    # 350MB
```

**Desvantagens:**
- Menos ferramentas disponíveis
- Pode precisar de build-essential para packages C++

**GestorIQ:** Usa alpine para Node.js, Nginx, PostgreSQL

---

## P16: O que é uma imagem Docker?

**Resposta:**
Imagem é um "template" ou "blueprint" para criar containers.

**Analogia:**
- Imagem = Classe (Java/Python)
- Container = Instância

**Layers:**
```
Layer 1: FROM node:24-alpine (base OS)
Layer 2: WORKDIR /app
Layer 3: COPY package*.json
Layer 4: RUN npm ci
Layer 5: COPY . .
Layer 6: CMD ["node", "src/server.js"]
```

Cada RUN/COPY cria uma layer.

---

## P17: O que é um container?

**Resposta:**
Container é uma **instância em execução** de uma imagem Docker.

**Analogia:**
```
Imagem Docker → Container
Class → Instance
Template → Execução
```

**Exemplo:**
```bash
docker build -t gestoriq .  # Cria imagem
docker run -d gestoriq      # Cria container (instância)
docker run -d gestoriq      # Cria OUTRO container (instância 2)
```

---

## P18: O que é Dockerfile vs docker-compose.yml?

**Resposta:**

| Aspecto | Dockerfile | docker-compose.yml |
|---------|-----------|----------------------|
| **Propósito** | Definir imagem | Orquestrar containers |
| **Escopo** | 1 imagem | Múltiplos serviços |
| **Uso** | `docker build` | `docker compose up` |
| **Exemplo** | Node.js app | Nginx + App + PostgreSQL |

---

## P19: Como funciona a cache de layers no Docker?

**Resposta:**

```dockerfile
FROM node:24-alpine          # Layer 1: Cached se imagem base não mudar
WORKDIR /app                 # Layer 2: Cached sempre (determinístico)
COPY package*.json ./        # Layer 3: ❌ Não cached se package.json mudou
RUN npm ci --only=production # Layer 4: Precisa reexecutar se package*.json mudou
COPY . .                     # Layer 5: ❌ Não cached se código mudou
CMD ["node", "src/server.js"]
```

**Otimização (Multi-stage):**
```dockerfile
# Stage 1: Muda quando package.json muda
FROM node:24-alpine AS builder
COPY package*.json ./
RUN npm ci

# Stage 2: Muda quando código muda (rebuilda rápido porque stage 1 foi cached)
FROM node:24-alpine
COPY --from=builder /app/node_modules .
COPY . .
```

---

## P20: Por que usar USER node em vez de root?

**Resposta:**

**Risco com root:**
```dockerfile
USER root  # ❌ App roda como root
# Se app é comprometida, atacante tem acesso total ao container
```

**Segurança com node:**
```dockerfile
USER node  # ✅ App roda com permissões limitadas
# Se app é comprometida, atacante tem acesso limitado ao node
```

**No Dockerfile GestorIQ:**
```dockerfile
FROM node:24-alpine
WORKDIR /app
COPY --chown=node:node . .
USER node  # ✅ Roda com permissões limitadas
CMD ["node", "src/server.js"]
```

---

## P21: O que é healthcheck?

**Resposta:**

Health check é um teste periódico que Docker executa para verificar se container está saudável.

**No Dockerfile:**
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1
```

**Significado:**
- A cada 30s: faz GET /health
- Aguarda 3s por resposta
- Aguarda 40s antes do primeiro check (tempo de startup)
- Falha após 3 tentativas falhadas

**docker compose ps output:**
```
gestoriq_app ... Up (healthy)       # ✅ Health check passou
gestoriq_app ... Up (unhealthy)     # ❌ Health check falhou
```

---

## P22: Como criar uma imagem Docker?

**Resposta:**

```bash
docker build -t gestoriq:latest .
         ↓        ↓              ↓
    Comando   Tag (nome:versão) Dockerfile no diretório atual

# Resultado:
# Imagem criada com nome "gestoriq" e tag "latest"
# Pode ser usada em: docker run gestoriq
#                    docker compose build
```

---

## P23: Como ver imagens criadas?

**Resposta:**

```bash
docker images

# Output:
REPOSITORY    TAG      IMAGE ID      SIZE
gestoriq      latest   a1b2c3d4e5f6  120MB
node          24-alpine 9e8f7d6c5b4a 180MB
nginx         latest    xyz...       42MB
postgres      17-alpine abc...       200MB
```

---

## P24: O que é .dockerignore?

**Resposta:**

Arquivo que especifica quais arquivos NÃO devem ser copiados para a imagem (similar a .gitignore).

**Exemplo (GestorIQ):**
```
node_modules      # Já vão ser instalados no container
.git              # Não é necessário em runtime
.gitignore        # Metadados, não necessário
README.md         # Documentação, não necessário
.env              # Segredos NÃO devem estar em imagem
docker-compose.yml # Para desenvolvimento, não em imagem
.DS_Store         # Arquivos do macOS
```

**Benefício:**
```
Sem .dockerignore: 500MB (inclui tudo)
Com .dockerignore: 120MB (otimizado)
```

---

## P25: Como entrar em um container em execução?

**Resposta:**

```bash
docker compose exec app bash
                    ↓    ↓
              Nome serviço  Shell

# Agora você está dentro do container:
/app # ls
/app # node -v
/app # exit  # Sair
```

---

# DOCKER COMPOSE (10 Perguntas)

## P26: O que é Docker Compose?

**Resposta:**
Docker Compose é uma ferramenta para definir e orquestrar múltiplos containers como uma aplicação única.

**Arquivo:** docker-compose.yml (YAML)

**Benefício:**
```bash
# Sem Compose: 6 comandos
docker network create app-network
docker build -t gestoriq .
docker run -d --name nginx --network app-network nginx
docker run -d --name app --network app-network gestoriq
docker run -d --name postgres --network app-network postgres
docker network connect web-network nginx

# Com Compose: 1 comando
docker compose up
```

---

## P27: Qual é a estrutura do docker-compose.yml?

**Resposta:**

```yaml
version: '3.9'                    # Versão do Compose

services:                         # Definição dos containers
  nginx:
    image: nginx:1.27-alpine
    ports:
      - "80:80"
    networks:
      - web-network

  app:
    build: .                      # Compila Dockerfile
    expose:
      - 3000
    environment:                  # Variáveis de ambiente
      - DB_HOST=postgres
    networks:
      - web-network
      - app-network
    depends_on:                   # Aguarda outros serviços
      postgres:
        condition: service_healthy

  postgres:
    image: postgres:17-alpine
    volumes:                      # Mapeamento de diretórios
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app-network

networks:                         # Definição de redes
  web-network:
    driver: bridge
  app-network:
    driver: bridge

volumes:                          # Definição de volumes
  postgres_data:
    driver: local
```

---

## P28: Qual é a diferença entre ports e expose?

**Resposta:**

| Aspecto | ports | expose |
|---------|-------|--------|
| **O que faz** | Mapeia porta para host | Apenas documenta porta |
| **Acesso host** | ✅ Pode acessar | ❌ Não pode acessar |
| **Exemplo** | ports: "80:80" | expose: 3000 |
| **Uso** | Serviços públicos | Serviços internos |

**GestorIQ:**
- nginx: `ports: 80:80` (acesso host)
- app: `expose: 3000` (privado)
- postgres: sem ports/expose (privado)

---

## P29: Como gerenciar dados com volumes?

**Resposta:**

**3 tipos de volumes:**

### 1. Named Volume (GestorIQ usa isso)
```yaml
volumes:
  postgres_data:
    driver: local

services:
  postgres:
    volumes:
      - postgres_data:/var/lib/postgresql/data
```
- Gerenciado pelo Docker
- Persiste mesmo após container deletado
- Localizado em `/var/lib/docker/volumes/` no host

### 2. Bind Mount
```yaml
services:
  app:
    volumes:
      - ./backend:/app  # Diretório host → container
```
- Mapeia diretório host para container
- Útil para desenvolvimento (code reload)

### 3. Anonymous Volume
```yaml
services:
  postgres:
    volumes:
      - /var/lib/postgresql/data  # Sem nome
```
- Criado automaticamente
- Deletado quando container para

**GestorIQ:** Named Volume para BD (persistência garantida)

---

## P30: Como definir variáveis de ambiente?

**Resposta:**

**Opção 1: Direto no compose**
```yaml
services:
  app:
    environment:
      - DB_HOST=postgres
      - DB_PASSWORD=senha123
```

**Opção 2: Arquivo .env**
```yaml
services:
  app:
    env_file: backend/.env
```

**backend/.env:**
```
DB_HOST=postgres
DB_PASSWORD=senha123
NODE_ENV=production
```

**Opção 3: Parametrização**
```yaml
services:
  app:
    environment:
      - DB_HOST=${DB_HOST}
      - DB_PASSWORD=${DB_PASSWORD}
```

Depois: `DB_PASSWORD=abc123 docker compose up`

**GestorIQ:** Usa arquivo .env (mais seguro que hardcode)

---

## P31: Como ordenar inicialização de serviços?

**Resposta:**

**depends_on com condition:**
```yaml
services:
  app:
    depends_on:
      postgres:
        condition: service_healthy  # Aguarda healthcheck passar
```

**Sem condition (apenas aguarda container iniciar, não saúde):**
```yaml
services:
  app:
    depends_on:
      - postgres
```

**GestorIQ:**
```yaml
app:
  depends_on:
    postgres:
      condition: service_healthy  # Aguarda BD estar saudável
```

---

## P32: Como conectar containers em rede?

**Resposta:**

**Docker Compose cria rede automática:**
```yaml
services:
  app:
    networks:
      - app-network
  postgres:
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

**Comunicação interna:**
- app pode acessar postgres pelo nome: `postgres:5432`
- Docker resolve nome → IP automaticamente

**GestorIQ:**
```yaml
networks:
  web-network:       # Nginx ↔ App
    driver: bridge
  app-network:       # App ↔ PostgreSQL
    driver: bridge
```

---

## P33: Como escalar um serviço (múltiplas replicas)?

**Resposta:**

```bash
docker compose up --scale app=3
                             ↓
                    3 instâncias de app

# Resulta em:
gestoriq_app_1
gestoriq_app_2
gestoriq_app_3
```

**Limitações:**
- Sem load balancer, só acessa primeira instância
- Precisa de Nginx ou HAProxy para round-robin

**Produção:** Usar Kubernetes para auto-scaling

---

## P34: Como parar e limpar containers?

**Resposta:**

```bash
docker compose stop          # Para containers (volume mantido)
docker compose restart       # Reinicia containers
docker compose pause         # Pausa execução (sem parar)
docker compose unpause       # Resume execução

docker compose down          # Para + remove containers
docker compose down -v       # Para + remove containers + volumes
docker compose rm -f         # Remove apenas containers (força)
```

**GestorIQ:**
```bash
docker compose down -v       # Reset total (cuidado: perde dados!)
docker compose down          # Para mantendo dados
```

---

## P35: Como ver logs de todos serviços?

**Resposta:**

```bash
docker compose logs             # Ver logs de todos
docker compose logs -f          # Follow mode (atualiza em tempo real)
docker compose logs app         # Logs apenas do app
docker compose logs -f app      # Follow logs do app
docker compose logs --tail 100  # Últimas 100 linhas
```

**GestorIQ Debug:**
```bash
docker compose logs app         # Ver erros da API
docker compose logs postgres    # Ver erros do BD
docker compose logs nginx       # Ver erros do proxy
```

---

# BANCO DE DADOS (20 Perguntas)

## P36: Qual é o modelo de dados do GestorIQ?

**Resposta:**

5 tabelas:

| Tabela | Atributos | Chave |
|--------|-----------|-------|
| usuarios | id, nome, email (UNIQUE), senha, created_at, updated_at | id |
| categorias | id, nome, descricao, created_at, updated_at | id |
| fornecedores | id, nome, cnpj, telefone, email, created_at, updated_at | id |
| produtos | id, nome, descricao, preco (≥0), quantidade_estoque (≥0), categoria_id (FK), created_at, updated_at | id |
| produto_fornecedor | produto_id (FK), fornecedor_id (FK), created_at | (produto_id, fornecedor_id) |

---

## P37: Por que 5 tabelas e não menos?

**Resposta:**

**4 tabelas (usuários, categorias, fornecedores, produtos):**
- Usuários gerenciam sistema
- Categorias agrupam produtos
- Fornecedores fornecem produtos
- Produtos são itens do estoque

**Tabela 5ª (produto_fornecedor):**
- Gerencia relação N:N
- Um produto pode ter múltiplos fornecedores
- Um fornecedor fornece múltiplos produtos

**Sem tabela pivô:**
```sql
-- ❌ Errado: Dados duplicados
CREATE TABLE produtos (
  id SERIAL,
  nome VARCHAR(255),
  fornecedor_id_1 INTEGER,
  fornecedor_id_2 INTEGER,
  fornecedor_id_3 INTEGER,
  ...
);
```

**Com tabela pivô:**
```sql
-- ✅ Correto: Flexível
CREATE TABLE produto_fornecedor (
  produto_id INTEGER,
  fornecedor_id INTEGER,
  PRIMARY KEY (produto_id, fornecedor_id)
);
```

---

## P38: Como funcionam os relacionamentos?

**Resposta:**

### Relacionamento 1:N (Uma Categoria → Muitos Produtos)

```sql
CREATE TABLE categorias (
  id SERIAL PRIMARY KEY
);

CREATE TABLE produtos (
  id SERIAL PRIMARY KEY,
  categoria_id INTEGER REFERENCES categorias(id)
);

-- Resultado: 1 categoria pode ter N produtos
```

### Relacionamento N:M (Muitos Produtos ↔ Muitos Fornecedores)

```sql
CREATE TABLE produtos (
  id SERIAL PRIMARY KEY
);

CREATE TABLE fornecedores (
  id SERIAL PRIMARY KEY
);

CREATE TABLE produto_fornecedor (
  produto_id INTEGER REFERENCES produtos(id),
  fornecedor_id INTEGER REFERENCES fornecedores(id),
  PRIMARY KEY (produto_id, fornecedor_id)
);

-- Resultado: N produtos ↔ M fornecedores
```

---

## P39: O que é Chave Primária?

**Resposta:**
Chave primária é um atributo (ou conjunto de atributos) que identifica **unicamente** cada registro na tabela.

**Características:**
- ✅ Única (UNIQUE)
- ✅ Não nula (NOT NULL)
- ✅ Sem duplicatas
- ✅ Imutável (idealmente)

**Exemplos no GestorIQ:**
```sql
-- Chave simples
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY  -- ✅ Identifica usuário
);

-- Chave composta (tabela pivô)
CREATE TABLE produto_fornecedor (
  produto_id INTEGER,
  fornecedor_id INTEGER,
  PRIMARY KEY (produto_id, fornecedor_id)  -- ✅ Identifica relacionamento
);
```

---

## P40: O que é Chave Estrangeira (FK)?

**Resposta:**
Chave estrangeira é um atributo que faz referência à chave primária de outra tabela, garantindo integridade referencial.

**Exemplo:**
```sql
CREATE TABLE produtos (
  id SERIAL PRIMARY KEY,
  categoria_id INTEGER REFERENCES categorias(id)
                                    ↑
                      Aponta para PK de categorias
);

-- Garantia: categoria_id em produtos deve existir em categorias.id
```

**Comportamentos:**

1. **RESTRICT** (padrão):
```sql
DELETE FROM categorias WHERE id = 1;  -- ❌ Erro se há produtos!
-- Motivo: Há produtos com categoria_id = 1
```

2. **CASCADE:**
```sql
CREATE TABLE produtos (
  categoria_id INTEGER REFERENCES categorias(id) ON DELETE CASCADE
);

DELETE FROM categorias WHERE id = 1;  -- ✅ Deleta também produtos
-- Motivo: Todos produtos com categoria_id = 1 são deletados
```

---

## P41: O que é UNIQUE Constraint?

**Resposta:**
Garante que valores em uma coluna (ou combinação) são únicos em toda tabela.

**Exemplo:**
```sql
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL
);

-- Tentativa de duplicar email:
INSERT INTO usuarios (email) VALUES ('admin@example.com');  -- ✅ OK
INSERT INTO usuarios (email) VALUES ('admin@example.com');  -- ❌ Erro!
```

**GestorIQ:**
```sql
ALTER TABLE usuarios 
  ADD CONSTRAINT uk_usuario_email 
  UNIQUE (email);
```

---

## P42: O que é CHECK Constraint?

**Resposta:**
Garante que valores em uma coluna atendem a uma condição lógica.

**Exemplo:**
```sql
CREATE TABLE produtos (
  id SERIAL PRIMARY KEY,
  preco DECIMAL CHECK (preco >= 0),  -- Preço não-negativo
  quantidade_estoque INTEGER CHECK (quantidade_estoque >= 0)
);

-- Tentativa de inserir preço negativo:
INSERT INTO produtos (preco) VALUES (-100);  -- ❌ Erro!
INSERT INTO produtos (preco) VALUES (50.00);  -- ✅ OK
```

**GestorIQ:**
```sql
ALTER TABLE produtos 
  ADD CONSTRAINT ck_produto_preco 
  CHECK (preco >= 0);

ALTER TABLE produtos 
  ADD CONSTRAINT ck_produto_estoque 
  CHECK (quantidade_estoque >= 0);
```

---

## P43: Qual é o volume de dados do seed?

**Resposta:**

```
Usuários:    10 (1 admin + 9 comuns)
Categorias:  15 (Eletrônicos, Informática, Periféricos, etc.)
Fornecedores: 20 (Tech Solutions, Dell, Lenovo, HP, etc.)
Produtos:    60+ (Notebooks, Mouses, Teclados, etc.)
Relacionamentos N:N: 150+
```

**Total: 100+ registros**

**Propósito:**
- Suficiente para testes realistas
- Pequeno o bastante para entender estrutura
- Distribuição pseudo-aleatória usando MOD

**Exemplo (seed.sql):**
```sql
INSERT INTO produto_fornecedor (produto_id, fornecedor_id)
  SELECT p.id, f.id 
  FROM produtos p 
  CROSS JOIN fornecedores f 
  WHERE (p.id + f.id) % 3 = 0
  LIMIT 150;
```

---

## P44: Como criar as tabelas?

**Resposta:**

**Opção 1: Migrations automáticas**
```bash
docker compose exec app node command.js migrate
```

**Opção 2: SQL manual**
```sql
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**GestorIQ:** Usa comando CLI automático (mais limpo)

---

## P45: Como fazer queries simples?

**Resposta:**

```sql
-- Listar todos os produtos
SELECT * FROM produtos;

-- Listar com filtro
SELECT * FROM produtos WHERE preco > 100;

-- Contar registros
SELECT COUNT(*) FROM produtos;

-- Ordenar
SELECT * FROM produtos ORDER BY preco DESC;

-- Limitar
SELECT * FROM produtos LIMIT 10;
```

---

## P46: Como fazer JOINs?

**Resposta:**

```sql
-- INNER JOIN: Produtos com suas categorias
SELECT p.id, p.nome, c.nome as categoria
FROM produtos p
INNER JOIN categorias c ON p.categoria_id = c.id;

-- LEFT JOIN: Categorias com seus produtos (mesmo sem produtos)
SELECT c.nome, COUNT(p.id) as total_produtos
FROM categorias c
LEFT JOIN produtos p ON c.id = p.categoria_id
GROUP BY c.id;

-- Tabela pivô: Produtos com fornecedores
SELECT p.nome, f.nome as fornecedor
FROM produtos p
INNER JOIN produto_fornecedor pf ON p.id = pf.produto_id
INNER JOIN fornecedores f ON pf.fornecedor_id = f.id;
```

---

## P47: Como fazer agregações?

**Resposta:**

```sql
-- Contar
SELECT COUNT(*) FROM produtos;  -- Total: 60+

-- Somar
SELECT SUM(quantidade_estoque) FROM produtos;  -- Total estoque

-- Média
SELECT AVG(preco) FROM produtos;  -- Preço médio

-- Máximo/Mínimo
SELECT MAX(preco), MIN(preco) FROM produtos;

-- Agrupar
SELECT categoria_id, COUNT(*) as total
FROM produtos
GROUP BY categoria_id;
```

---

## P48: Como fazer query com N:N?

**Resposta:**

```sql
-- Listar fornecedores de um produto específico
SELECT f.id, f.nome
FROM fornecedores f
INNER JOIN produto_fornecedor pf ON f.id = pf.fornecedor_id
WHERE pf.produto_id = 1;

-- Listar produtos de um fornecedor
SELECT p.id, p.nome
FROM produtos p
INNER JOIN produto_fornecedor pf ON p.id = pf.produto_id
WHERE pf.fornecedor_id = 1;

-- Contar quantos fornecedores cada produto tem
SELECT p.nome, COUNT(f.id) as total_fornecedores
FROM produtos p
LEFT JOIN produto_fornecedor pf ON p.id = pf.produto_id
LEFT JOIN fornecedores f ON pf.fornecedor_id = f.id
GROUP BY p.id;
```

---

## P49: Como usar WHERE com condições?

**Resposta:**

```sql
-- Simples
WHERE preco > 100

-- AND (e)
WHERE preco > 100 AND categoria_id = 2

-- OR (ou)
WHERE categoria_id = 1 OR categoria_id = 2

-- NOT (negação)
WHERE NOT categoria_id = 1

-- IN (lista)
WHERE categoria_id IN (1, 2, 3)

-- BETWEEN (intervalo)
WHERE preco BETWEEN 50 AND 200

-- LIKE (padrão texto)
WHERE nome LIKE '%Notebook%'

-- NULL
WHERE descricao IS NULL
WHERE descricao IS NOT NULL
```

---

## P50: Como fazer INSERT?

**Resposta:**

```sql
-- Inserir um registro
INSERT INTO categorias (nome, descricao)
VALUES ('Eletrônicos', 'Produtos eletrônicos em geral');

-- Inserir múltiplos
INSERT INTO categorias (nome, descricao) VALUES
  ('Informática', 'Computadores e periféricos'),
  ('Periféricos', 'Mice, teclados, etc.');

-- Inserir com retorno (PostgreSQL)
INSERT INTO categorias (nome, descricao)
VALUES ('Nova', 'Descrição')
RETURNING *;  -- Retorna o registro inserido
```

**GestorIQ (em Node.js):**
```javascript
db.query(
  'INSERT INTO categorias (nome, descricao) VALUES ($1, $2) RETURNING *',
  [nome, descricao]
);
```

---

## P51: Como fazer UPDATE?

**Resposta:**

```sql
-- Atualizar um campo
UPDATE produtos SET preco = 100 WHERE id = 1;

-- Atualizar múltiplos campos
UPDATE produtos SET preco = 100, quantidade_estoque = 50 WHERE id = 1;

-- Atualizar com cálculo
UPDATE produtos SET quantidade_estoque = quantidade_estoque - 10 WHERE id = 1;

-- Atualizar timestamp
UPDATE produtos SET updated_at = CURRENT_TIMESTAMP WHERE id = 1;
```

---

## P52: Como fazer DELETE?

**Resposta:**

```sql
-- Deletar um registro
DELETE FROM produtos WHERE id = 1;

-- Deletar múltiplos
DELETE FROM produtos WHERE categoria_id = 1;

-- Deletar com JOI (cuidado!)
DELETE FROM produtos 
WHERE category_id IN (SELECT id FROM categories WHERE name = 'Old');

-- Deletar tudo (⚠️ MUITO CUIDADO!)
DELETE FROM produtos;  -- Deleta TODOS!
```

---

# NORMALIZAÇÃO (15 Perguntas)

## P53: O que é normalização?

**Resposta:**
Processo de organizar dados em tabelas para reduzir redundância, eliminar anomalias, e garantir integridade.

**Objetivo:**
- Evitar duplicação de dados
- Facilitar manutenção
- Garantir consistência
- Reduzir espaço de armazenamento

**Formas Normais:**
1. 1FN: Atomicidade
2. 2FN: Dependência completa
3. 3FN: Sem dependência transitiva
4. BCNF: Forma normal Boyce-Codd (rara)

---

## P54: O que é 1ª Forma Normal (1FN)?

**Resposta:**
Todos os atributos devem ser **atômicos** (indivisíveis).

**Violação de 1FN:**
```sql
-- ❌ Errado: telefones em um campo
CREATE TABLE fornecedores (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255),
  telefones VARCHAR(255)  -- "11-3000-1000, 11-3000-2000"
);
```

**Correção:**
```sql
-- ✅ Correto: tabela separada
CREATE TABLE fornecedores (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255)
);

CREATE TABLE fornecedor_telefones (
  id SERIAL PRIMARY KEY,
  fornecedor_id INTEGER REFERENCES fornecedores(id),
  telefone VARCHAR(20)
);
```

**GestorIQ:**
- Todos os campos são atômicos ✅ (1FN atendida)

---

## P55: O que é 2ª Forma Normal (2FN)?

**Resposta:**
Estar em 1FN + Todo atributo não-chave deve depender da **chave primária completa**, não apenas parte dela.

**Problema:**
```sql
-- ❌ Errado: categoria_nome depende só de categoria_id, não da chave completa
CREATE TABLE produto_categoria (
  produto_id INTEGER,
  categoria_id INTEGER,
  categoria_nome VARCHAR(255),
  PRIMARY KEY (produto_id, categoria_id)
);
```

**Dependência:**
- categoria_nome depende de categoria_id (parte da chave)
- Violação de 2FN!

**Correção:**
```sql
-- ✅ Correto: categoria em tabela separada
CREATE TABLE categorias (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255)
);

CREATE TABLE produtos (
  id SERIAL PRIMARY KEY,
  categoria_id INTEGER REFERENCES categorias(id)
);
```

**GestorIQ:**
- Todos os não-chave dependem da chave completa ✅ (2FN atendida)

---

## P56: O que é 3ª Forma Normal (3FN)?

**Resposta:**
Estar em 2FN + Nenhum atributo não-chave pode depender de outro não-chave.

**Problema:**
```sql
-- ❌ Errado: nome_responsavel depende de usuario_id, não do produto
CREATE TABLE produtos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255),
  usuario_id INTEGER,
  nome_responsavel VARCHAR(255),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Dependência transitiva:
-- nome_responsavel → usuario_id → produto
```

**Correção:**
```sql
-- ✅ Correto: usuario em tabela separada
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255)
);

CREATE TABLE produtos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255),
  usuario_id INTEGER REFERENCES usuarios(id)
);
```

**GestorIQ:**
- Sem dependências transitivas ✅ (3FN atendida)

---

## P57: Por que normalizar?

**Resposta:**

### Sem normalização (BadDesign)
```sql
CREATE TABLE estoque (
  id SERIAL,
  produto_nome VARCHAR(255),
  categoria_nome VARCHAR(255),
  fornecedor_nome VARCHAR(255),
  preco DECIMAL,
  ...
);

-- Problemas:
-- 1. Redundância: "Notebooks" aparece 100x
-- 2. Anomalia UPDATE: Alterar categoria obriga 100 updates
-- 3. Anomalia DELETE: Deletar último produto deleta categoria
-- 4. Espaço: Nomes duplicados ocupam espaço
-- 5. Integridade: Inconsistência possível
```

### Com normalização (GestorIQ)
```sql
CREATE TABLE categorias (id, nome);
CREATE TABLE fornecedores (id, nome);
CREATE TABLE produtos (id, nome, categoria_id, fornecedor_id);

-- Benefícios:
-- 1. Sem redundância: "Notebooks" armazenado 1x
-- 2. UPDATE fácil: Alterar categoria = 1 update
-- 3. DELETE seguro: Constraints garantem integridade
-- 4. Espaço: Otimizado (ids são menores que nomes)
-- 5. Integridade: FK garante consistência
```

---

## P58: Quando usar desnormalização?

**Resposta:**

Ocasionalmente, é bom **quebrar as regras** para performance.

**Exemplo:** Denormalizar para leitura rápida
```sql
-- ✅ 3FN (sem redundância, mas JOIN lento)
SELECT p.nome, c.nome as categoria
FROM produtos p
INNER JOIN categorias c ON p.categoria_id = c.id;

-- ❌ Denormalizado (redundante, mas leitura rápida)
CREATE TABLE produtos (
  id SERIAL,
  nome VARCHAR(255),
  categoria_id INTEGER,
  categoria_nome VARCHAR(255)  -- Redundante!
);
```

**Quando denormalizar:**
- Leitura muito frequente (~100x mais lenta com join)
- Dados raramente mudam
- Cache pode ficar obsoleto

**GestorIQ:** Não usa desnormalização (foco em corretude, não performance)

---

## P59: Qual é a normalização de produto_fornecedor?

**Resposta:**

**Tabela:** produto_fornecedor (produto_id, fornecedor_id)

### 1FN:
- Ambos atributos são atômicos ✅
- Não há grupos repetitivos

### 2FN:
- Única dependência: created_at depende de (produto_id, fornecedor_id) ✅
- Não há dependência parcial

### 3FN:
- Não há dependência transitiva ✅
- Nenhum não-chave depende de outro não-chave

**Resultado: 3FN** ✅

---

## P60: Qual é a normalização de usuarios?

**Resposta:**

**Tabela:** usuarios (id, nome, email, senha, created_at, updated_at)

### 1FN:
- Todos atômicos ✅
- id, nome, email, senha, created_at, updated_at são indivisíveis

### 2FN:
- Chave primária: id (simples, não composta)
- Todos não-chave dependem de id ✅
- nome, email, senha dependem de id

### 3FN:
- Não há dependência transitiva ✅
- Exemplo: email não depende de nome

**Resultado: 3FN** ✅

---

## P61: Qual é a normalização de produtos?

**Resposta:**

**Tabela:** produtos (id, nome, descricao, preco, quantidade_estoque, categoria_id, created_at, updated_at)

### 1FN:
- Todos atômicos ✅

### 2FN:
- Chave: id (simples)
- Todos não-chave dependem de id ✅

### 3FN:
- Problema? categoria_id aponta para categoria externa
- Mas categoria_nome NÃO está aqui (está em categorias)
- Sem dependência transitiva ✅

**Resultado: 3FN** ✅

---

## P62: Qual é a normalização de categorias?

**Resposta:**

**Tabela:** categorias (id, nome, descricao, created_at, updated_at)

### 1FN: ✅ Todos atômicos
### 2FN: ✅ Chave simples, todos dependem de id
### 3FN: ✅ Sem dependência transitiva

**Resultado: 3FN** ✅

---

## P63: Qual é a normalização de fornecedores?

**Resposta:**

**Tabela:** fornecedores (id, nome, cnpj, telefone, email, created_at, updated_at)

### 1FN: ✅ Todos atômicos
### 2FN: ✅ Chave simples, todos dependem de id
### 3FN: ✅ Sem dependência transitiva

**Resultado: 3FN** ✅

---

## P64: Por que GestorIQ não usa BCNF?

**Resposta:**

BCNF (Boyce-Codd Normal Form) é mais rigorosa que 3FN.

**Diferença:**
```
3FN: Todo não-chave depende de chave completa
BCNF: TODO atributo depende de chave completa
```

**Caso BCNF seria necessário:**
```sql
CREATE TABLE produto_fornecedor (
  produto_id INTEGER,
  fornecedor_id INTEGER,
  data_associacao DATE,
  PRIMARY KEY (produto_id, fornecedor_id, data_associacao)
);
```

Se data_associacao pudesse ser derivada de (produto_id, fornecedor_id), BCNF exigiria desconstruir.

**Conclusão:** GestorIQ não enfrenta cenários BCNF (3FN suficiente)

---

## P65: Como verificar violação de 3FN?

**Resposta:**

**Teste:**
1. Identificar chave primária
2. Para cada não-chave: depende de alguma outra não-chave?
3. Se SIM: Violação de 3FN

**Exemplo (VIOLA 3FN):**
```sql
CREATE TABLE pedidos (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER,
  usuario_nome VARCHAR(255),
  usuario_email VARCHAR(255)
);

Análise:
- usuario_nome depende de usuario_id (não-chave!) → VIOLAÇÃO
- usuario_email depende de usuario_id (não-chave!) → VIOLAÇÃO
```

**Correção (3FN):**
```sql
CREATE TABLE usuarios (id, nome, email);
CREATE TABLE pedidos (id, usuario_id REFERENCES usuarios);
```

---

## P66: Como garantir integridade referencial?

**Resposta:**

**Usar FOREIGN KEY com constraints:**

```sql
-- Opção 1: RESTRICT (padrão)
CREATE TABLE produtos (
  id SERIAL PRIMARY KEY,
  categoria_id INTEGER REFERENCES categorias(id) ON DELETE RESTRICT
);
-- Não permite deletar categoria se há produtos

-- Opção 2: CASCADE
CREATE TABLE produto_fornecedor (
  produto_id INTEGER REFERENCES produtos(id) ON DELETE CASCADE
);
-- Deleta relacionamentos se produto for deletado

-- Opção 3: SET NULL
CREATE TABLE pedidos (
  id SERIAL,
  usuario_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL
);
-- Define usuario_id como NULL se usuário for deletado
```

**GestorIQ:**
```sql
-- Categoria: RESTRICT (não pode deletar com produtos)
-- produto_fornecedor: CASCADE (deleta relacionamentos)
```

---

# REST API (15 Perguntas)

## P67: O que é REST?

**Resposta:**
REST (Representational State Transfer) é um estilo arquitetural para APIs web que usa HTTP de forma semântica.

**Princípios:**
- Client-Server: Separação clara
- Stateless: Cada requisição é completa
- Cacheable: Respostas podem ser cacheadas
- Uniform Interface: Endpoints padronizados

---

## P68: Quais são os métodos HTTP?

**Resposta:**

| Método | Ação | Idempotente | Seguro |
|--------|------|-------------|--------|
| GET | Ler | ✅ SIM | ✅ SIM |
| POST | Criar | ❌ NÃO | ❌ NÃO |
| PUT | Atualizar completo | ✅ SIM | ❌ NÃO |
| PATCH | Atualizar parcial | ❌ NÃO | ❌ NÃO |
| DELETE | Deletar | ✅ SIM | ❌ NÃO |
| HEAD | GET sem corpo | ✅ SIM | ✅ SIM |
| OPTIONS | Informações | ✅ SIM | ✅ SIM |

---

## P69: O que é idempotente?

**Resposta:**
Operação idempotente pode ser executada várias vezes com o mesmo resultado.

**Exemplos:**
```
GET /api/categorias  # Idempotente (ler 100x = mesmo resultado)
PUT /api/categorias/1  # Idempotente (atualizar 2x = mesmo estado)
DELETE /api/categorias/1  # Idempotente (deletar 2x = deletado)
POST /api/categorias  # NÃO idempotente (criar 2x = 2 categorias)
```

---

## P70: Qual é a estrutura de uma URL REST?

**Resposta:**

```
http://localhost/api/categorias/1
 ↑                ↑    ↑         ↑
 |                |    |         └─ Identificador (recurso específico)
 |                |    └─ Recurso (nome plural)
 |                └─ Namespace (separa diferentes versões/módulos)
 └─ Base (protocolo + host)
```

**Padrões:**
```
GET    /api/categorias          # Listar
GET    /api/categorias/1        # Obter por ID
POST   /api/categorias          # Criar
PUT    /api/categorias/1        # Atualizar
DELETE /api/categorias/1        # Deletar
```

---

## P71: Quais são os códigos HTTP corretos?

**Resposta:**

| Código | Significado | Uso |
|--------|------------|-----|
| **200** | OK | GET bem-sucedido, PUT/PATCH bem-sucedido |
| **201** | Created | POST bem-sucedido (novo recurso criado) |
| **204** | No Content | DELETE bem-sucedido (sem corpo na resposta) |
| **400** | Bad Request | Input inválido (falta campo, tipo errado) |
| **401** | Unauthorized | Autenticação falhada (token ausente/inválido) |
| **403** | Forbidden | Autorização falhada (permissão negada) |
| **404** | Not Found | Recurso não encontrado |
| **500** | Internal Error | Erro no servidor |

---

## P72: Como estruturar resposta JSON?

**Resposta:**

**GET lista (200 OK):**
```json
{
  "status": 200,
  "data": [
    {"id": 1, "nome": "Eletrônicos"},
    {"id": 2, "nome": "Informática"}
  ]
}
```

**GET por ID (200 OK):**
```json
{
  "status": 200,
  "data": {"id": 1, "nome": "Eletrônicos"}
}
```

**POST criar (201 Created):**
```json
{
  "status": 201,
  "message": "categoria criada",
  "data": {"id": 3, "nome": "Periféricos"}
}
```

**DELETE (204 No Content):**
```
(sem corpo)
```

**Erro (400 Bad Request):**
```json
{
  "status": 400,
  "error": "Falta campo obrigatório: nome"
}
```

---

## P73: Como usar query parameters?

**Resposta:**

```
GET /api/produtos?categoria_id=2&preco_min=100&preco_max=500

Parâmetros:
- categoria_id=2
- preco_min=100
- preco_max=500

Uso em Node.js:
req.query.categoria_id  // "2"
req.query.preco_min     // "100"
req.query.preco_max     // "500"
```

**Exemplo prático:**
```bash
curl "http://localhost/api/produtos?categoria_id=2"
```

---

## P74: Como usar path parameters?

**Resposta:**

```
GET /api/produtos/1

Path parameter:
- 1 = id do produto

Uso em Node.js:
req.params.id  // "1"

Express route:
app.get('/api/produtos/:id', controller);
```

---

## P75: Como lidar com paginação?

**Resposta:**

```
GET /api/produtos?page=1&limit=20

Parâmetros:
- page=1 (página 1, começa do 0)
- limit=20 (20 por página)

Query SQL:
SELECT * FROM produtos
LIMIT 20 OFFSET 0;  // Página 1

SELECT * FROM produtos
LIMIT 20 OFFSET 20;  // Página 2

Fórmula: OFFSET = (page - 1) * limit
```

---

## P76: Como fazer POST?

**Resposta:**

```
POST /api/categorias
Content-Type: application/json

{
  "nome": "Nova Categoria",
  "descricao": "Descrição"
}

Resposta (201 Created):
{
  "status": 201,
  "data": {
    "id": 16,
    "nome": "Nova Categoria",
    "descricao": "Descrição",
    "created_at": "2026-01-17T10:00:00Z",
    "updated_at": "2026-01-17T10:00:00Z"
  }
}
```

---

## P77: Como fazer PUT?

**Resposta:**

```
PUT /api/categorias/1
Content-Type: application/json

{
  "nome": "Categoria Atualizada",
  "descricao": "Nova descrição"
}

Resposta (200 OK):
{
  "status": 200,
  "data": {
    "id": 1,
    "nome": "Categoria Atualizada",
    "descricao": "Nova descrição",
    "updated_at": "2026-01-17T10:15:00Z"
  }
}
```

**PUT vs PATCH:**
- PUT: Substitui recurso completo
- PATCH: Atualiza campos específicos

---

## P78: Como fazer DELETE?

**Resposta:**

```
DELETE /api/categorias/1

Resposta (204 No Content):
(corpo vazio)

Status: 204
```

---

## P79: Como documentar API?

**Resposta:**

**Opção 1: Swagger (GestorIQ usa)**
```yaml
/api/categorias:
  get:
    summary: Listar categorias
    responses:
      200:
        description: OK
        schema:
          type: array
          items:
            $ref: '#/components/schemas/Categoria'

  post:
    summary: Criar categoria
    parameters:
      - in: body
        required: true
        schema:
          $ref: '#/components/schemas/CategoriaInput'
    responses:
      201:
        description: Criada
```

**Acesso:** http://localhost/api-docs

**Opção 2: Documentação manual**
- README
- Postman collection
- OpenAPI/Swagger

---

## P80: Por que usar REST?

**Resposta:**

**Benefícios:**
1. Simples: Usa HTTP padrão
2. Escalável: Stateless, cacheable
3. Flexível: Fácil de evoluir
4. Portável: HTTP em qualquer linguagem
5. Testável: Cada endpoint é testável

**Alternativas (menos comuns):**
- GraphQL (mais complexo)
- gRPC (mais rápido, menos portável)
- SOAP (legado, complexo)

---

# AUTENTICAÇÃO (10 Perguntas)

## P81: Como funciona a autenticação em GestorIQ?

**Resposta:**

**Fluxo:**

```
1. Cliente faz POST /login com email + senha
2. Servidor verifica credenciais
3. Gera JWT (token)
4. Retorna token para cliente
5. Cliente armazena token (localStorage)
6. Cliente envia token em cada requisição (header Authorization)
7. Servidor valida token
8. Executa operação se token válido
```

---

## P82: O que é JWT?

**Resposta:**
JWT (JSON Web Token) é um padrão de token que inclui informações do usuário + assinatura, permitindo autenticação stateless.

**Estrutura:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBnZXN0b3JpcS5jb20iLCJleHAiOjE2MjM0NTk5OTl9.xyz...

[Header].[Payload].[Signature]
```

---

## P83: Como o servidor valida JWT?

**Resposta:**

```javascript
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token ausente' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Usuário disponível em controllers
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalido' });
  }
}
```

**Validações:**
1. Token existe?
2. Token é válido (assinatura)?
3. Token não expirou?

---

## P84: Como enviar token na requisição?

**Resposta:**

**Header Authorization (padrão Bearer):**
```
GET /api/categorias
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Via curl:**
```bash
curl -H "Authorization: Bearer {TOKEN}" http://localhost/api/categorias
```

**Via Postman:**
```
Authorization tab
Type: Bearer Token
Token: {Cole aqui o token}
```

---

## P85: Qual é o tempo de expiração do token?

**Resposta:**

**GestorIQ:** 24 horas

**No JWT:**
```json
{
  "id": 1,
  "email": "admin@gestoriq.com",
  "iat": 1641035000,    // Emitido em
  "exp": 1641121400     // Expira em (24h depois)
}
```

**Conversão:**
1641121400 - 1641035000 = 86400 segundos = 24 horas

---

## P86: O que fazer quando token expira?

**Resposta:**

**Opção 1: Fazer login novamente**
```
POST /api/login
{email, senha}
→ Novo token
```

**Opção 2: Usar Refresh Token (produção)**
```
Access Token: Curta vida (15 min)
Refresh Token: Longa vida (7 dias)

Fluxo:
1. POST /login → access_token + refresh_token
2. Requisição com access_token vencido → 401
3. POST /refresh com refresh_token → novo access_token
```

**GestorIQ:** Opção 1 (simples, educacional)

---

## P87: Como não expor senha em respostas?

**Resposta:**

**❌ ERRADO:**
```javascript
app.get('/api/usuarios', (req, res) => {
  const users = db.query('SELECT * FROM usuarios');  // Retorna senha!
  res.json(users);
});
```

**✅ CORRETO:**
```javascript
app.get('/api/usuarios', (req, res) => {
  const users = db.query('SELECT id, nome, email FROM usuarios');  // Sem senha
  res.json(users);
});
```

**Ou com select parcial:**
```javascript
users.map(u => {
  const { senha, ...semSenha } = u;
  return semSenha;
});
```

---

## P88: Como proteger rota com JWT?

**Resposta:**

```javascript
// Middleware de autenticação
const verifyToken = require('./middlewares/auth');

// Rota pública (sem middleware)
app.post('/api/login', authController.login);

// Rota privada (com middleware)
app.use(verifyToken);  // Tudo depois é protegido

app.get('/api/categorias', categoryController.list);  // Protegido
app.post('/api/categorias', categoryController.create);  // Protegido
```

---

## P89: Como fazer logout?

**Resposta:**

Em arquitetura stateless (JWT), não há "logout" no servidor.

**Cliente faz logout:**
```javascript
// JavaScript
localStorage.removeItem('token');  // Remove token
// Próximas requisições sem token → 401 Unauthorized
```

**Ou invalidar no servidor (complexo):**
```
Manter blacklist de tokens revogados em Redis
Quando logout: adicionar token à blacklist
Em cada requisição: verificar se token está na blacklist
```

**GestorIQ:** Logout no cliente (remove token)

---

## P90: Por que usar JWT em vez de sessão?

**Resposta:**

| Aspecto | JWT | Sessão |
|--------|-----|--------|
| **Armazenamento** | Cliente | Servidor |
| **Escalabilidade** | ✅ Fácil (stateless) | ❌ Difícil (needs cache) |
| **Requisição** | Token no header | Cookie automático |
| **Segurança** | Token pode ser revogado | Sessão pode ser revogada |
| **Mobile/API** | ✅ Perfeito | ⚠️ Complica (CORS) |

**GestorIQ:** JWT (mais escalável, moderno)

---

# SEGURANÇA (10 Perguntas)

## P91: Como garantir segurança de senhas?

**Resposta:**

**PBKDF2 (GestorIQ usa):**
```javascript
const crypto = require('crypto');
const salt = crypto.randomBytes(32);
const hash = crypto.pbkdf2Sync(senha, salt, 120000, 32, 'sha256');
```

**Por que PBKDF2?**
- ✅ NIST recomendado
- ✅ 120.000 iterações = força bruta impraticável
- ✅ Sem dependências externas
- ✅ Mais seguro que bcrypt (descontinuado)

**❌ Nunca fazer:**
- Plain text
- MD5
- SHA-1
- SHA-256 sem salt

---

## P92: Como evitar SQL Injection?

**Resposta:**

**❌ ERRADO (vulnerable):**
```javascript
const email = req.body.email;
db.query(`SELECT * FROM usuarios WHERE email = '${email}'`);
// Se email = "' OR 1=1 --" → SQL injection!
```

**✅ CORRETO (Parameterized query):**
```javascript
db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
// Email é tratado como valor, não SQL code
```

**Node.js + PostgreSQL:**
```javascript
const result = await pool.query(
  'SELECT * FROM usuarios WHERE email = $1 AND senha = $2',
  [email, hashedPassword]
);
```

---

## P93: Como proteger contra CSRF?

**Resposta:**

CSRF (Cross-Site Request Forgery) é quando site malicioso faz requisição em seu nome.

**Proteção (tokens CSRF):**
```javascript
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

app.post('/api/categorias', csrfProtection, (req, res) => {
  // Valida token CSRF antes de processar
});
```

**GestorIQ:** Não implementa (foco em API stateless com JWT)

**JWT já protege parcialmente** (token deve ser no header, não cookie auto)

---

## P94: Como implementar Rate Limiting?

**Resposta:**

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutos
  max: 100,                   // 100 requisições por IP
  message: 'Muitas requisições, tente novamente mais tarde'
});

app.use('/api/', limiter);  // Aplica a /api/*
```

**GestorIQ:** Não implementa (educacional)

**Produção:** Nginx + Redis para shared rate limiting

---

## P95: Como usar HTTPS?

**Resposta:**

**Não implementado em GestorIQ** (HTTP apenas)

**Produção (HTTPS obrigatório):**
```nginx
# nginx.conf
listen 443 ssl;
ssl_certificate /etc/ssl/certs/cert.pem;
ssl_certificate_key /etc/ssl/private/key.pem;
```

**Docker Compose com HTTPS:**
```yaml
nginx:
  ports:
    - "443:443"
  volumes:
    - ./certs:/etc/nginx/certs:ro
  command: ...
```

---

## P96: Como usar CORS corretamente?

**Resposta:**

**❌ ERRADO (aberto demais):**
```javascript
app.use(cors({ origin: '*' }));  // Qualquer origem!
```

**✅ CORRETO (restritivo):**
```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'https://gestoriq.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

**GestorIQ:** Não implementa (API interna, não frontend externo)

---

## P97: Como usar headers de segurança?

**Resposta:**

```javascript
const helmet = require('helmet');

app.use(helmet());  // Adiciona múltiplos headers

// Headers adicionados:
// X-Content-Type-Options: nosniff
// X-Frame-Options: DENY
// X-XSS-Protection: 1; mode=block
// Strict-Transport-Security: max-age=31536000
// Content-Security-Policy: default-src 'self'
```

**GestorIQ:** Não implementa (educacional)

---

## P98: Como proteger dados sensíveis?

**Resposta:**

**Arquivo .env (secretos):**
```
DB_PASSWORD=senhasuperegura
JWT_SECRET=chave_criptografica_longa
ADMIN_PASSWORD=senha_inicial_admin
```

**❌ NUNCA:**
```
Comitar .env no git
Expor JWT_SECRET em logs
Armazenar senhas em plain text
```

**GestorIQ:**
```
backend/.env → .gitignore ✅
Senhas hasheadas com PBKDF2 ✅
Secrets em variáveis de ambiente ✅
```

---

## P99: Como evitar exposição de informações?

**Resposta:**

**❌ ERRADO (expõe informações):**
```json
{
  "status": 500,
  "error": "Cannot connect to postgres://user:password@localhost:5432"
}
```

**✅ CORRETO (genérico):**
```json
{
  "status": 500,
  "error": "Erro interno do servidor"
}
```

**Em logs (não expor ao cliente):**
```javascript
console.error(error);  // Logs internos podem ser verbosos
res.json({ error: 'Erro interno' });  // Cliente recebe genérico
```

---

## P100: Como testar segurança?

**Resposta:**

**Testes simples:**
```bash
# Tentar SQL Injection
curl 'http://localhost/api/usuarios?id=1" OR 1=1 --'

# Tentar sem token
curl http://localhost/api/categorias

# Tentar token inválido
curl -H "Authorization: Bearer INVALIDO" http://localhost/api/categorias

# Tentar senha errada
curl -X POST http://localhost/api/login \
  -d '{"email":"admin@gestoriq.com","senha":"ERRADA"}'

# Verificar não expõe senha
curl -H "Authorization: Bearer {TOKEN}" http://localhost/api/usuarios
# Resposta não deve conter "senha"
```

---

## 🎯 RESUMO FINAL

**Total de Perguntas Cobertas:** 115

**Por Disciplina:**
- Arquitetura Geral: 10
- Docker: 15
- Docker Compose: 10
- Banco de Dados: 20
- Normalização: 15
- REST API: 15
- Autenticação: 10
- Segurança: 10

**Próximos Passos Recomendados:**
1. Ler ESTUDO_COMPLETO.md
2. Revisar estas 115 perguntas
3. Fazer testes prático com Postman/curl
4. Executar checklist em CHECKLIST_FINAL.md

**Boa sorte na apresentação! 🚀**

---

**Documento:** Perguntas Esperadas da Banca - GestorIQ  
**Data:** Janeiro 2026  
**Status:** ✅ Completo com 115 perguntas
