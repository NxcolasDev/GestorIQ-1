# Workflow do GestorIQ

## Desenvolvimento
1. Atualize `.env` a partir de `.env.example`.
2. Inicie a aplicação com `npm run dev` ou `docker compose up --build`.
3. Use o Swagger em `/api-docs` para validar endpoints.

## Estrutura de desenvolvimento
- `src/routes/`: rotas REST.
- `src/controllers/`: lógica de requisição/resposta.
- `src/services/`: lógica de negócio.
- `src/repositories/`: acesso ao banco.
- `src/models/`: definição de entidades.
- `src/middlewares/`: autenticação e tratamento de erros.
- `src/validators/`: regras de validação de entrada.

## Fluxo de mudança
1. Alterar modelo em `src/models`.
2. Atualizar repositório e serviço correspondente.
3. Ajustar controladores e rotas.
4. Testar com `npm run dev` e `POSTMAN`/Swagger.
