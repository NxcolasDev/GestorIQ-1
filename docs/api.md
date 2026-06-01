# API do GestorIQ

## Endpoints principais

### Autenticação
- `POST /api/auth/register` - cria um usuário.
- `POST /api/auth/login` - autentica e retorna token JWT.

### Produtos
- `GET /api/products` - lista produtos.
- `GET /api/products/:id` - retorna produto por id.
- `POST /api/products` - cria produto (requer token).
- `PUT /api/products/:id` - atualiza produto (requer token).
- `DELETE /api/products/:id` - remove produto (requer token).

## Documentação Swagger
- UI em `/api-docs`

## Autenticação
- A API usa JWT em `Authorization: Bearer <token>` para proteger rotas de produto.
