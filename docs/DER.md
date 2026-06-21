# DER - Diagrama Entidade-Relacionamento do GestorIQ

## 1. Diagrama Conceitual (Mermaid)

```mermaid
erDiagram
    USUARIOS ||--o{ PRODUTOS : cria
    USUARIOS {
        int id PK
        string nome
        string email UK
        string senha_hash
        timestamp created_at
        timestamp updated_at
    }
    
    CATEGORIAS ||--o{ PRODUTOS : clasifica
    CATEGORIAS {
        int id PK
        string nome UK
        string descricao
        timestamp created_at
        timestamp updated_at
    }
    
    PRODUTOS ||--o{ PRODUTO_FORNECEDOR : relaciona
    PRODUTOS {
        int id PK
        string nome
        string descricao
        decimal preco
        int quantidade_estoque
        int categoria_id FK
        timestamp created_at
        timestamp updated_at
    }
    
    FORNECEDORES ||--o{ PRODUTO_FORNECEDOR : oferece
    FORNECEDORES {
        int id PK
        string nome
        string cnpj UK
        string telefone
        string email
        timestamp created_at
        timestamp updated_at
    }
    
    PRODUTO_FORNECEDOR {
        int produto_id FK PK
        int fornecedor_id FK PK
        timestamp created_at
    }
```

## 2. Diagrama Lógico em Texto

### Estrutura Relacional

```
┌─────────────────────────────────────────┐
│           USUARIOS                      │
├─────────────────────────────────────────┤
│ PK: id (SERIAL)                         │
│ UK: email (VARCHAR UNIQUE)              │
│     nome (VARCHAR)                      │
│     senha_hash (TEXT)                   │
│     created_at (TIMESTAMP DEFAULT NOW)  │
│     updated_at (TIMESTAMP DEFAULT NOW)  │
└─────────────────────────────────────────┘
            ↓ cria
┌─────────────────────────────────────────┐
│           CATEGORIAS                    │
├─────────────────────────────────────────┤
│ PK: id (SERIAL)                         │
│ UK: nome (VARCHAR UNIQUE)               │
│     descricao (TEXT)                    │
│     created_at (TIMESTAMP DEFAULT NOW)  │
│     updated_at (TIMESTAMP DEFAULT NOW)  │
└─────────────────────────────────────────┘
            ↓ clasifica
┌─────────────────────────────────────────┐
│           PRODUTOS                      │
├─────────────────────────────────────────┤
│ PK: id (SERIAL)                         │
│ FK: categoria_id → CATEGORIAS(id)       │
│     nome (VARCHAR)                      │
│     descricao (TEXT)                    │
│     preco (NUMERIC CHECK preco >= 0)    │
│     quantidade_estoque (INT ≥ 0)        │
│     created_at (TIMESTAMP DEFAULT NOW)  │
│     updated_at (TIMESTAMP DEFAULT NOW)  │
└─────────────────────────────────────────┘
            ↓ relaciona (N:N)
┌─────────────────────────────────────────┐
│       PRODUTO_FORNECEDOR (Pivô)         │
├─────────────────────────────────────────┤
│ PK: (produto_id, fornecedor_id)         │
│ FK: produto_id → PRODUTOS(id)           │
│ FK: fornecedor_id → FORNECEDORES(id)    │
│     created_at (TIMESTAMP DEFAULT NOW)  │
└─────────────────────────────────────────┘
            ↓ oferece
┌─────────────────────────────────────────┐
│         FORNECEDORES                    │
├─────────────────────────────────────────┤
│ PK: id (SERIAL)                         │
│ UK: cnpj (VARCHAR UNIQUE)               │
│     nome (VARCHAR)                      │
│     telefone (VARCHAR)                  │
│     email (VARCHAR)                     │
│     created_at (TIMESTAMP DEFAULT NOW)  │
│     updated_at (TIMESTAMP DEFAULT NOW)  │
└─────────────────────────────────────────┘
```

## 3. Relacionamentos Especificados

### 1:N (Um para Muitos)

| De | Para | Cardinalidade | FK | Descrição |
|---|---|---|---|---|
| CATEGORIAS | PRODUTOS | 1:N | categoria_id | Cada categoria tem vários produtos |
| FORNECEDORES | PRODUTO_FORNECEDOR | 1:N | fornecedor_id | Cada fornecedor tem múltiplas associações |
| PRODUTOS | PRODUTO_FORNECEDOR | 1:N | produto_id | Cada produto pode ter múltiplos fornecedores |

### N:N (Muitos para Muitos)

| Tabela A | Tabela Pivô | Tabela B | Descrição |
|---|---|---|---|
| PRODUTOS | PRODUTO_FORNECEDOR | FORNECEDORES | Um produto pode ter múltiplos fornecedores e um fornecedor pode fornecer múltiplos produtos |

## 4. Restrições de Integridade

### Primary Keys (PK)
- `USUARIOS.id` - Identifica único cada usuário
- `CATEGORIAS.id` - Identifica única cada categoria
- `FORNECEDORES.id` - Identifica único cada fornecedor
- `PRODUTOS.id` - Identifica único cada produto
- `PRODUTO_FORNECEDOR.(produto_id, fornecedor_id)` - Identifica única a associação

### Unique Keys (UK)
- `USUARIOS.email` - Email único por usuário
- `CATEGORIAS.nome` - Nome de categoria único
- `FORNECEDORES.cnpj` - CNPJ único por fornecedor

### Foreign Keys (FK) com Ações
```
PRODUTOS.categoria_id 
  → CATEGORIAS.id 
  ON DELETE RESTRICT  (impede apagar categoria com produtos)
  
PRODUTO_FORNECEDOR.produto_id 
  → PRODUTOS.id 
  ON DELETE CASCADE   (apaga associações se produto for deletado)
  
PRODUTO_FORNECEDOR.fornecedor_id 
  → FORNECEDORES.id 
  ON DELETE CASCADE   (apaga associações se fornecedor for deletado)
```

### Check Constraints
```
produtos.preco >= 0           (preço não pode ser negativo)
produtos.quantidade_estoque >= 0  (estoque não pode ser negativo)
```

## 5. Volumetria Esperada

| Tabela | Volume Típico | Volume Teste |
|---|---|---|
| USUARIOS | 5-100 | 10+ |
| CATEGORIAS | 10-50 | 15 |
| FORNECEDORES | 20-200 | 20 |
| PRODUTOS | 500-5000 | 60+ |
| PRODUTO_FORNECEDOR | 1000-20000 | 150+ |

## 6. Notas de Design

### Por que 5 tabelas?

1. **USUARIOS** - Suporte a autenticação e rastreabilidade de ações
2. **CATEGORIAS** - Classificação e organização de produtos
3. **FORNECEDORES** - Gestão de cadeia de suprimentos
4. **PRODUTOS** - Core do domínio - itens em estoque
5. **PRODUTO_FORNECEDOR** - Tabela pivô para relação N:N (obrigatória conforme PDF)

### Por que essa estrutura?

- **Normalização**: Segue até 3FN (ver NORMALIZACAO.md)
- **Escalabilidade**: Suporta crescimento de dados sem redesign
- **Integridade**: Constraints garantem consistência
- **Flexibilidade**: Tabela pivô permite múltiplos fornecedores por produto

---

**Próxima leitura:** Ver [NORMALIZACAO.md](./NORMALIZACAO.md) para justificativa de normalização.
