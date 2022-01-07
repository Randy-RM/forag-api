const surveyRouter = require('express').Router();

const { authJwt, validateInputSurvey, validateInputSubjectTable } = require('../middlewares/index');
const surveyController = require('../controllers/surveyController');

// Get all surveys
surveyRouter.get(
  '/',
  [authJwt.verifyToken, authJwt.isAdmin, authJwt.verifyPermission],
  surveyController.getAllSurveys
);

// Get all surveys published
surveyRouter.get('/published', surveyController.getAllSurveysPublished);

// Get one survey by id
surveyRouter.get('/:surveyId', surveyController.getOneSurveyById);

// Get all user surveys, published surveys and unpublished
surveyRouter.get(
  '/user/:userId',
  [authJwt.verifyToken, authJwt.isUser, authJwt.verifyPermission],
  surveyController.getAllUserSurveys
);

// Get all user published surveys
surveyRouter.get('/published/user/:userId', surveyController.getAllUserSurveysPublished);

// Create new survey
surveyRouter.post(
  '/',
  [
    authJwt.verifyToken,
    authJwt.isUser,
    validateInputSurvey('surveyTitle'),
    validateInputSubjectTable,
  ],
  surveyController.createSurvey
);

// Update survey by id
surveyRouter.put(
  '/:surveyId',
  [authJwt.verifyToken, authJwt.isUser, authJwt.verifyPermission],
  surveyController.updateSurvey
);

// Delete all surveys
surveyRouter.delete('/', [authJwt.verifyToken, authJwt.isAdmin], surveyController.deleteAllSurveys);

// Delete survey by id
surveyRouter.delete(
  '/:surveyId',
  [authJwt.verifyToken, authJwt.isUser],
  surveyController.deleteSurvey
);

// Delete all surveys of user
surveyRouter.delete(
  '/user/:userId',
  [authJwt.verifyToken, authJwt.isUser],
  surveyController.deleteAllSurveysOfUser
);

module.exports = surveyRouter;
