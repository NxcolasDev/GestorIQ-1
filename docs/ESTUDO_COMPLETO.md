# 📚 ESTUDO COMPLETO - GestorIQ

Material de referência para preparação da banca. Consolidação de todos os conceitos técnicos implementados no projeto.

---

## 📋 ÍNDICE GERAL

### Modulo 1: Banco de Dados
- [1. Modelo de Dados](#modulo-1-banco-de-dados)
- [2. Normalização](#normalizacao)
- [3. Integridade Referencial](#integridade-referencial)

### Modulo 2: Infraestrutura
- [4. Docker](#modulo-2-infraestrutura)
- [5. Networking](#networking)
- [6. Persistência](#persistencia)

### Modulo 3: Web Development
- [7. REST API](#modulo-3-web-development)
- [8. Autenticação](#autenticacao)
- [9. Segurança](#seguranca)

---

# MODULO 1: BANCO DE DADOS

## 1. Modelo de Dados

### Entidades e Atributos

| Tabela | Chave Primária | Atributos |
|--------|----------------|-----------|
| **usuarios** | id | id, nome, email (UNIQUE), senha, created_at, updated_at |
| **categorias** | id | id, nome, descricao, created_at, updated_at |
| **fornecedores** | id | id, nome, cnpj, telefone, email, created_at, updated_at |
| **produtos** | id | id, nome, descricao, preco (≥0), quantidade_estoque (≥0), categoria_id (FK), created_at, updated_at |
| **produto_fornecedor** | (produto_id, fornecedor_id) | produto_id (FK), fornecedor_id (FK), created_at |

### Relacionamentos

```
┌───────────────┐         1:N          ┌──────────────┐
│  categorias   │◄─────────────────────│  produtos    │
└───────────────┘                      └──────────────┘
                                               │
                                               │ N:M via tabela pivô
                                               │
                                       ┌───────────────────────┐
                                       │ produto_fornecedor    │
                                       └───────────────────────┘
                                               │
                                               │
                                       ┌──────────────────┐
                                       │  fornecedores    │
                                       └──────────────────┘

┌───────────────┐
│   usuarios    │
└───────────────┘
(Tabela independente - gerencia autenticação)
```

### Volumes de Dados (Seed)

```
- Usuários: 10 (1 admin, 9 usuários comuns)
- Categorias: 15 (Eletrônicos, Informática, Periféricos, etc.)
- Fornecedores: 20 (Tech Solutions, Dell, Lenovo, HP, etc.)
- Produtos: 60+ (Distribuídos entre as 15 categorias)
- Relacionamentos N:N: 150+ (Produto-Fornecedor)
- Total de registros: 100+
```

---

## Normalização

### 1ª Forma Normal (1FN) - Atomicidade

**Regra:** Todos os atributos devem conter valores atômicos (indivisíveis).

**Verificação no GestorIQ:**

| Tabela | Análise | Status |
|--------|---------|--------|
| usuarios | id, nome, email, senha - todos atômicos ✅ | 1FN ✅ |
| categorias | id, nome, descricao - todos atômicos ✅ | 1FN ✅ |
| fornecedores | id, nome, cnpj, telefone, email - todos atômicos ✅ | 1FN ✅ |
| produtos | id, nome, preco, categoria_id - todos atômicos ✅ | 1FN ✅ |
| produto_fornecedor | produto_id, fornecedor_id - todos atômicos ✅ | 1FN ✅ |

❌ **O QUE NÃO FAZER:**
```sql
-- Errado: Nome do fornecedor dentro de produto
CREATE TABLE produtos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255),
  fornecedor_nome VARCHAR(255)  -- ❌ Não-atômico!
);
```

✅ **CORRETO (No GestorIQ):**
```sql
CREATE TABLE produtos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255),
  categoria_id INTEGER REFERENCES categorias(id)
);

CREATE TABLE fornecedores (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255)
);

CREATE TABLE produto_fornecedor (
  produto_id INTEGER REFERENCES produtos(id),
  fornecedor_id INTEGER REFERENCES fornecedores(id)
);
```

---

### 2ª Forma Normal (2FN) - Dependência Completa

**Regra:** Todo atributo não-chave deve depender da **chave primária completa**, não apenas parte dela.

**Verificação no GestorIQ:**

#### Tabela: usuarios

```
Chave primária: id (simples)
Atributos não-chave: nome, email, senha, created_at, updated_at

Dependência:
- nome DEPENDE DE id ✅
- email DEPENDE DE id ✅
- senha DEPENDE DE id ✅

Resultado: 2FN ✅
```

#### Tabela: produto_fornecedor

```
Chave primária: (produto_id, fornecedor_id) - COMPOSTA
Atributos não-chave: created_at

Dependência:
- created_at DEPENDE DE (produto_id, fornecedor_id) ✅

Resultado: 2FN ✅
```

❌ **O QUE NÃO FAZER:**
```sql
-- Errado: categoria_nome depende só de categoria_id, não de (produto_id, categoria_id)
CREATE TABLE produto_categoria (
  produto_id INTEGER,
  categoria_id INTEGER,
  categoria_nome VARCHAR(255)  -- ❌ Depende só de categoria_id!
);
```

---

### 3ª Forma Normal (3FN) - Dependência Transitiva

**Regra:** Nenhum atributo não-chave pode depender de outro atributo não-chave.

**Verificação no GestorIQ:**

#### Tabela: produtos

```
Chave primária: id
Atributos não-chave: nome, descricao, preco, quantidade_estoque, categoria_id

Dependências:
- nome depende de id (OK)
- descricao depende de id (OK)
- preco depende de id (OK)
- quantidade_estoque depende de id (OK)
- categoria_id depende de id (OK)

Não há atributo não-chave que dependa de outro não-chave ✅

Resultado: 3FN ✅
```

❌ **O QUE NÃO FAZER:**
```sql
-- Errado: categoria_descricao depende de categoria_nome (não-chave!)
CREATE TABLE produtos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255),
  categoria_id INTEGER,
  categoria_nome VARCHAR(255),
  categoria_descricao VARCHAR(255)  -- ❌ Transitivo: categoria_descricao → categoria_nome → categoria_id
);
```

✅ **CORRETO (No GestorIQ):**
- Categoria é tabela separada
- Produto referencia categoria via FK
- Todos os dados de categoria ficam em uma tabela

---

## Integridade Referencial

### Constraints Implementadas

```sql
-- FK com Cascade Delete
ALTER TABLE produtos 
  ADD CONSTRAINT fk_produto_categoria 
  FOREIGN KEY (categoria_id) 
  REFERENCES categorias(id) 
  ON DELETE RESTRICT;  -- Impede deletar categoria com produtos

-- FK com Cascade Delete para tabela pivô
ALTER TABLE produto_fornecedor 
  ADD CONSTRAINT fk_prod_fornecedor 
  FOREIGN KEY (produto_id) 
  REFERENCES produtos(id) 
  ON DELETE CASCADE;  -- Deleta relacionamentos quando produto é deletado

-- UNIQUE Constraint
ALTER TABLE usuarios 
  ADD CONSTRAINT uk_usuario_email 
  UNIQUE (email);  -- Impede emails duplicados

-- CHECK Constraint
ALTER TABLE produtos 
  ADD CONSTRAINT ck_produto_preco 
  CHECK (preco >= 0);  -- Preço não-negativo

ALTER TABLE produtos 
  ADD CONSTRAINT ck_produto_estoque 
  CHECK (quantidade_estoque >= 0);  -- Estoque não-negativo
```

---

# MODULO 2: INFRAESTRUTURA

## 2. Docker

### O que é Docker?

**Definição:** Docker é um sistema de containerização que permite empacotar uma aplicação com todas suas dependências (código, runtime, bibliotecas) em uma imagem, garantindo que funciona igual em qualquer máquina.

### Container vs Máquina Virtual

| Aspecto | Container | VM |
|---------|-----------|-----|
| **Size** | ~100MB | ~2GB |
| **Startup** | ~1s | ~30s |
| **Overhead** | Mínimo (kernel compartilhado) | Alto (SO completo) |
| **Isolamento** | Processo-level | Completo |
| **Performance** | ~100% do host | ~80% do host |

### Dockerfile do GestorIQ

```dockerfile
# Stage 1: Build (compilar código)
FROM node:24-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Stage 2: Runtime (apenas o necessário)
FROM node:24-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY backend/src ./src
COPY backend/command.js ./
USER node
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => r.statusCode === 200 ? process.exit(0) : process.exit(1))"
CMD ["node", "src/server.js"]
```

**Pontos-chave:**

1. **Multi-stage build:**
   - Reduz imagem final (remove ferramentas de build)
   - Menor footprint
   - Mais rápido para download

2. **Alpine Linux:**
   - Base mínima (~5MB)
   - Vs Ubuntu (~77MB)

3. **Non-root user:**
   - `USER node` (não roda como root)
   - Segurança: limita danos se app for comprometida

4. **Health Check:**
   - Docker monitora saúde do container
   - Auto-restart se falhar

---

## Networking

### Redes Docker

```
docker-compose.yml cria 2 redes:

┌─────────────────────────────────────────┐
│          HOST (Windows/Mac/Linux)       │
│  ┌──────────────────────────────────┐   │
│  │   Rede: web-network              │   │
│  │  (Bridge - Exposta)              │   │
│  │                                  │   │
│  │   ┌──────────────────────────┐   │   │
│  │   │ nginx:80                 │   │   │  Acessível do host
│  │   │ (Port 80 mapeada)        │   │   │
│  │   └──────────────┬───────────┘   │   │
│  └────────────────────────────────────┘   │
│         Parede de isolamento               │
│  ┌──────────────────────────────────┐   │
│  │   Rede: app-network              │   │
│  │   (Bridge - Interna)             │   │
│  │                                  │   │
│  │   ┌──────────────┐               │   │
│  │   │ app:3000     │  ✅ Isolado  │   │
│  │   └──────────────┘               │   │
│  │                                  │   │
│  │   ┌──────────────┐               │   │
│  │   │ postgres:5432│  ✅ Isolado  │   │
│  │   └──────────────┘               │   │
│  │                                  │   │
│  └──────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

### docker-compose.yml Explicado

```yaml
version: '3.9'

services:
  # Serviço 1: Nginx (proxy reverso)
  nginx:
    image: nginx:1.27-alpine
    ports:
      - "80:80"  # Expõe porta 80 para host
    networks:
      - web-network  # Conecta à rede pública
    depends_on:
      - app  # Aguarda 'app' iniciar

  # Serviço 2: App Node.js
  app:
    build: .  # Compila Dockerfile
    expose:
      - 3000  # Expõe 3000 DENTRO da rede, não para host
    networks:
      - web-network  # Comunica com nginx
      - app-network  # Comunica com postgres
    environment:
      - DB_HOST=postgres  # Nome do serviço postgres
      - DB_NAME=gestoriq
    depends_on:
      postgres:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 3s
      retries: 3

  # Serviço 3: PostgreSQL
  postgres:
    image: postgres:17-alpine
    environment:
      - POSTGRES_DB=gestoriq
      - POSTGRES_PASSWORD=postgres_password  # ⚠️ Usar .env!
    volumes:
      - postgres_data:/var/lib/postgresql/data  # Persistência
    networks:
      - app-network  # Interna, não expõe porta
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

networks:
  web-network:
    driver: bridge  # Isolada, mas app-postgres conecta aqui
  app-network:
    driver: bridge  # Isolada, apenas app-postgres

volumes:
  postgres_data:  # Named volume para dados
    driver: local
```

### Fluxo de Requisição

```
1. Cliente (Postman)
   ↓ HTTP GET http://localhost/api/categorias
   ↓ Porta 80
   
2. Nginx (Container)
   ↓ Recebe requisição na porta 80
   ↓ Consulta configuração (upstream app:3000)
   ↓ Roteia para app:3000
   
3. App Node.js (Container)
   ↓ Recebe requisição
   ↓ Valida JWT middleware
   ↓ Executa controller
   ↓ Prepara query SQL
   
4. PostgreSQL (Container)
   ↓ Recebe query
   ↓ Executa e retorna dados
   
5. Resposta volta
   ← PostgreSQL → App → Nginx → Cliente
```

---

## Persistência

### Named Volumes

```yaml
volumes:
  postgres_data:  # Nome do volume
    driver: local
```

**O que é um Named Volume?**
- Espaço de armazenamento gerenciado pelo Docker
- Localizado fora do container
- Persiste mesmo se container é deletado

**Localização:**
```bash
# Windows
C:\Users\{username}\AppData\Local\Docker\volumes\gestoriq_postgres_data\_data

# macOS
/var/lib/docker/volumes/gestoriq_postgres_data/_data

# Linux
/var/lib/docker/volumes/gestoriq_postgres_data/_data
```

### Ciclo de Vida de Dados

```
docker compose up
  ↓
postgres container inicia
  ↓
postgresql monta volume postgres_data
  ↓
Dados armazenados em postgres_data
  ↓
docker compose down
  ↓
postgres container para
  ↓
Dados ainda estão em postgres_data (volume não é deletado)
  ↓
docker compose up
  ↓
Dados são restaurados (via volume)
```

### Teste de Persistência

```bash
# 1. Criar categoria
curl -X POST http://localhost/api/categorias \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste Persistencia","descricao":"teste"}'

# 2. Parar tudo SEM deletar volumes
docker compose down

# 3. Reiniciar
docker compose up -d

# 4. Verificar categoria ainda existe
curl http://localhost/api/categorias \
  -H "Authorization: Bearer {TOKEN}"

# Categoria "Teste Persistencia" ainda está lá! ✅
```

---

# MODULO 3: WEB DEVELOPMENT

## 7. REST API

### Princípios REST

| Princípio | Definição | Exemplo no GestorIQ |
|-----------|-----------|----------------------|
| **Client-Server** | App e BD separados | Nginx/App/PostgreSQL |
| **Stateless** | Servidor não armazena contexto | JWT (cliente envia token) |
| **Cacheable** | Respostas podem ser cacheadas | Headers Cache-Control |
| **Uniform Interface** | Endpoints padronizados | /api/categorias, /api/produtos |
| **Layered System** | Camadas: Frontend → Nginx → App → BD | 3 containers |

### Métodos HTTP e Semântica

| Método | Ação | Código | Exemplo |
|--------|------|--------|---------|
| **GET** | Ler (idempotente) | 200 | GET /api/categorias |
| **POST** | Criar | 201 | POST /api/categorias |
| **PUT** | Atualizar completo | 200 | PUT /api/categorias/1 |
| **PATCH** | Atualizar parcial | 200 | PATCH /api/categorias/1 |
| **DELETE** | Deletar | 204 | DELETE /api/categorias/1 |

### Códigos HTTP Corretos

```javascript
// GET lista - 200 OK
GET /api/categorias → 200 OK com array

// GET por ID - 200 OK ou 404
GET /api/categorias/1 → 200 OK com objeto
GET /api/categorias/999 → 404 Not Found

// POST criar - 201 Created
POST /api/categorias → 201 Created com objeto criado

// PUT atualizar - 200 OK
PUT /api/categorias/1 → 200 OK com objeto atualizado

// DELETE - 204 No Content (sem corpo)
DELETE /api/categorias/1 → 204 No Content
```

### Estrutura de Resposta

```json
// ✅ Sucesso (GET lista)
{
  "status": 200,
  "data": [
    {"id": 1, "nome": "Eletrônicos"},
    {"id": 2, "nome": "Informática"}
  ]
}

// ✅ Sucesso (POST criar)
{
  "status": 201,
  "message": "categoria criada",
  "data": {"id": 3, "nome": "Nova Categoria"}
}

// ❌ Erro
{
  "status": 400,
  "error": "Email ja cadastrado."
}

// ❌ Erro de autenticação
{
  "status": 401,
  "error": "Token invalido."
}
```

---

## Autenticação

### JWT (JSON Web Token)

**Fluxo de Autenticação:**

```
1. Cliente envia credenciais
   POST /login
   {
     "email": "admin@gestoriq.com",
     "senha": "senha123"
   }

2. Servidor valida credenciais
   ├─ Hash(senha) == Hash(senha no BD)? ✅ SIM
   └─ Gera JWT

3. Servidor retorna token
   {
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBnZXN0b3JpcS5jb20iLCJleHAiOjE2MjM0NTk5OTl9.xyz..."
   }

4. Cliente armazena token
   localStorage.setItem('token', token)

5. Cliente envia token em cada requisição
   GET /api/categorias
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

6. Servidor valida token
   ├─ Token existe? ✅
   ├─ Assinatura válida? ✅
   ├─ Expirado? ✅ NÃO
   └─ Executa operação

7. Se token inválido
   → 401 Unauthorized
```

### Estrutura JWT

```
JWT = header.payload.signature

Header (decodificado):
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload (decodificado):
{
  "id": 1,
  "email": "admin@gestoriq.com",
  "iat": 1641035000,
  "exp": 1641121400  // Token expira em 24 horas
}

Signature:
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  "JWT_SECRET"  // Chave secreta no servidor
)
```

### Middleware de Autenticação

```javascript
// backend/src/middlewares/auth.js
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token ausente.' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Disponível em controllers
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalido.' });
  }
}

module.exports = verifyToken;
```

### Aplicação do Middleware

```javascript
// backend/src/app.js
const verifyToken = require('./middlewares/auth');

app.post('/api/login', authController.login);  // ❌ SEM proteção

app.use(verifyToken);  // Protege tudo após isso

app.get('/api/categorias', categoryController.list);  // ✅ Protegido
app.post('/api/categorias', categoryController.create);  // ✅ Protegido
// ... todas as rotas após middleware são protegidas
```

---

## Segurança

### 1. Criptografia de Senhas

**Implementação PBKDF2:**

```javascript
const crypto = require('crypto');

function hashPassword(plainPassword) {
  const salt = crypto.randomBytes(32);
  const hash = crypto.pbkdf2Sync(
    plainPassword,
    salt,
    120000,  // NIST mínimo: 100.000
    32,
    'sha256'
  );
  return `${salt.toString('hex')}:${hash.toString('hex')}`;
}

function verifyPassword(plainPassword, storedHash) {
  const [saltHex, hashHex] = storedHash.split(':');
  const salt = Buffer.from(saltHex, 'hex');
  const hash = crypto.pbkdf2Sync(plainPassword, salt, 120000, 32, 'sha256');
  return hash.toString('hex') === hashHex;
}
```

**Por que PBKDF2?**
- ✅ NIST recomendado (SP 800-132)
- ✅ 120.000 iterações = força bruta impraticável
- ✅ Sem dependências externas
- ✅ Mais seguro que bcrypt (descontinuado)

### 2. Validação de Input

```javascript
// ❌ NUNCA fazer isso:
app.post('/api/login', (req, res) => {
  const result = db.query(
    `SELECT * FROM usuarios WHERE email = '${req.body.email}'`  // SQL Injection!
  );
});

// ✅ CORRETO (Parameterized Query):
app.post('/api/login', (req, res) => {
  const result = db.query(
    'SELECT * FROM usuarios WHERE email = $1',  // $1 é placeholder
    [req.body.email]  // Valor injetado com segurança
  );
});
```

### 3. Headers de Segurança

```javascript
// backend/src/app.js
const helmet = require('helmet');

app.use(helmet());  // Adiciona headers de segurança:

// Headers adicionados:
// X-Content-Type-Options: nosniff
// X-Frame-Options: DENY
// X-XSS-Protection: 1; mode=block
// Strict-Transport-Security: max-age=31536000
```

### 4. CORS (Cross-Origin Resource Sharing)

```javascript
const cors = require('cors');

// ✅ CORRETO (Restritivo)
app.use(cors({
  origin: ['http://localhost:3000', 'https://gestoriq.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// ❌ NUNCA fazer:
app.use(cors({ origin: '*' }));  // Abre para qualquer origem!
```

### 5. Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutos
  max: 100,  // 100 requisições por IP
  message: 'Muitas requisições, tente novamente mais tarde'
});

app.use('/api/', limiter);  // Aplica a /api/*
```

### 6. Isolamento de Rede

```
🚫 Client NUNCA pode acessar diretamente:
  - App (porta 3000)
  - PostgreSQL (porta 5432)

✅ Client só acessa:
  - Nginx (porta 80)

Nginx roteia para App
App roteia para PostgreSQL

Vantagens:
1. DDoS na porta 80 não chega ao App
2. SQL Injection no App não expõe BD
3. Vulnerabilidade em App não compromete BD
```

---

## Exemplos Práticos

### Criar Produto

```bash
curl -X POST http://localhost/api/produtos \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Notebook Dell",
    "descricao": "Core i7, 16GB RAM",
    "preco": 3499.90,
    "quantidade_estoque": 5,
    "categoria_id": 2
  }'
```

**Fluxo interno:**

```
1. Express recebe POST /api/produtos
2. Middleware verifyToken
   ├─ Extrai token do header
   ├─ Valida assinatura JWT
   ├─ Verifica expiração
   └─ Continua se válido
3. productController.create()
4. Validações
   ├─ Preco >= 0? ✅
   ├─ Estoque >= 0? ✅
   ├─ Categoria existe? ✅
5. Query parameterizada
   INSERT INTO produtos (nome, descricao, preco, ...)
   VALUES ($1, $2, $3, ...)
6. PostgreSQL executa
7. Retorna 201 Created com produto criado
```

### Adicionar Fornecedor a Produto

```bash
curl -X POST http://localhost/api/produtos/1/fornecedores \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"fornecedor_id": 5}'
```

**SQL executado:**

```sql
INSERT INTO produto_fornecedor (produto_id, fornecedor_id)
VALUES ($1, $2)
ON CONFLICT DO NOTHING;  -- Se já existe, não fazer nada

-- Resultado: Relacionamento N:N criado
```

---

## Perguntas Frequentes da Banca

### "Por que 3 containers?"

**Resposta:**
- **Nginx:** Reverse proxy, único entry point, gerencia requisições
- **App:** Lógica de negócio, isolada da BD
- **PostgreSQL:** Dados, isolado do app

**Benefício:** Se um falha, outros podem continuar. BD não perde dados se app crashear.

### "Por que não usar SQLite?"

**Resposta:**
- SQLite é single-file, não multiuser
- PostgreSQL suporta múltiplas conexões simultâneas
- Em produção, PostgreSQL é padrão

### "Por que JWT?"

**Resposta:**
- Stateless: servidor não armazena sessões
- Escalável: múltiplos servidores sem problema
- Seguro: token é assinado

### "Como garantir segurança?"

**Resposta:**
1. Senhas hasheadas (PBKDF2, 120K iterações)
2. JWT para autenticação
3. Queries parameterizadas (sem SQL injection)
4. Network isolada
5. Non-root user em containers

### "Qual é o fluxo completo?"

**Resposta:** (Ver "Fluxo de Requisição" em Networking)

---

## Resumo Técnico

| Componente | Tecnologia | Justificativa |
|------------|-----------|---------------|
| Linguagem | Node.js 24 | Runtime moderno, V8 otimizado |
| BD | PostgreSQL 17 | Relacional, integridade referencial |
| Web | Express 5 | Framework minimalista, rápido |
| Auth | JWT | Stateless, escalável |
| Criptografia | PBKDF2 | NIST recomendado, seguro |
| Container | Docker | Reprodutibilidade, isolamento |
| Orquestração | Docker Compose | Simples, suficiente para dev |
| Proxy | Nginx | Reverse proxy, performance |

---

**Última atualização:** Janeiro 2026  
**Status:** ✅ Completo e testado
