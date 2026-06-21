# Database do GestorIQ

## Banco

O projeto usa PostgreSQL em container Docker, acessado pela API Node.js por DNS interno:

- host: `postgres`
- porta: `5432`
- database: `gestoriq`
- usuario: `postgres`

## Tabelas

- `usuarios`: usuarios da API e credenciais com hash PBKDF2.
- `categorias`: categorias dos produtos.
- `fornecedores`: fornecedores cadastrados.
- `produtos`: produtos do estoque, ligados a uma categoria.
- `produto_fornecedor`: tabela pivo N:N entre produtos e fornecedores.

## Inicializacao

Quando `DB_SYNC=true`, a API cria as tabelas automaticamente no startup usando `backend/src/config/database.js`.

Tambem e criado um usuario administrador padrao, configurado por:

- `ADMIN_NAME`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

## Persistencia

O PostgreSQL usa o volume `postgres_data`, definido no `docker-compose.yml`, para manter os dados mesmo se o container for recriado.
