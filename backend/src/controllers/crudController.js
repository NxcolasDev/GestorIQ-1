const { parseId, sendError } = require('../utils/http');

function createCrudController(service, label) {
  async function list(req, res) {
    try {
      const data = await service.list(req.query);
      return res.status(200).json(data);
    } catch (error) {
      return sendError(res, error);
    }
  }

  async function getById(req, res) {
    try {
      const data = await service.getById(parseId(req.params.id, `ID de ${label}`));
      return res.status(200).json(data);
    } catch (error) {
      return sendError(res, error);
    }
  }

  async function create(req, res) {
    try {
      const data = await service.create(req.body);
      return res.status(201).json(data);
    } catch (error) {
      return sendError(res, error);
    }
  }

  async function update(req, res) {
    try {
      const data = await service.update(parseId(req.params.id, `ID de ${label}`), req.body);
      return res.status(200).json(data);
    } catch (error) {
      return sendError(res, error);
    }
  }

  async function remove(req, res) {
    try {
      await service.remove(parseId(req.params.id, `ID de ${label}`));
      return res.status(204).send();
    } catch (error) {
      return sendError(res, error);
    }
  }

  return {
    list,
    getById,
    create,
    update,
    remove,
  };
}

module.exports = {
  createCrudController,
};
