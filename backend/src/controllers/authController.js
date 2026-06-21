const authService = require('../services/authService');
const { sendError } = require('../utils/http');

async function login(req, res) {
  try {
    const response = await authService.login(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return sendError(res, error);
  }
}

async function register(req, res) {
  try {
    const user = await authService.register(req.body);
    return res.status(201).json(user);
  } catch (error) {
    return sendError(res, error);
  }
}

module.exports = {
  login,
  register,
};
