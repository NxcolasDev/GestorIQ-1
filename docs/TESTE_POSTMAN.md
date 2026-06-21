# Roteiro de Testes Postman - GestorIQ API

## Preparação Inicial

### 1. Verificar se API está rodando

```
GET http://localhost/health
```

**Resposta esperada:**
```json
{"status": "ok"}
```

---

## TESTES POR ENTIDADE

### ⚠️ IMPORTANTE: Todas as requisições (exceto Login) precisam do header:

```
Authorization: Bearer {SEU_TOKEN_JWT}
```

---

## 1️⃣ TESTE DE AUTENTICAÇÃO

### 1.1 Login

```
POST http://localhost/api/login
Content-Type: application/json

{
  "email": "admin@gestoriq.com",
  "senha": "senha123"
}
```

**Resposta esperada:** 200 OK
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBnZXN0b3JpcS5jb20iLCJpYXQiOjE2NDEwMzUwMDB9.xyz..."
}
```

**Ação:**
- [ ] Copiar o token para usar nos próximos testes
- [ ] Cole em `Authorization: Bearer {TOKEN}`

---

### 1.2 Registrar novo usuário

```
POST http://localhost/api/auth/register
Content-Type: application/json

{
  "nome": "Maria Silva",
  "email": "maria@gestoriq.com",
  "senha": "senha456"
}
```

**Resposta esperada:** 201 Created
```json
{
  "id": 2,
  "nome": "Maria Silva",
  "email": "maria@gestoriq.com",
  "created_at": "2026-01-17T10:00:00.000Z",
  "updated_at": "2026-01-17T10:00:00.000Z"
}
```

---

## 2️⃣ TESTES CRUD - CATEGORIAS

### 2.1 Listar categorias

```
GET http://localhost/api/categorias
Authorization: Bearer {TOKEN}
```

**Resposta esperada:** 200 OK
```json
[
  {
    "id": 1,
    "nome": "Eletrônicos",
    "descricao": "Produtos eletrônicos em geral",
    "created_at": "2026-01-17T09:00:00.000Z",
    "updated_at": "2026-01-17T09:00:00.000Z"
  },
  ...
]
```

**Verificação:**
- [ ] Retorna 200 OK
- [ ] Array com 15+ categorias (do seed)
- [ ] Cada categoria tem id, nome, descricao

---

### 2.2 Criar categoria

```
POST http://localhost/api/categorias
Authorization: Bearer {TOKEN}
Content-Type: application/json

{
  "nome": "Testes Categoria",
  "descricao": "Categoria para testes"
}
```

**Resposta esperada:** 201 Created
```json
{
  "id": 16,
  "nome": "Testes Categoria",
  "descricao": "Categoria para testes",
  "created_at": "2026-01-17T10:15:00.000Z",
  "updated_at": "2026-01-17T10:15:00.000Z"
}
```

**Verificação:**
- [ ] Retorna 201 Created
- [ ] ID gerado automaticamente
- [ ] Dados retornados = dados enviados

---

### 2.3 Buscar categoria por ID

```
GET http://localhost/api/categorias/1
Authorization: Bearer {TOKEN}
```

**Resposta esperada:** 200 OK (mesma estrutura acima)

---

### 2.4 Atualizar categoria

```
PUT http://localhost/api/categorias/16
Authorization: Bearer {TOKEN}
Content-Type: application/json

{
  "nome": "Categoria Atualizada",
  "descricao": "Descrição nova e melhorada"
}
```

**Resposta esperada:** 200 OK com dados atualizados

---

### 2.5 Deletar categoria

```
DELETE http://localhost/api/categorias/16
Authorization: Bearer {TOKEN}
```

**Resposta esperada:** 204 No Content (corpo vazio)

---

## 3️⃣ TESTES CRUD - FORNECEDORES

### 3.1 Listar fornecedores

```
GET http://localhost/api/fornecedores
Authorization: Bearer {TOKEN}
```

**Verificação:**
- [ ] Retorna 200 OK
- [ ] Array com 20+ fornecedores (do seed)

---

### 3.2 Criar fornecedor

```
POST http://localhost/api/fornecedores
Authorization: Bearer {TOKEN}
Content-Type: application/json

{
  "nome": "Fornecedor Teste",
  "cnpj": "99.999.999/0001-99",
  "telefone": "(11) 99999-9999",
  "email": "contato@fornecedorteste.com.br"
}
```

**Verificação:**
- [ ] Retorna 201 Created
- [ ] Todos os campos retornados

---

### 3.3 Atualizar fornecedor

```
PUT http://localhost/api/fornecedores/21
Authorization: Bearer {TOKEN}
Content-Type: application/json

{
  "email": "novo-email@fornecedor.com.br"
}
```

---

### 3.4 Deletar fornecedor

```
DELETE http://localhost/api/fornecedores/21
Authorization: Bearer {TOKEN}
```

---

## 4️⃣ TESTES CRUD - PRODUTOS

### 4.1 Listar produtos

```
GET http://localhost/api/produtos
Authorization: Bearer {TOKEN}
```

**Verificação:**
- [ ] Retorna 200 OK
- [ ] Array com 60+ produtos (do seed)
- [ ] Cada produto tem categoria_id

---

### 4.2 Criar produto

```
POST http://localhost/api/produtos
Authorization: Bearer {TOKEN}
Content-Type: application/json

