const { createCrudController } = require('./crudController');
const supplierService = require('../services/supplierService');

module.exports = createCrudController(supplierService, 'fornecedor');
