const participationRouter = require('express').Router();
const { authJwt } = require('../middlewares/index');
const participationController = require('../controllers/participationController');

// Get all subjects.
participationRouter.get('/survey/:surveyId', participationController.getParticipationsSurvey);

//
participationRouter.post(
  '/',
  [authJwt.verifyToken, authJwt.isUser],
  participationController.selectAnswer
);

module.exports = participationRouter;
