const productService = require('../services/productService');
const { createCrudController } = require('./crudController');
const { parseId, sendError } = require('../utils/http');

const crud = createCrudController(productService, 'produto');

async function listSuppliers(req, res) {
  try {
    const suppliers = await productService.listSuppliers(parseId(req.params.id, 'ID do produto'));
    return res.status(200).json(suppliers);
  } catch (error) {
    return sendError(res, error);
  }
}

async function addSupplier(req, res) {
  try {
    const supplierId = parseId(req.body.fornecedor_id, 'ID do fornecedor');
    const association = await productService.addSupplier(parseId(req.params.id, 'ID do produto'), supplierId);
    return res.status(201).json(association);
  } catch (error) {
    return sendError(res, error);
  }
}

async function removeSupplier(req, res) {
  try {
    await productService.removeSupplier(
      parseId(req.params.id, 'ID do produto'),
      parseId(req.params.fornecedor_id, 'ID do fornecedor'),
    );
    return res.status(204).send();
  } catch (error) {
    return sendError(res, error);
  }
}

module.exports = {
  listProducts: crud.list,
  getProductById: crud.getById,
  createProduct: crud.create,
  updateProduct: crud.update,
  deleteProduct: crud.remove,
  listSuppliers,
  addSupplier,
  removeSupplier,
};
