const express = require('express');
const poolController = require('../controllers/poolController');

const poolRouter = express.Router();

poolRouter.get('/', poolController.getAllPools);

module.exports = poolRouter;
