# NORMALIZAÇÃO - Análise de Formas Normais

## Introdução

Este documento justifica por que o banco de dados do GestorIQ está normalizado até a **3ª Forma Normal (3FN)**. A normalização elimina redundância, reduz anomalias e garante integridade referencial.

---

## 1. Primeira Forma Normal (1FN)

### Definição
Uma relação está em 1FN se e somente se:
1. Todos os atributos contêm apenas valores atômicos (não dividíveis)
2. Não existem grupos repetidos (multivalorados)

### Verificação no GestorIQ: ✅ ATENDE

#### Tabela USUARIOS - Análise 1FN

```sql
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,           -- ✅ Atômico
  email VARCHAR(160) NOT NULL UNIQUE,   -- ✅ Atômico
  senha_hash TEXT NOT NULL,             -- ✅ Atômico
  created_at TIMESTAMP DEFAULT NOW,     -- ✅ Atômico
  updated_at TIMESTAMP DEFAULT NOW      -- ✅ Atômico
);
```

**Análise:**
- ✅ `nome`: Um valor único e indivisível
- ✅ `email`: Armazenado como string, não é decomposição de múltiplos valores
- ✅ `senha_hash`: Valor único (hash PBKDF2)
- ✅ Não há listas ou arrays (ex: `emails` = ['a@x.com', 'b@y.com'])
- ✅ Não há grupos repetidos

**Conclusão:** Está em 1FN ✅

#### Tabela PRODUTOS - Análise 1FN

```sql
CREATE TABLE produtos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(160) NOT NULL,                    -- ✅ Atômico
  descricao TEXT,                                 -- ✅ Atômico
  preco NUMERIC(12,2) NOT NULL,                  -- ✅ Atômico
  quantidade_estoque INTEGER NOT NULL DEFAULT 0, -- ✅ Atômico
  categoria_id INTEGER NOT NULL REFERENCES ...   -- ✅ Atômico (FK)
);
```

**Análise:**
- ✅ `nome`: Único valor
- ✅ `preco`: Número decimal único
- ✅ `categoria_id`: Referência a uma categoria (não repetido)
- ✅ Não há `categorias` = [1, 2, 3] (isso seria 2FN problem)

**Conclusão:** Está em 1FN ✅

---

## 2. Segunda Forma Normal (2FN)

### Definição
Uma relação está em 2FN se e somente se:
1. Está em 1FN
2. Todos os atributos não-chave dependem **funcionalmente da chave primária completa**
3. Não há dependência parcial

### O que é Dependência Parcial?
Uma dependência parcial ocorre quando um atributo não-chave depende de apenas **parte** da chave primária (em tabelas com chave composta).

### Verificação no GestorIQ: ✅ ATENDE

#### Tabela USUARIOS - Análise 2FN

```sql
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,              -- Chave Primária Simples
  nome VARCHAR(120) NOT NULL,         -- Depende de `id` ✅
  email VARCHAR(160) UNIQUE NOT NULL, -- Depende de `id` ✅
  senha_hash TEXT NOT NULL            -- Depende de `id` ✅
);
```

**Análise:**
- Chave primária: `id` (simples, não composta)
- Todos os atributos não-chave dependem de `id`
- Não há dependência parcial (não possível com chave simples)

**Conclusão:** Está em 2FN ✅

#### Tabela PRODUTOS - Análise 2FN

```sql
CREATE TABLE produtos (
  id SERIAL PRIMARY KEY,              -- Chave Primária Simples
  nome VARCHAR(160) NOT NULL,         -- Depende de `id` ✅
  descricao TEXT,                     -- Depende de `id` ✅
  preco NUMERIC(12,2) NOT NULL,       -- Depende de `id` ✅
  quantidade_estoque INTEGER NOT NULL,-- Depende de `id` ✅
  categoria_id INTEGER REFERENCES ... -- Depende de `id` ✅
);
```

