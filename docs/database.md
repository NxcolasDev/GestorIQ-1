# Database do GestorIQ

## Modelo de dados
O banco utiliza PostgreSQL com três modelos principais:
- `User`: usuários do sistema, validação de login e cadastro.
- `Product`: produtos do estoque, com SKU, preço, descrição e quantidade.
- `StockMovement`: registros de movimentação de estoque para auditar entradas, saídas e ajustes.

## ORM
- Sequelize é usado para definir modelos e estabelecer relações.
- A conexão é configurada em `src/config/database.js`.
- O app pode sincronizar o esquema automaticamente em desenvolvimento quando `DB_SYNC=true`.

## Regras de persistência
- `users` mantêm senha com hash e email único.
- `products` mantêm quantidade e preço.
- `stock_movements` registram histórico de alterações de estoque.
