const participationRouter = require('express').Router();
const participationController = require('../controllers/participationController');

participationRouter.post('/', participationController.selectAnswer);

module.exports = participationRouter;
