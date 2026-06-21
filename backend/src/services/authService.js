const jwt = require('jsonwebtoken');
const { query } = require('../config/database');
const { verifyPassword } = require('../utils/password');
const userService = require('./userService');

async function login({ email, senha }) {
  if (!email || !senha) {
    const error = new Error('Email e senha sao obrigatorios.');
    error.statusCode = 400;
    throw error;
  }

  const result = await query('SELECT id, nome, email, senha_hash FROM usuarios WHERE email = $1', [email]);

  if (result.rowCount === 0 || !verifyPassword(senha, result.rows[0].senha_hash)) {
    const error = new Error('Credenciais invalidas.');
    error.statusCode = 401;
    throw error;
  }

  const user = result.rows[0];
  const token = jwt.sign(
    { id: user.id, nome: user.nome, email: user.email },
    process.env.JWT_SECRET || 'change_this_secret',
    { expiresIn: '24h' },
  );

  return { token };
}

async function register(payload) {
  return userService.create(payload);
}

module.exports = {
  login,
  register,
};
