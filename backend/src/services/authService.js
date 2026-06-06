const bcrypt = require('bcryptjs');
const { User } = require('../models');

async function registerUser(userData) {
  const existingUser = await User.findOne({
    where: {
      email: userData.email,
    },
  });

  if (existingUser) {
    throw new Error('Email já cadastrado');
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const user = await User.create({
    name: userData.name,
    email: userData.email,
    password: hashedPassword,
    role: userData.role || 'viewer',
  });

  return user;
}

module.exports = {
  registerUser,
};