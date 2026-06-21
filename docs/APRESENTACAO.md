# GUIA DE APRESENTAÇÃO - GestorIQ

## O Projeto em 1 Minuto

**GestorIQ** é um sistema de gestão de estoque implementado como uma **API REST containerizada**. 

- **O que faz?** Gerencia produtos, categorias, fornecedores e usuários
- **Como é acessado?** Via API HTTP com autenticação JWT
- **Onde roda?** Em containers Docker (Nginx + Node.js + PostgreSQL)
- **Propósito acadêmico?** Demonstrar infraestrutura, banco de dados e desenvolvimento web em produção

---

## Fluxo da Arquitetura (Desenhável na Lousa)

```
┌──────────────┐
│   Postman    │
│ (ou Browser) │
└──────┬───────┘
       │ HTTP PORT 80
       ▼
┌─────────────────────────────────────────┐
│  NGINX (Proxy Reverso)                  │
│  - Roteador de requisições              │
│  - Proteção contra ataques              │
└──────┬──────────────────────────────────┘
       │ Comunicação interna (rede bridge)
       ▼
┌─────────────────────────────────────────┐
│  NODE.JS (Aplicação REST API)           │
│  - Recebe requisições HTTP              │
│  - Valida JWT (autenticação)            │
│  - Processa lógica de negócio           │
│  - Executa queries no banco             │
└──────┬──────────────────────────────────┘
       │ Comunicação interna (rede bridge)
       ▼
┌─────────────────────────────────────────┐
│  POSTGRESQL (Banco de Dados)            │
│  - 5 tabelas normalizadas               │
│  - 100+ registros de teste              │
│  - Armazenamento persistente            │
└─────────────────────────────────────────┘
```

---

## Demonstração Prática (10 minutos)

### 1️⃣ Mostrar que tudo está rodando

```bash
docker compose ps
```

**Esperado:** 3 containers saudáveis (healthy)

```
NAME              IMAGE              STATUS
gestoriq_nginx    nginx:1.27-alpine  Up (healthy)
gestoriq_app      <app_image>        Up (healthy)
gestoriq_postgres postgres:17-alpine Up (healthy)
```

**Explicar:** "Os 3 serviços estão rodando. O Nginx recebe requisições, o App processa, e o PostgreSQL armazena."

---

### 2️⃣ Testar Health Check

```bash
curl http://localhost/health
```

**Resposta:** `{"status": "ok"}`

**Explicar:** "A API está viva. Esse é o primeiro teste automático - se falhar aqui, Docker sabe que o serviço está com problema."

---

### 3️⃣ Mostrar Swagger (UI para testar API)

```
Abrir no navegador: http://localhost/api-docs
```

**Mostrar:**
- Todas as rotas documentadas
- Modelos de dados (input/output)
- Possibilidade de testar direto no Swagger

**Explicar:** "Swagger é a documentação interativa. Qualquer desenvolvedor que use essa API sabe exatamente quais endpoints existem e o que enviar."

---

### 4️⃣ Fazer Login (Mostrar JWT)

No Swagger, fazer POST `/login`:

```json
{
  "email": "admin@gestoriq.com",
  "senha": "senha123"
}
```

