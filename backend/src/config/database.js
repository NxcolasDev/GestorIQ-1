const { Pool } = require('pg');
const { hashPassword } = require('../utils/password');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || 'gestoriq',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

async function query(text, params) {
  const result = await pool.query(text, params);
  return result;
}

async function initializeDatabase() {
  if (process.env.DB_SYNC === 'false') {
    return;
  }

  await query(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id SERIAL PRIMARY KEY,
      nome VARCHAR(120) NOT NULL,
      email VARCHAR(160) NOT NULL UNIQUE,
      senha_hash TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS categorias (
      id SERIAL PRIMARY KEY,
      nome VARCHAR(120) NOT NULL UNIQUE,
      descricao TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS fornecedores (
      id SERIAL PRIMARY KEY,
      nome VARCHAR(160) NOT NULL,
      cnpj VARCHAR(24) NOT NULL UNIQUE,
      telefone VARCHAR(40),
      email VARCHAR(160),
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS produtos (
      id SERIAL PRIMARY KEY,
      nome VARCHAR(160) NOT NULL,
      descricao TEXT,
      preco NUMERIC(12,2) NOT NULL CHECK (preco >= 0),
      quantidade_estoque INTEGER NOT NULL DEFAULT 0 CHECK (quantidade_estoque >= 0),
      categoria_id INTEGER NOT NULL REFERENCES categorias(id) ON DELETE RESTRICT,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS produto_fornecedor (
      produto_id INTEGER NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
      fornecedor_id INTEGER NOT NULL REFERENCES fornecedores(id) ON DELETE CASCADE,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (produto_id, fornecedor_id)
    );
  `);

  await seedAdminUser();
}

async function seedAdminUser() {
  const email = process.env.ADMIN_EMAIL || 'admin@gestoriq.com';
  const exists = await query('SELECT id FROM usuarios WHERE email = $1', [email]);

  if (exists.rowCount > 0) {
    return;
  }

  await query(
    'INSERT INTO usuarios (nome, email, senha_hash) VALUES ($1, $2, $3)',
    [
      process.env.ADMIN_NAME || 'Administrador',
      email,
      hashPassword(process.env.ADMIN_PASSWORD || 'senha123'),
    ],
  );
}

module.exports = {
  pool,
  query,
  initializeDatabase,
};
