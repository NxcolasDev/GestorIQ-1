const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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

async function loginUser(email, password) {
  const user = await User.findOne({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error('Credenciais inválidas');
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordValid) {
    throw new Error('Credenciais inválidas');
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '24h',
    }
  );

  return {
    token,
  };
}

module.exports = {
  registerUser,
  loginUser,
};