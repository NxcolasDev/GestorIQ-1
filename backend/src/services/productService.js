function getProductModel() {
  try {
    const models = require('../models');
    return models.Product || models.product || models;
  } catch (error) {
    const modelError = new Error('Model Product ainda nao foi configurado em src/models.');
    modelError.statusCode = 503;
    throw modelError;
  }
}

function validatePayload(payload, { partial = false } = {}) {
  if (!payload || typeof payload !== 'object') {
    const error = new Error('Dados do produto sao obrigatorios.');
    error.statusCode = 400;
    throw error;
  }

  if (!partial && Object.keys(payload).length === 0) {
    const error = new Error('Dados do produto sao obrigatorios.');
    error.statusCode = 400;
    throw error;
  }

  return payload;
}

async function listProducts() {
  const Product = getProductModel();
  return Product.findAll();
}

async function getProductById(id) {
  const Product = getProductModel();
  const product = await Product.findByPk(id);

  if (!product) {
    const error = new Error('Produto nao encontrado.');
    error.statusCode = 404;
    throw error;
  }

  return product;
}

async function createProduct(payload) {
  const Product = getProductModel();
  const data = validatePayload(payload);
  return Product.create(data);
}

async function updateProduct(id, payload) {
  const Product = getProductModel();
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
