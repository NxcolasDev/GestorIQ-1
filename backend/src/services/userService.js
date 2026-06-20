const { query } = require('../config/database');
const { hashPassword } = require('../utils/password');

const publicFields = 'id, nome, email, created_at, updated_at';

function validatePayload(payload, { partial = false } = {}) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    const error = new Error('Dados do usuario sao obrigatorios.');
    error.statusCode = 400;
    throw error;
  }

  for (const field of ['nome', 'email', 'senha']) {
    if (!partial && !payload[field]) {
      const error = new Error(`Campo obrigatorio ausente: ${field}.`);
      error.statusCode = 400;
      throw error;
    }
  }
}

async function list() {
  const result = await query(`SELECT ${publicFields} FROM usuarios ORDER BY id`);
  return result.rows;
}

async function getById(id) {
  const result = await query(`SELECT ${publicFields} FROM usuarios WHERE id = $1`, [id]);

  if (result.rowCount === 0) {
    const error = new Error('Usuario nao encontrado.');
    error.statusCode = 404;
    throw error;
  }

  return result.rows[0];
}

async function create(payload) {
  validatePayload(payload);
  const result = await query(
    `INSERT INTO usuarios (nome, email, senha_hash)
     VALUES ($1, $2, $3)
     RETURNING ${publicFields}`,
    [payload.nome, payload.email, hashPassword(payload.senha)],
  );

  return result.rows[0];
}

async function update(id, payload) {
  validatePayload(payload, { partial: true });
  const fields = [];
  const values = [];

  for (const field of ['nome', 'email']) {
    if (payload[field] !== undefined) {
      values.push(payload[field]);
      fields.push(`${field} = $${values.length}`);
    }
  }

  if (payload.senha !== undefined) {
    values.push(hashPassword(payload.senha));
    fields.push(`senha_hash = $${values.length}`);
  }

  if (fields.length === 0) {
    const error = new Error('Nenhum campo valido informado.');
    error.statusCode = 400;
    throw error;
  }

  values.push(id);
  const result = await query(
    `UPDATE usuarios
     SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
     WHERE id = $${values.length}
     RETURNING ${publicFields}`,
    values,
  );

  if (result.rowCount === 0) {
    const error = new Error('Usuario nao encontrado.');
    error.statusCode = 404;
    throw error;
  }

  return result.rows[0];
}

async function remove(id) {
  const result = await query('DELETE FROM usuarios WHERE id = $1', [id]);

  if (result.rowCount === 0) {
    const error = new Error('Usuario nao encontrado.');
    error.statusCode = 404;
    throw error;
  }
}

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
};
