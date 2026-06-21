# CHECKLIST FINAL - GestorIQ

## Pré-Apresentação (Checklist na Máquina Final)

### 🔧 Configuração Inicial

- [ ] **Docker Desktop aberto e running**
  ```bash
  docker info
  ```
  Deve retornar informações sobre Docker

- [ ] **Porta 80 livre**
  ```bash
  netstat -an | find "80"
  # Windows: Não deve retornar LISTEN em 0.0.0.0:80
  ```

- [ ] **Arquivo .env configurado**
  ```bash
  cat backend/.env
  ```
  Deve ter: DB_PASSWORD, JWT_SECRET, ADMIN_PASSWORD

- [ ] **.env.example existe** (para o professor copiar se necessário)
  ```bash
  ls backend/.env.example
  ```

---

### 🐳 Build e Deploy

- [ ] **Limpar antes de começar** (remover old containers)
  ```bash
  docker compose down -v
  ```
  `-v`: Remove volumes (para começar limpo)

- [ ] **Build e subir**
  ```bash
  docker compose up --build
  ```
  Deve compilar sem erros

- [ ] **Verificar status dos containers**
  ```bash
  docker compose ps
  ```
  Esperado:
  ```
  gestoriq_nginx     ... Up (healthy)
  gestoriq_app       ... Up (healthy)
  gestoriq_postgres  ... Up (healthy)
  ```
  Todos devem estar `healthy` (pode levar 30-60 segundos)

- [ ] **Verificar logs**
  ```bash
  docker compose logs app
  docker compose logs postgres
  docker compose logs nginx
  ```
  Não devem haver erros críticos

---

### 🌍 Testes de Conectividade

- [ ] **Health Check**
  ```bash
  curl http://localhost/health
  ```
  Esperado: `{"status":"ok"}`

- [ ] **Swagger acessível**
  ```
  Abrir: http://localhost/api-docs
  ```
  Deve mostrar interface Swagger com todas as rotas

- [ ] **Login funciona**
  ```bash
  curl -X POST http://localhost/api/login \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@gestoriq.com","senha":"senha123"}'
  ```
  Esperado: Retorna `{"token":"eyJh..."}`

- [ ] **Listar categorias**
  ```bash
  curl -X GET http://localhost/api/categorias \
    -H "Authorization: Bearer {SEU_TOKEN}"
  ```
  Esperado: Array com 15+ categorias

- [ ] **Listar fornecedores**
  ```bash
  curl http://localhost/api/fornecedores \
    -H "Authorization: Bearer {SEU_TOKEN}"
  ```
  Esperado: Array com 20+ fornecedores

- [ ] **Listar produtos**
  ```bash
  curl http://localhost/api/produtos \
    -H "Authorization: Bearer {SEU_TOKEN}"
  ```
  Esperado: Array com 60+ produtos

---

### 🔍 Testes Críticos de Negócio

- [ ] **Relação N:N funciona**
  ```bash
  curl http://localhost/api/produtos/1/fornecedores \
    -H "Authorization: Bearer {SEU_TOKEN}"
  ```
  Esperado: Array de fornecedores do produto

- [ ] **Criar produto**
  ```bash
  curl -X POST http://localhost/api/produtos \
    -H "Authorization: Bearer {SEU_TOKEN}" \
    -H "Content-Type: application/json" \
    -d '{
      "nome":"Produto Teste",
      "preco":999.99,
      "quantidade_estoque":5,
      "categoria_id":1
    }'
  ```
  Esperado: 201 Created com ID gerado

- [ ] **Criar categoria**
  ```bash
  curl -X POST http://localhost/api/categorias \
    -H "Authorization: Bearer {SEU_TOKEN}" \
    -H "Content-Type: application/json" \
    -d '{"nome":"Cat Teste","descricao":"Teste"}'
  ```
  Esperado: 201 Created

- [ ] **Atualizar produto**
  ```bash
  curl -X PUT http://localhost/api/produtos/1 \
    -H "Authorization: Bearer {SEU_TOKEN}" \
    -H "Content-Type: application/json" \
    -d '{"nome":"Produto Atualizado"}'
  ```
  Esperado: 200 OK

- [ ] **Deletar produto**
  ```bash
  curl -X DELETE http://localhost/api/produtos/65 \
    -H "Authorization: Bearer {SEU_TOKEN}"
  ```
  Esperado: 204 No Content

---

### 🔐 Testes de Segurança

- [ ] **Sem token retorna 401**
  ```bash
  curl http://localhost/api/categorias
  ```
  Esperado: 401 Unauthorized `{"error":"Token ausente."}`

