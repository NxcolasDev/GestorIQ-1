# API do GestorIQ

## Endpoints principais

### Autenticação
- `POST /api/auth/register` - cria um usuário.
- `POST /api/auth/login` - autentica e retorna token JWT.

### Produtos
- `GET /api/produtos` - lista produtos.
- `GET /api/produtos/:id` - retorna produto por id.
- `POST /api/produtos` - cria produto (requer token).
- `PUT /api/produtos/:id` - atualiza produto (requer token).
- `DELETE /api/produtos/:id` - remove produto (requer token).

## Documentação Swagger
- UI em `/api-docs`

## Autenticação
- A API usa JWT em `Authorization: Bearer <token>` para proteger rotas de produto.
