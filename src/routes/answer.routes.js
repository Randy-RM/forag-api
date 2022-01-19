const answerRouter = require('express').Router();
const { authJwt } = require('../middlewares/index');
const answerController = require('../controllers/answerController');

// Get all answers.
answerRouter.get('/', answerController.getAllAnswers);

// Get all answers according to subjectId.
answerRouter.get('/subject/:subjectId', answerController.getAllSubjectAnswers);

// Get one answer by id.
answerRouter.get('/:answerId', answerController.getOneAnswerById);

// Create new answer.
answerRouter.post('/', [authJwt.verifyToken, authJwt.isUser], answerController.createAnswer);

// Update answer by id.
answerRouter.put(
  '/:answerId',
  [authJwt.verifyToken, authJwt.isUser],
  answerController.updateAnswer
);

module.exports = answerRouter;