- [ ] **Token inválido retorna 401**
  ```bash
  curl http://localhost/api/categorias \
    -H "Authorization: Bearer INVALIDO"
  ```
  Esperado: 401 Unauthorized `{"error":"Token invalido."}`

- [ ] **Login com senha errada falha**
  ```bash
  curl -X POST http://localhost/api/login \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@gestoriq.com","senha":"ERRADA"}'
  ```
  Esperado: 401 `{"error":"Credenciais invalidas."}`

- [ ] **Email duplicado falha**
  ```bash
  curl -X POST http://localhost/api/usuarios \
    -H "Authorization: Bearer {TOKEN}" \
    -H "Content-Type: application/json" \
    -d '{"nome":"Test","email":"admin@gestoriq.com","senha":"123"}'
  ```
  Esperado: 400 Bad Request

---

### 💾 Testes de Persistência

- [ ] **Dados persistem após restart**
  ```bash
  # Comando 1: Criar categoria
  curl -X POST http://localhost/api/categorias \
    -H "Authorization: Bearer {TOKEN}" \
    -H "Content-Type: application/json" \
    -d '{"nome":"Categoria Persistência","descricao":"teste"}'
  
  # Comando 2: Reiniciar containers
  docker compose restart app postgres
  
  # Comando 3: Verificar categoria ainda existe
  curl http://localhost/api/categorias \
    -H "Authorization: Bearer {TOKEN}" \
    | grep "Categoria Persistência"
  ```
  Esperado: Categoria ainda existe após restart

- [ ] **Volume postgres_data existe**
  ```bash
  docker volume ls | grep postgres_data
  ```
  Esperado: `local     gestoriq_postgres_data`

- [ ] **Deletar container e reconstruir preserva dados**
  ```bash
  # Deletar tudo
  docker compose down -v
  
  # Recriar
  docker compose up -d
  
  # Verificar dados ainda existem
  curl http://localhost/api/categorias \
    -H "Authorization: Bearer {TOKEN}"
  ```
  ⚠️ **AVISO:** `-v` deleta volumes! Use `down` sem `-v` se quiser preservar dados

---

### 📚 Testes de Documentação

- [ ] **Swagger está completo**
  - [ ] Rota `/login` documentada
  - [ ] CRUD de categorias documentado (GET list, GET id, POST, PUT, DELETE)
  - [ ] CRUD de fornecedores documentado
  - [ ] CRUD de produtos documentado
  - [ ] CRUD de usuários documentado
  - [ ] Rotas de relação N:N documentadas

- [ ] **README possui informações completas**
  - [ ] Título e descrição
  - [ ] Seção de pré-requisitos
  - [ ] Como subir (docker compose up)
  - [ ] Como testar (curl ou Postman)
  - [ ] Rotas principais listadas
  - [ ] Login e JWT explicado
  - [ ] Migração/Seed explicado

---

### 📋 Testes de Documentação do Projeto

- [ ] **AUDITORIA_COMPLETA.md existe e está atualizado**
  - [ ] Status de cada componente listado
  - [ ] Matriz de conformidade
  - [ ] Riscos identificados

- [ ] **NORMALIZACAO.md documenta 1FN, 2FN, 3FN**

- [ ] **DICIONARIO_DADOS.md descreve todas as 5 tabelas**

- [ ] **DER.md contém diagrama visual**

- [ ] **INDICES.md documenta estratégia de indexação**

- [ ] **TESTE_POSTMAN.md contém roteiro de testes**

- [ ] **APRESENTACAO.md tem script para banca**

- [ ] **queries.sql contém 6+ consultas críticas**

- [ ] **seed.sql contém 100+ registros**

- [ ] **command.js permite migrations** (`node command.js migrate`)

---

### 🎓 Checklist de Conformidade com PDFs

#### PDF 1: Banco de Dados

- [ ] PostgreSQL configurado ✅
- [ ] 5 tabelas (usuarios, categorias, fornecedores, produtos, produto_fornecedor) ✅
- [ ] Tabela usuários com email UNIQUE ✅
- [ ] Senhas hasheadas (PBKDF2, não bcrypt) ⚠️
- [ ] Tabela pivô com relação N:N ✅
- [ ] Normalização 1FN documentada ✅
- [ ] Normalização 2FN documentada ✅
- [ ] Normalização 3FN documentada ✅
- [ ] 6+ consultas críticas em queries.sql ✅
- [ ] 100+ registros de teste em seed.sql ✅
- [ ] DER e diagramas criados ✅
- [ ] Dicionário de dados completo ✅
- [ ] Índices documentados ✅

