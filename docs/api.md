# API do GestorIQ

## Status

- `GET /` - status geral da aplicacao.
- `GET /health` - health check usado pelo Docker e pelo Nginx.
- `GET /api-docs` - Swagger UI.

## Autenticacao

- `POST /api/login` - autentica usuario e retorna JWT.
- `POST /api/auth/login` - alias de login.
- `POST /api/auth/register` - cria usuario inicial quando necessario.

Usuario padrao criado automaticamente quando `DB_SYNC=true`:

```json
{
  "email": "admin@gestoriq.com",
  "senha": "senha123"
}
```

Use o token nas rotas protegidas:

```http
Authorization: Bearer <token>
```

## CRUDs protegidos por JWT

- `/api/usuarios`
- `/api/categorias`
- `/api/fornecedores`
- `/api/produtos`

Cada recurso aceita:

- `GET /`
- `GET /:id`
- `POST /`
- `PUT /:id`
- `DELETE /:id`

## Relacao produto-fornecedor

- `GET /api/produtos/:id/fornecedores`
- `POST /api/produtos/:id/fornecedores`
- `DELETE /api/produtos/:id/fornecedores/:fornecedor_id`
