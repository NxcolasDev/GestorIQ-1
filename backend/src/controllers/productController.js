const productService = require('../services/productService');

function parseId(id) {
  const parsedId = Number(id);

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    const error = new Error('ID do produto invalido.');
    error.statusCode = 400;
    throw error;
  }

  return parsedId;
}

function sendError(res, error) {
  const statusCode = error.statusCode || 500;

  return res.status(statusCode).json({
    error: error.message || 'Erro interno do servidor.',
  });
}

async function listProducts(req, res) {
  try {
    const products = await productService.listProducts();
    return res.status(200).json(products);
  } catch (error) {
    return sendError(res, error);
  }
}

async function getProductById(req, res) {
  try {
    const product = await productService.getProductById(parseId(req.params.id));
    return res.status(200).json(product);
  } catch (error) {
    return sendError(res, error);
  }
}

async function createProduct(req, res) {
  try {
    const product = await productService.createProduct(req.body);
    return res.status(201).json(product);
  } catch (error) {
    return sendError(res, error);
  }
}

async function updateProduct(req, res) {
  try {
    const product = await productService.updateProduct(parseId(req.params.id), req.body);
    return res.status(200).json(product);
  } catch (error) {
    return sendError(res, error);
  }
}

async function deleteProduct(req, res) {
  try {
    await productService.deleteProduct(parseId(req.params.id));
    return res.status(204).send();
  } catch (error) {
    return sendError(res, error);
  }
}

module.exports = {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
