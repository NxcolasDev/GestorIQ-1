const { createCrudController } = require('./crudController');
const userService = require('../services/userService');

module.exports = createCrudController(userService, 'usuario');
