const { Product } = require('../models');

const allowedFields = ['nome', 'descricao', 'preco', 'quantidade_estoque', 'categoria_id'];
const requiredFields = ['nome', 'preco', 'quantidade_estoque', 'categoria_id'];

function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function validatePayload(payload, { partial = false } = {}) {
  if (!payload || typeof payload !== 'object') {
    throw createError('Dados do produto sao obrigatorios.', 400);
  }

  const data = {};

  allowedFields.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(payload, field)) {
      data[field] = payload[field];
    }
  });

  if (Object.keys(data).length === 0) {
    throw createError('Informe ao menos um campo valido do produto.', 400);
  }

  if (!partial) {
    requiredFields.forEach((field) => {
      if (data[field] === undefined || data[field] === null || data[field] === '') {
        throw createError(`O campo ${field} e obrigatorio.`, 400);
      }
    });
  }

  if (data.nome !== undefined) {
    data.nome = String(data.nome).trim();

    if (data.nome === '') {
      throw createError('O nome do produto nao pode ser vazio.', 400);
    }
  }

  if (data.preco !== undefined) {
    data.preco = Number(data.preco);

    if (Number.isNaN(data.preco) || data.preco < 0) {
      throw createError('O preco do produto deve ser maior ou igual a zero.', 400);
    }
  }

  if (data.quantidade_estoque !== undefined) {
    data.quantidade_estoque = Number(data.quantidade_estoque);

    if (!Number.isInteger(data.quantidade_estoque) || data.quantidade_estoque < 0) {
      throw createError('A quantidade em estoque deve ser um numero inteiro maior ou igual a zero.', 400);
    }
  }

  if (data.categoria_id !== undefined) {
    data.categoria_id = Number(data.categoria_id);

    if (!Number.isInteger(data.categoria_id) || data.categoria_id <= 0) {
      throw createError('A categoria do produto deve ser um ID valido.', 400);
    }
  }

  return data;
}

function buildFilters(query = {}) {
  const where = {};

  if (query.categoria_id !== undefined) {
    const categoriaId = Number(query.categoria_id);

    if (!Number.isInteger(categoriaId) || categoriaId <= 0) {
      throw createError('Filtro categoria_id invalido.', 400);
    }

    where.categoria_id = categoriaId;
  }

  return where;
}

async function listProducts(query = {}) {
  return Product.findAll({
    where: buildFilters(query),
    order: [['id', 'ASC']],
  });
}

async function getProductById(id) {
  const product = await Product.findByPk(id);

  if (!product) {
    throw createError('Produto nao encontrado.', 404);
  }

  return product;
}

async function createProduct(payload) {
  const data = validatePayload(payload);
  return Product.create(data);
}

async function updateProduct(id, payload) {
  const data = validatePayload(payload, { partial: true });
  const product = await getProductById(id);

  return product.update(data);
}

async function deleteProduct(id) {
  const product = await getProductById(id);
  await product.destroy();
}

module.exports = {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
