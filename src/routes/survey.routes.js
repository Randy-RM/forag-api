const express = require('express');
const { authJwt } = require('../middlewares/index');
const surveyController = require('../controllers/surveyController');

const surveyRouter = express.Router();

surveyRouter.get('/', surveyController.getAllSurveys);

surveyRouter.get('/user/:userId', surveyController.getAllSurveysOfUser);

surveyRouter.get('/:surveyId', surveyController.getOneSurveyById);

surveyRouter.get('/published', surveyController.findAllPublishedSurveys);

surveyRouter.get('/user/:userId/published', surveyController.findAllUserPublishedSurveys);

surveyRouter.post('/', [authJwt.verifyToken, authJwt.isUser], surveyController.createSurvey);

surveyRouter.put(
  '/:surveyId',
  [authJwt.verifyToken, authJwt.isUser],
  surveyController.updateSurvey
);

surveyRouter.delete(
  '/:surveyId',
  [authJwt.verifyToken, authJwt.isUser],
  surveyController.deleteSurvey
);

surveyRouter.delete('/', [authJwt.verifyToken, authJwt.isAdmin], surveyController.deleteAllSurveys);

surveyRouter.delete(
  '/user/:userId',
  [authJwt.verifyToken, authJwt.isUser],
  surveyController.deleteAllSurveysOfUser
);

module.exports = surveyRouter;