**Resposta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBnZXN0b3JpcS5jb20iLCJleHAiOjE2MjM0NTk5OTl9.xyz..."
}
```

**Explicar:** 
- "JWT é um token que prova que você é quem diz ser"
- "Token dura 24 horas"
- "Você manda esse token em cada requisição no header Authorization"

---

### 5️⃣ Testar CRUD (Criar, Ler, Atualizar, Deletar)

#### Listar categorias

```
GET /api/categorias
```

**Mostrar:** 15 categorias retornadas (do seed)

---

#### Criar categoria

```
POST /api/categorias
{
  "nome": "Testes Apresentacao",
  "descricao": "Categoria criada durante apresentacao"
}
```

**Mostrar:** Categoria criada com ID automático

---

#### Buscar por ID

```
GET /api/categorias/1
```

---

#### Listar fornecedores

```
GET /api/fornecedores
```

**Mostrar:** 20+ fornecedores (dados de teste)

---

#### Listar produtos com fornecedores (Relação N:N)

```
GET /api/produtos/1/fornecedores
```

**Explicar:** 
- "Um produto pode ter múltiplos fornecedores"
- "Um fornecedor pode fornecer múltiplos produtos"
- "Tabela pivô (PRODUTO_FORNECEDOR) gerencia essa relação"

---

### 6️⃣ Mostrar Persistência (o mais importante!)

```bash
docker compose ps  # Ver containers
```

Agora, **deletar e recriar os containers**:

```bash
docker compose down
docker compose up -d
```

**Esperar healthchecks ficarem green (~30 segundos)**

---

### 7️⃣ Verificar que dados ainda existem

```
GET /api/categorias
```

**Mostrar:** As 15+ categorias ainda estão lá!

**Explicar:** 
- "Quando deletamos o container, poderíamos perder tudo"
- "Mas usamos um Named Volume (`postgres_data`) para armazenar dados"
- "Mesmo deletando containers, os dados persistem"
- "Isso é crucial em produção - nunca perder dados!"

---

## Pontos de Destaque para Mencionar

### Segurança
- ✅ **JWT:** Autenticação em cada requisição
- ✅ **PBKDF2:** Senhas hasheadas (NEVER plain text)
- ✅ **Usuário não-root:** App roda com permissões mínimas
- ✅ **Network isolada:** App e banco não são acessíveis diretamente do host
- ✅ **Nginx reverse proxy:** Única porta exposta (80)

---

### Banco de Dados
- ✅ **Normalizado até 3FN:** Sem redundância, sem anomalias
- ✅ **5 tabelas:** Usuario, Categoria, Fornecedor, Produto, Produto_Fornecedor
- ✅ **Integridade referencial:** Chaves estrangeiras com CASCADE/RESTRICT
- ✅ **Constraints:** Preço >= 0, Estoque >= 0
- ✅ **100+ registros de teste:** Dados realistas para demonstração

---

### Infraestrutura (Docker)
- ✅ **Multi-stage build:** Imagem pequena (120MB vs 500MB)
- ✅ **3 camadas:** Nginx → App → PostgreSQL
- ✅ **Health checks:** Docker monitora saúde dos serviços
- ✅ **Named Volumes:** Dados persistem mesmo deletando containers
- ✅ **Custom networks:** Comunicação segura e interna

---

### Desenvolvimento
- ✅ **REST API:** Padrão HTTP (GET/POST/PUT/DELETE)
- ✅ **Middleware:** Autenticação JWT customizada
- ✅ **Swagger:** Documentação automática e testável
- ✅ **Error handling:** Erros padronizados com códigos HTTP corretos
- ✅ **Migrations:** Script CLI para setup (`node command.js migrate`)

---

## Perguntas Esperadas (Respostas Rápidas)

### "Por que Docker?"
**Resposta:** "Para garantir que funciona na máquina do professor exatamente como funciona na minha. Sem 'na minha máquina funciona'."

### "Por que Nginx?"
**Resposta:** "Nginx é um reverse proxy. Ele recebe requisições, roteia para a aplicação, gerencia cache, protege contra ataques. A aplicação Node.js não fica exposta diretamente."

### "Por que PostgreSQL?"
**Resposta:** "Banco relacional robusto, suporta constraints e integridade referencial. Melhor que SQLite para produção."

### "Por que JWT?"
**Resposta:** "Token que prova autenticação. Não precisa armazenar sessão no servidor. Escalável e stateless."

### "Dados persistem mesmo deletando containers?"
**Resposta:** "Sim, porque usamos Named Volume. Volume é armazenado no host, fora do container. Quando recrio container, volume continua."

### "Por que 3FN?"
**Resposta:** "Normalização evita redundância e anomalias. Se houver 100 produtos da categoria 'Notebooks', o nome 'Notebooks' é armazenado uma única vez. Se precisar atualizar, muda em um lugar."

---

## Demonstração de Tempo (Total: ~15 min)

| Parte | Tempo | O que fazer |
|-------|-------|-----------|
| Explicação arquitetura | 2 min | Desenhar fluxo na lousa |
| Mostrar Docker containers | 1 min | `docker compose ps` |
| Health check | 1 min | `curl /health` |
| Swagger UI | 2 min | Abrir e explorar no navegador |
| JWT login | 2 min | POST /login, explicar token |
| CRUD + N:N | 4 min | Criar/ler/atualizar/deletar categorias e fornecedores |
| Persistência | 2 min | Deletar e recriar containers, verificar dados |
| Perguntas | 1 min | Responder 1-2 perguntas |

---

## Slides Visuais (Se quiser PowerPoint)

### Slide 1: O que é GestorIQ?
- Sistema de gestão de estoque
- API REST em Node.js
- Roda em Docker
- Desenvolvido para demonstrar arquitetura moderna

### Slide 2: Arquitetura
```
Usuario → Nginx (80) → Node.js (3000) → PostgreSQL (5432)
```

### Slide 3: Banco de Dados
- 5 tabelas normalizadas em 3FN
- Relação N:N (Produtos ↔ Fornecedores)
- 100+ registros de teste

### Slide 4: Segurança
- JWT para autenticação
- PBKDF2 para senhas
- Usuário não-root
- Network isolada

### Slide 5: Infraestrutura
- Docker Compose (3 serviços)
- Multi-stage build
- Health checks
- Named Volumes

---

## Script Final (Para Terminar)

"GestorIQ é um projeto que demonstra as 3 disciplinas:

1. **Banco de Dados:** 5 tabelas normalizadas, dados consistentes, integridade referencial.

2. **Infraestrutura:** Docker multi-container, segurança por camadas, persistência de dados, orquestração.

3. **Desenvolvimento Web:** API REST profissional, autenticação segura, Swagger documentado, error handling correto.

Quando vocês forem para a indústria, verão que todo projeto sério usa essas práticas. Docker é padrão, normalização é essencial, e API REST é a forma moderna de comunicação entre sistemas.

Perguntas?"

---

**Tempo total de apresentação:** ~15 minutos  
**Tempo de resposta para perguntas:** Adicionar 5-10 minutos

Boa sorte! 🚀
