# Instalacao e Validacao do GestorIQ

## 1. Pre-requisitos

- Docker Desktop instalado.
- Docker Desktop aberto e com status "running".
- Docker Compose disponivel no terminal.
- Porta `80` livre na maquina.

Verifique:

```bash
docker info
docker compose version
```

Se `docker info` retornar erro, abra o Docker Desktop manualmente e aguarde iniciar.

## 2. Variaveis de ambiente

O arquivo `backend/.env` ja existe para ambiente local. Se precisar recriar:

```bash
copy backend\.env.example backend\.env
```

Valores importantes:

- `DB_HOST=postgres`
- `DB_PORT=5432`
- `DB_NAME=gestoriq`
- `DB_USER=postgres`
- `DB_PASSWORD=postgres`
- `JWT_SECRET=change_this_secret`
- `DB_SYNC=true`
- `ADMIN_EMAIL=admin@gestoriq.com`
- `ADMIN_PASSWORD=senha123`

## 3. Subir o projeto

```bash
docker compose build app
docker compose up -d
docker compose ps
```

Resultado esperado:

- `gestoriq_postgres` com status healthy.
- `gestoriq_app` com status healthy.
- `gestoriq_nginx` com status healthy.
- Apenas o Nginx publicado em `0.0.0.0:80->80/tcp`.

## 4. Testes essenciais

Health check:

```bash
curl http://localhost/health
```

Swagger:

```bash
curl http://localhost/api-docs
```

Login JWT:

```bash
curl -X POST http://localhost/api/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@gestoriq.com\",\"senha\":\"senha123\"}"
```

Copie o valor de `token` retornado e use nas rotas protegidas.

Criar categoria:

```bash
curl -X POST http://localhost/api/categorias ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer SEU_TOKEN" ^
  -d "{\"nome\":\"Eletronicos\",\"descricao\":\"Produtos eletronicos\"}"
```

Listar categorias:

```bash
curl http://localhost/api/categorias -H "Authorization: Bearer SEU_TOKEN"
```

Criar fornecedor:

```bash
curl -X POST http://localhost/api/fornecedores ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer SEU_TOKEN" ^
  -d "{\"nome\":\"Tech Distribuidora\",\"cnpj\":\"12.345.678/0001-99\",\"email\":\"contato@tech.com\"}"
```

Criar produto:

```bash
curl -X POST http://localhost/api/produtos ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer SEU_TOKEN" ^
  -d "{\"nome\":\"Notebook\",\"descricao\":\"Notebook i7\",\"preco\":3499.90,\"quantidade_estoque\":10,\"categoria_id\":1}"
```

Associar fornecedor ao produto:

```bash
curl -X POST http://localhost/api/produtos/1/fornecedores ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer SEU_TOKEN" ^
  -d "{\"fornecedor_id\":1}"
```

## 5. Validar PostgreSQL

```bash
docker compose exec postgres psql -U postgres -d gestoriq -c "\dt"
```

Tabelas esperadas:

- `usuarios`
- `categorias`
- `fornecedores`
- `produtos`
- `produto_fornecedor`

## 6. Validar isolamento

O PostgreSQL nao deve estar exposto no host:

```bash
docker compose ps
```

Somente o Nginx deve publicar porta externa.

## 7. Parar o projeto

```bash
docker compose down
```

Para apagar dados do banco:

```bash
docker compose down -v
```

Use `down -v` apenas quando quiser reiniciar o banco do zero.
