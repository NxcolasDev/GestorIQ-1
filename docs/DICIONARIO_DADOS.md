# DICIONÁRIO DE DADOS - GestorIQ

## 1. Tabela USUARIOS

| Campo | Tipo | Tamanho | Nulo | Chave | Padrão | Descrição |
|-------|------|--------|------|-------|--------|-----------|
| id | SERIAL | - | Não | PK | AUTO | Identificador único do usuário |
| nome | VARCHAR | 120 | Não | - | - | Nome completo do usuário |
| email | VARCHAR | 160 | Não | UK | - | E-mail único para autenticação |
| senha_hash | TEXT | - | Não | - | - | Hash PBKDF2 da senha (nunca armazenar texto) |
| created_at | TIMESTAMP | - | Não | - | NOW() | Data/hora de criação do registro |
| updated_at | TIMESTAMP | - | Não | - | NOW() | Data/hora da última atualização |

**Constraints:**
- PK: `id`
- UK: `email` (garante autenticação única)
- NOT NULL: todos os campos
- CHECK: `LENGTH(email) > 3`

**Exemplo de Registro:**
```sql
INSERT INTO usuarios VALUES
  (1, 'Admin GestorIQ', 'admin@gestoriq.com', '120000:abc123:def456', '2026-01-01', '2026-01-01');
```

---

## 2. Tabela CATEGORIAS

| Campo | Tipo | Tamanho | Nulo | Chave | Padrão | Descrição |
|-------|------|--------|------|-------|--------|-----------|
| id | SERIAL | - | Não | PK | AUTO | Identificador único da categoria |
| nome | VARCHAR | 120 | Não | UK | - | Nome único da categoria |
| descricao | TEXT | - | Sim | - | NULL | Descrição detalhada (opcional) |
| created_at | TIMESTAMP | - | Não | - | NOW() | Data/hora de criação |
| updated_at | TIMESTAMP | - | Não | - | NOW() | Data/hora da última atualização |

**Constraints:**
- PK: `id`
- UK: `nome` (garante nome único)
- NOT NULL: `id, nome, created_at, updated_at`

**Valores Típicos:**
- Eletrônicos, Informática, Periféricos, Notebooks, Servidores

---

## 3. Tabela FORNECEDORES

| Campo | Tipo | Tamanho | Nulo | Chave | Padrão | Descrição |
|-------|------|--------|------|-------|--------|-----------|
| id | SERIAL | - | Não | PK | AUTO | Identificador único do fornecedor |
| nome | VARCHAR | 160 | Não | - | - | Nome da empresa fornecedora |
| cnpj | VARCHAR | 24 | Não | UK | - | CNPJ único (formatado: XX.XXX.XXX/0001-XX) |
| telefone | VARCHAR | 40 | Sim | - | NULL | Telefone para contato (opcional) |
| email | VARCHAR | 160 | Sim | - | NULL | E-mail para contato (opcional) |
| created_at | TIMESTAMP | - | Não | - | NOW() | Data/hora de criação |
| updated_at | TIMESTAMP | - | Não | - | NOW() | Data/hora da última atualização |

**Constraints:**
- PK: `id`
- UK: `cnpj` (garante CNPJ único)
- NOT NULL: `id, nome, cnpj, created_at, updated_at`

**Formato CNPJ:**
- Aceita: `12.345.678/0001-99` ou `12345678000199`
- Aplicação normaliza ao inserir

---

## 4. Tabela PRODUTOS

| Campo | Tipo | Tamanho | Nulo | Chave | Padrão | Descrição |
|-------|------|--------|------|-------|--------|-----------|
| id | SERIAL | - | Não | PK | AUTO | Identificador único do produto |
| nome | VARCHAR | 160 | Não | - | - | Nome do produto |
| descricao | TEXT | - | Sim | - | NULL | Descrição detalhada (opcional) |
| preco | NUMERIC | 12,2 | Não | - | - | Preço unitário (positivo) |
| quantidade_estoque | INTEGER | - | Não | - | 0 | Quantidade em estoque (não-negativo) |
| categoria_id | INTEGER | - | Não | FK | - | Referência para CATEGORIAS.id |
| created_at | TIMESTAMP | - | Não | - | NOW() | Data/hora de criação |
| updated_at | TIMESTAMP | - | Não | - | NOW() | Data/hora da última atualização |

**Constraints:**
- PK: `id`
- FK: `categoria_id` → CATEGORIAS.id (ON DELETE RESTRICT)
- NOT NULL: `id, nome, preco, quantidade_estoque, categoria_id, created_at, updated_at`
- CHECK: `preco >= 0`
- CHECK: `quantidade_estoque >= 0`