{
  "nome": "Notebook Teste",
  "descricao": "Notebook para testes",
  "preco": 2500.00,
  "quantidade_estoque": 10,
  "categoria_id": 2
}
```

**Verificação:**
- [ ] Retorna 201 Created
- [ ] ID gerado automaticamente

---

### 4.3 Buscar produto com fornecedores

```
GET http://localhost/api/produtos/1
Authorization: Bearer {TOKEN}
```

**Resposta esperada:**
```json
{
  "id": 1,
  "nome": "Notebook Dell Inspiron 15",
  "descricao": "...",
  "preco": 3499.90,
  "quantidade_estoque": 45,
  "categoria_id": 2,
  "created_at": "2026-01-17T...",
  "updated_at": "2026-01-17T..."
}
```

---

## 5️⃣ TESTES RELAÇÃO N:N - PRODUTOS/FORNECEDORES

### 5.1 Listar fornecedores de um produto

```
GET http://localhost/api/produtos/1/fornecedores
Authorization: Bearer {TOKEN}
```

**Resposta esperada:** 200 OK
```json
[
  {
    "id": 1,
    "nome": "Tech Solutions Brasil",
    "cnpj": "11.222.333/0001-44",
    "telefone": "(11) 3021-5000",
    "email": "contato@techsolutions.com.br",
    "created_at": "...",
    "updated_at": "..."
  },
  ...
]
```

**Verificação:**
- [ ] Retorna 200 OK
- [ ] Array com fornecedores do produto (múltiplos)

---

### 5.2 Adicionar fornecedor a um produto

```
POST http://localhost/api/produtos/65/fornecedores
Authorization: Bearer {TOKEN}
Content-Type: application/json

{
  "fornecedor_id": 5
}
```

**Resposta esperada:** 201 Created
```json
{
  "produto_id": 65,
  "fornecedor_id": 5,
  "created_at": "2026-01-17T..."
}
```

---

### 5.3 Remover fornecedor de um produto

```
DELETE http://localhost/api/produtos/65/fornecedores/5
Authorization: Bearer {TOKEN}
```

**Resposta esperada:** 204 No Content

---

## 6️⃣ TESTES CRUD - USUÁRIOS

### 6.1 Listar usuários

```
GET http://localhost/api/usuarios
Authorization: Bearer {TOKEN}
```

**Verificação:**
- [ ] Retorna 200 OK
- [ ] Array com 10+ usuários (do seed)

---

### 6.2 Criar usuário

```
POST http://localhost/api/usuarios
Authorization: Bearer {TOKEN}
Content-Type: application/json

{
  "nome": "Novo Usuario",
  "email": "novo@gestoriq.com",
  "senha": "senha789"
}
```

---

### 6.3 Atualizar usuário

```
PUT http://localhost/api/usuarios/11
Authorization: Bearer {TOKEN}
Content-Type: application/json

{
  "nome": "Usuario Atualizado"
}
```

---

## ⚠️ TESTES DE ERRO

### Sem Token

```
GET http://localhost/api/categorias
(SEM Authorization header)
```

**Resposta esperada:** 401 Unauthorized
```json
{"error": "Token ausente."}
```

---

### Token Inválido

```
GET http://localhost/api/categorias
Authorization: Bearer TOKEN_INVALIDO
```

**Resposta esperada:** 401 Unauthorized
```json
{"error": "Token invalido."}
```

---

### Recurso Não Encontrado

```
GET http://localhost/api/categorias/999999
Authorization: Bearer {TOKEN}
```

**Resposta esperada:** 404 Not Found
```json
{"error": "categoria nao encontrado."}
```

---

### Email Duplicado

```
POST http://localhost/api/usuarios
Authorization: Bearer {TOKEN}
Content-Type: application/json

{
  "nome": "Duplicado",
  "email": "admin@gestoriq.com",
  "senha": "senha"
}
```

**Resposta esperada:** 400 Bad Request
```json
{"error": "Email ja cadastrado."}
```

---

## 📋 CHECKLIST DE TESTES

- [ ] Health check retorna 200
- [ ] Login retorna token JWT válido
- [ ] Registrar usuário retorna 201
- [ ] Listar categorias retorna 200 com 15+ items
- [ ] Criar categoria retorna 201
- [ ] Buscar categoria por ID retorna 200
- [ ] Atualizar categoria retorna 200
- [ ] Deletar categoria retorna 204
- [ ] Listar fornecedores retorna 20+ items
- [ ] Criar fornecedor retorna 201
- [ ] Listar produtos retorna 60+ items
- [ ] Criar produto com categoria_id válido retorna 201
- [ ] Listar fornecedores de um produto retorna array
- [ ] Adicionar fornecedor a produto retorna 201
- [ ] Remover fornecedor de produto retorna 204
- [ ] Listar usuários retorna 10+ items
- [ ] Sem token retorna 401
- [ ] Token inválido retorna 401
- [ ] Recurso não encontrado retorna 404
- [ ] Email duplicado retorna 400

---

## 📝 NOTAS

- Todos os testes devem ser repetidos após restart do Docker
- Dados devem persistir (verificar volume postgres_data)
- Swagger em http://localhost/api-docs

---

**Total de Testes:** 20+ cenários  
**Tempo Estimado:** 15-20 minutos  
**Pré-requisito:** `docker compose up -d` rodando
