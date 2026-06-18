const sequelize = require('../config/database');
const UserModel = require('./User');
const ProductModel = require('./Product');

const User = UserModel(sequelize);
const Product = ProductModel(sequelize);

module.exports = {
  sequelize,
  User,
  Product,
};
