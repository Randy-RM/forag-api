const participationRouter = require('express').Router();
const { authJwt } = require('../middlewares/index');
const participationController = require('../controllers/participationController');

// Get all participation according to survey.
participationRouter.get('/survey/:surveyId', participationController.getAllParticipationsSurvey);

// Get all participation according to subjects.
participationRouter.get(
  '/survey/subject/:subjectId',
  participationController.getAllParticipationsSubject
);

// Get all participation according to subjects.
participationRouter.get(
  '/survey/subject/answer/:answerId',
  participationController.getAllSelectedAnswerByIdAnswer
);

//
participationRouter.post(
  '/',
  [authJwt.verifyToken, authJwt.isUser],
  participationController.selectAnswer
);

module.exports = participationRouter;