**Análise:**
- Chave primária: `id` (simples)
- `categoria_id` não causa violação de 2FN (é um FK que relaciona com outra tabela)
- Não há atributo que dependa apenas de `categoria_id` (como nome_categoria)

**Se fosse NÃO NORMALIZADO:**
```sql
-- ❌ ERRADO - Violaria 2FN
CREATE TABLE produtos_mal (
  id SERIAL,
  nome VARCHAR(160),
  categoria_id INTEGER,
  categoria_nome VARCHAR(120),  -- ❌ Depende de categoria_id, não de id
  preco NUMERIC(12,2),
  PRIMARY KEY (id)
);
```

**Conclusão:** Está em 2FN ✅

#### Tabela PRODUTO_FORNECEDOR - Análise 2FN

```sql
CREATE TABLE produto_fornecedor (
  produto_id INTEGER NOT NULL REFERENCES produtos(id),       -- PK Parte 1
  fornecedor_id INTEGER NOT NULL REFERENCES fornecedores(id),-- PK Parte 2
  created_at TIMESTAMP DEFAULT NOW,                          -- Depende da composição ✅
  PRIMARY KEY (produto_id, fornecedor_id)
);
```

**Análise:**
- Chave primária composta: `(produto_id, fornecedor_id)`
- `created_at`: Depende de ambas as partes (quando foi criada essa associação)
- Não há atributos que dependam de apenas `produto_id` ou apenas `fornecedor_id`

**Se fosse NÃO NORMALIZADO:**
```sql
-- ❌ ERRADO - Violaria 2FN
CREATE TABLE produto_fornecedor_mal (
  produto_id INTEGER,
  fornecedor_id INTEGER,
  produto_nome VARCHAR(160),      -- ❌ Depende só de produto_id
  fornecedor_nome VARCHAR(160),   -- ❌ Depende só de fornecedor_id
  created_at TIMESTAMP,
  PRIMARY KEY (produto_id, fornecedor_id)
);
```

**Conclusão:** Está em 2FN ✅

---

## 3. Terceira Forma Normal (3FN)

### Definição
Uma relação está em 3FN se e somente se:
1. Está em 2FN
2. Não possui dependência transitiva (um atributo não-chave depende de outro não-chave)

### O que é Dependência Transitiva?
A → B → C, onde A é chave e C depende transitivamente de A através de B.

**Exemplo de violação:**
```
funcionario_id → departamento_id → departamento_nome
```

Se conhecemos o funcionário, sabemos seu departamento. Se sabemos o departamento, sabemos o nome. Isso cria redundância.

### Verificação no GestorIQ: ✅ ATENDE

#### Tabela USUARIOS - Análise 3FN

```sql
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,              -- Chave
  nome VARCHAR(120) NOT NULL,         -- Não depende de outro não-chave ✅
  email VARCHAR(160) UNIQUE,          -- Não depende de outro não-chave ✅
  senha_hash TEXT NOT NULL            -- Não depende de outro não-chave ✅
);
```

**Análise:**
- `id` → `nome`: Não transitiva
- `id` → `email`: Não transitiva
- Não há caminho A → B → C onde A=id, B,C são não-chave

**Conclusão:** Está em 3FN ✅

#### Tabela PRODUTOS - Análise 3FN

```sql
CREATE TABLE produtos (
  id SERIAL PRIMARY KEY,              -- Chave
  nome VARCHAR(160) NOT NULL,         -- Não transitivo ✅
  descricao TEXT,                     -- Não transitivo ✅
  preco NUMERIC(12,2),                -- Não transitivo ✅
  quantidade_estoque INTEGER,         -- Não transitivo ✅
  categoria_id INTEGER REFERENCES ... -- ✅ FK, não causa transitiva
);
```

**Análise:**
- `id` → `categoria_id` (FK de referência, permitido)
- `categoria_id` → `categoria_nome`? **NÃO, porque categoria_nome não está aqui!**
- A tabela CATEGORIAS é separada

