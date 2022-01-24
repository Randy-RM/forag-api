const participationRouter = require('express').Router();
const { authJwt } = require('../middlewares/index');
const participationController = require('../controllers/participationController');

participationRouter.post(
  '/',
  [authJwt.verifyToken, authJwt.isUser],
  participationController.selectAnswer
);

module.exports = participationRouter;
