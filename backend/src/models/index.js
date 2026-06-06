const sequelize = require('../config/database');
const UserModel = require('./User');

const User = UserModel(sequelize);

module.exports = {
  sequelize,
  User,
};