**Tipos de Preço:**
- NUMERIC(12,2): Suporta até 999.999.999,99
- Exemplo: 3.499,90

**Valores Iniciais:**
- quantidade_estoque = 0 (produtonovos começam sem estoque)

---

## 5. Tabela PRODUTO_FORNECEDOR (Tabela Pivô)

| Campo | Tipo | Tamanho | Nulo | Chave | Padrão | Descrição |
|-------|------|--------|------|-------|--------|-----------|
| produto_id | INTEGER | - | Não | PK+FK | - | Referência para PRODUTOS.id |
| fornecedor_id | INTEGER | - | Não | PK+FK | - | Referência para FORNECEDORES.id |
| created_at | TIMESTAMP | - | Não | - | NOW() | Data/hora da associação |

**Constraints:**
- PK: `(produto_id, fornecedor_id)` (chave composta)
- FK: `produto_id` → PRODUTOS.id (ON DELETE CASCADE)
- FK: `fornecedor_id` → FORNECEDORES.id (ON DELETE CASCADE)
- NOT NULL: todos
- UNIQUE: `(produto_id, fornecedor_id)` (evita duplicata)

**Lógica:**
- Um produto pode ter 1 a N fornecedores
- Um fornecedor pode fornecer 1 a M produtos
- Exemplo: Notebook Dell pode vir de Tech Solutions E SupriBits

**Ações Cascata:**
- Se apagar PRODUTO com ID=10, todas as linhas em PRODUTO_FORNECEDOR com produto_id=10 são apagadas automaticamente
- Se apagar FORNECEDOR com ID=5, todas as linhas em PRODUTO_FORNECEDOR com fornecedor_id=5 são apagadas automaticamente

---

## 6. Sumário de Tipos de Dados

| Tipo | Uso | Exemplos |
|------|-----|----------|
| SERIAL | Identificadores auto-incrementantes | ids |
| VARCHAR(n) | Texto de comprimento fixo | nomes, emails, telefones |
| TEXT | Texto variável (sem limite prático) | descrições, observações |
| NUMERIC(p,s) | Números decimais precisos | preços (12,2 = até 999.999,99) |
| INTEGER | Números inteiros | quantidade, contadores |
| TIMESTAMP | Data e hora | created_at, updated_at |
| BOOLEAN | Verdadeiro/Falso | (não usado atualmente) |

---

## 7. Convenções de Nomenclatura

| Elemento | Convenção | Exemplo |
|----------|-----------|---------|
| Tabelas | Singular, lowercase | `usuarios`, `categorias` |
| Colunas | Singular, snake_case | `categoria_id`, `created_at` |
| Chaves Primárias | `id` | `id` |
| Chaves Estrangeiras | `[singular_tabela]_id` | `categoria_id`, `produto_id` |
| Índices | `idx_[tabela]_[campo]` | `idx_produtos_categoria_id` |
| Constraints | Descriptivo | `categoria_id REFERENCES ...` |

---

## 8. Padrões de Auditoria

Todas as tabelas principais têm:
- `created_at TIMESTAMP DEFAULT NOW()` - Quando foi criado
- `updated_at TIMESTAMP DEFAULT NOW()` - Última modificação

Isso permite:
- Rastrear quando dados foram adicionados
- Identificar mudanças recentes
- Criar histórico de modificações (se necessário)

---

## 9. Volume de Dados Esperado

| Tabela | Produção | Desenvolvimento | Teste |
|--------|----------|-----------------|-------|
| USUARIOS | 50-500 | 5-20 | 10+ |
| CATEGORIAS | 20-100 | 10-20 | 15 |
| FORNECEDORES | 50-500 | 10-30 | 20 |
| PRODUTOS | 500-5000 | 50-200 | 60+ |
| PRODUTO_FORNECEDOR | 1000-20000 | 100-500 | 150+ |

---

## 10. Segurança

### Dados Sensíveis
- ❌ Nunca armazenar senhas em texto plano
- ✅ Usar hash PBKDF2 (implementado)
- ✅ Usar salt aleatório por usuário

### Integridade
- ✅ Todas as FKs com constraints
- ✅ UNIQUEs nos emails e CNPJs
- ✅ CHECKs em valores monetários

### Acesso
- Implementar no backend (não no BD)
- JWT para autenticação
- RBAC (Role-Based Access Control) em futuras versões

---

**Última atualização:** 2026-01-17  
**Compatibilidade:** PostgreSQL 17+