#### PDF 2: Infraestrutura

- [ ] Dockerfile multi-stage build ✅
- [ ] .dockerignore otimizado ✅
- [ ] docker-compose.yml com 3+ serviços ✅
- [ ] Nginx como reverse proxy ✅
- [ ] App privado (expose, não ports) ✅
- [ ] Banco privado (sem ports) ✅
- [ ] Custom bridge networks ✅
- [ ] Named Volumes para persistência ✅
- [ ] Health checks em todos serviços ✅
- [ ] README com 7 seções ✅
- [ ] Evidências CLI documentadas ⚠️
- [ ] Prova de persistência testada ✅
- [ ] Prova de segurança testada ✅
- [ ] Video de demonstração (não existe) ❌

#### PDF 3: Desenvolvimento Web

- [ ] Node.js 24+ ✅
- [ ] PostgreSQL 17+ ✅
- [ ] Express framework ✅
- [ ] 4+ tabelas ✅
- [ ] Tabela usuários com bcrypt ⚠️ (PBKDF2 em vez disso)
- [ ] Tabela pivô ✅
- [ ] Relação N:N ✅
- [ ] CRUD 5 rotas por entidade ✅
- [ ] Rota POST /login com JWT ✅
- [ ] Todas rotas protegidas exceto login ✅
- [ ] Middleware customizado (auth.js) ✅
- [ ] docker compose up --build funciona ✅
- [ ] Nginx como reverse proxy ✅
- [ ] Node.js privado ✅
- [ ] Swagger documentação ✅
- [ ] command.js para migrations ✅
- [ ] README completo ✅

---

### ⚠️ Itens Críticos (Podem Causar Perda de Pontos)

| Item | Status | Risco | Solução |
|------|--------|-------|---------|
| `docker compose up --build` sem erro | ✅ | CRÍTICO | Testar antes |
| `/health` retorna 200 | ✅ | CRÍTICO | Testar com curl |
| JWT autenticação funciona | ✅ | CRÍTICO | Testar login e requisição |
| Banco persistindo | ✅ | CRÍTICO | Testar restart |
| CRUD completo funcionando | ✅ | CRÍTICO | Testar POST/PUT/DELETE |
| Normalização documentada | ✅ | ALTA | Ver NORMALIZACAO.md |
| Dados de teste (100+) | ✅ | ALTA | Contar registros |
| 6+ consultas SQL | ✅ | ALTA | Ver queries.sql |
| command.js migration | ✅ | ALTA | Testar `node command.js migrate` |
| Bcrypt vs PBKDF2 | ⚠️ | MÉDIA | Prepared justificativa |

---

### 🎬 Ordem de Execução no Dia da Apresentação

1. **Começar com**: `docker compose up --build` (take 5 min para compilar)
2. **Enquanto compila**: Explicar arquitetura
3. **Após build**: Testar `docker compose ps`
4. **Testar**: Health check, Swagger, Login
5. **Demonstrar**: CRUD e relação N:N
6. **Finalizar**: Restart containers e mostrar persistência

---

### 📱 Comandos Rápidos para Ter na Mão

```bash
# Subir tudo
docker compose up --build -d

# Ver status
docker compose ps

# Ver logs
docker compose logs -f app

# Testar
curl http://localhost/health

# Limpar (CUIDADO - deleta dados!)
docker compose down -v

# Parar sem perder dados
docker compose stop

# Resumir
docker compose start
```

---

### 🏁 Checklist Final (30 min antes de apresentar)

- [ ] Docker Desktop está rodando
- [ ] `docker compose up -d` foi executado com sucesso
- [ ] Todos 3 containers estão healthy
- [ ] http://localhost/health retorna 200
- [ ] http://localhost/api-docs carrega Swagger
- [ ] Login funciona e retorna token
- [ ] GET /api/categorias retorna 15+ registros
- [ ] GET /api/fornecedores retorna 20+ registros
- [ ] GET /api/produtos retorna 60+ registros
- [ ] Relação N:N funciona (/produtos/1/fornecedores)
- [ ] Sem token retorna 401
- [ ] Token inválido retorna 401
- [ ] Criar recurso (POST) funciona
- [ ] Atualizar recurso (PUT) funciona
- [ ] Deletar recurso (DELETE) funciona
- [ ] Documentação está completa
- [ ] Script de apresentação foi lido

---

**Se tudo está ✅: Você está pronto para apresentar!**

**Se algo está ❌: Não comece a apresentação até corrigir.**

Boa sorte! 🚀
