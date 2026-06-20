const { createCrudController } = require('./crudController');
const categoryService = require('../services/categoryService');

module.exports = createCrudController(categoryService, 'categoria');
