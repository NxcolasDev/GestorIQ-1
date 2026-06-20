function parseId(value, label = 'ID') {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    const error = new Error(`${label} invalido.`);
    error.statusCode = 400;
    throw error;
  }

  return id;
}

function sendError(res, error) {
  return res.status(error.statusCode || 500).json({
    error: error.message || 'Erro interno do servidor.',
  });
}

module.exports = {
  parseId,
  sendError,
};
