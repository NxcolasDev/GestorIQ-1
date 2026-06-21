const { query } = require('../config/database');

function ensurePayload(payload, requiredFields = [], { partial = false } = {}) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    const error = new Error('Dados da requisicao sao obrigatorios.');
    error.statusCode = 400;
    throw error;
  }

  if (!partial) {
    for (const field of requiredFields) {
      if (payload[field] === undefined || payload[field] === null || payload[field] === '') {
        const error = new Error(`Campo obrigatorio ausente: ${field}.`);
        error.statusCode = 400;
        throw error;
      }
    }
  }
}

function pick(payload, allowedFields) {
  return allowedFields.reduce((data, field) => {
    if (payload[field] !== undefined) {
      data[field] = payload[field];
    }

    return data;
  }, {});
}

function createCrudService({ table, allowedFields, requiredFields, publicFields = allowedFields }) {
  const returning = ['id', ...publicFields, 'created_at', 'updated_at'].join(', ');

  async function list(filter = {}) {
    if (filter.categoria_id && table === 'produtos') {
      const result = await query(
        `SELECT ${returning} FROM produtos WHERE categoria_id = $1 ORDER BY id`,
        [filter.categoria_id],
      );
      return result.rows;
    }

    const result = await query(`SELECT ${returning} FROM ${table} ORDER BY id`);
    return result.rows;
  }

  async function getById(id) {
    const result = await query(`SELECT ${returning} FROM ${table} WHERE id = $1`, [id]);

    if (result.rowCount === 0) {
      const error = new Error('Registro nao encontrado.');
      error.statusCode = 404;
      throw error;
    }

    return result.rows[0];
  }

  async function create(payload) {
    ensurePayload(payload, requiredFields);
    const data = pick(payload, allowedFields);
    const fields = Object.keys(data);
    const placeholders = fields.map((_, index) => `$${index + 1}`).join(', ');
    const values = fields.map((field) => data[field]);

    const result = await query(
      `INSERT INTO ${table} (${fields.join(', ')}) VALUES (${placeholders}) RETURNING ${returning}`,
      values,
    );

    return result.rows[0];
  }

  async function update(id, payload) {
    ensurePayload(payload, requiredFields, { partial: true });
    const data = pick(payload, allowedFields);
    const fields = Object.keys(data);

    if (fields.length === 0) {
      const error = new Error('Nenhum campo valido informado.');
      error.statusCode = 400;
      throw error;
    }

    const assignments = fields.map((field, index) => `${field} = $${index + 1}`);
    const values = fields.map((field) => data[field]);
    values.push(id);

    const result = await query(
      `UPDATE ${table}
       SET ${assignments.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $${values.length}
       RETURNING ${returning}`,
      values,
    );

    if (result.rowCount === 0) {
      const error = new Error('Registro nao encontrado.');
      error.statusCode = 404;
      throw error;
    }

    return result.rows[0];
  }

  async function remove(id) {
    const result = await query(`DELETE FROM ${table} WHERE id = $1`, [id]);

    if (result.rowCount === 0) {
      const error = new Error('Registro nao encontrado.');
      error.statusCode = 404;
      throw error;
    }
  }

  return {
    list,
    getById,
    create,
    update,
    remove,
  };
}

module.exports = {
  createCrudService,
};