**Se fosse NÃO NORMALIZADO (violaria 3FN):**
```sql
-- ❌ ERRADO - Violaria 3FN
CREATE TABLE produtos_mal (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(160),
  categoria_id INTEGER,
  categoria_nome VARCHAR(120),  -- ❌ Depende de categoria_id que depende de id
  preco NUMERIC(12,2),
  PRIMARY KEY (id)
);
```

Aqui temos:
- `id` → `categoria_id` (FK)
- `categoria_id` → `categoria_nome` (transitiva)
- Logo: `id` →→ `categoria_nome` (violação de 3FN)

**Conclusão:** Está em 3FN ✅

#### Tabela CATEGORIAS - Análise 3FN

```sql
CREATE TABLE categorias (
  id SERIAL PRIMARY KEY,              -- Chave
  nome VARCHAR(120) NOT NULL UNIQUE,  -- Não transitivo ✅
  descricao TEXT                      -- Não transitivo ✅
);
```

**Análise:**
- Simples, sem dependências transitivas
- `id` → `nome`: Direto
- `id` → `descricao`: Direto

**Conclusão:** Está em 3FN ✅

---

## 4. Resumo de Conformidade

| Tabela | 1FN | 2FN | 3FN | Status |
|---|---|---|---|---|
| USUARIOS | ✅ Sim | ✅ Sim | ✅ Sim | **Normalizado 3FN** |
| CATEGORIAS | ✅ Sim | ✅ Sim | ✅ Sim | **Normalizado 3FN** |
| FORNECEDORES | ✅ Sim | ✅ Sim | ✅ Sim | **Normalizado 3FN** |
| PRODUTOS | ✅ Sim | ✅ Sim | ✅ Sim | **Normalizado 3FN** |
| PRODUTO_FORNECEDOR | ✅ Sim | ✅ Sim | ✅ Sim | **Normalizado 3FN** |

**Conclusão Geral:** Todo o banco está em **3ª Forma Normal (3FN)** ✅

---

## 5. Benefícios da Normalização

### ✅ Implementados no GestorIQ

1. **Elimina Redundância**
   - `categoria_nome` não está duplicado em cada produto
   - `fornecedor_nome` não está duplicado em cada associação
   - Exemplo: Se há 100 produtos da categoria "Notebooks", o nome "Notebooks" é armazenado apenas 1 vez

2. **Evita Anomalias de Atualização**
   - Para atualizar nome de categoria, altera-se em **um único lugar**
   - Sem risco de inconsistência (alguns dizendo "Notebooks", outros "Notebooks Gamer")

3. **Evita Anomalias de Inserção**
   - Pode-se inserir uma categoria vazia (sem produtos) sem problema
   - Sem obrigação de ter produto para criar categoria

4. **Evita Anomalias de Exclusão**
   - Ao deletar um produto, a categoria continua existindo
   - (Com ON DELETE RESTRICT, não é possível deletar categoria com produtos)

5. **Melhora Integridade Referencial**
   - Foreign Keys garantem que não haverá `categoria_id` órfão
   - Todas as tabelas relacionadas mantêm consistência

6. **Facilita Consultas**
   - JOINs limpas e eficientes
   - Sem dados duplicados para filtrar
   - Índices funcionam melhor

---

## 6. Quando Desnormalizar?

### Cenários onde a desnormalização seria aceitável:
- **Alto volume de leitura:** Se 99% do tempo lê-se produto+categoria juntos
- **Performance crítica:** Se latência de JOIN fosse problema
- **Relatórios específicos:** Para caches pré-computados

### No GestorIQ:
- ❌ **NÃO há motivo para desnormalizar**
- ✅ 60+ produtos é volume pequeno
- ✅ JOINs de 2-3 tabelas são rápidas
- ✅ Prioridade é integridade e consistência

---

## Conclusão

O banco de dados GestorIQ foi **corretamente normalizado até 3FN**, atendendo aos requisitos acadêmicos e às melhores práticas de design relacional. Não há necessidade de desnormalização.

**Certificação:** 3ª Forma Normal (3FN) ✅
