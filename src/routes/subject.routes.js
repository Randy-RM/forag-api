const subjectRouter = require('express').Router();
const { authJwt } = require('../middlewares/index');
const subjectController = require('../controllers/subjectController');

// Get one subject by id
subjectRouter.get('/:subjectId', subjectController.getOneSubjectById);

// Create new survey
subjectRouter.post('/', [authJwt.verifyToken, authJwt.isUser], subjectController.createSubject);

// Update survey by id
subjectRouter.put(
  '/:subjectId',
  [authJwt.verifyToken, authJwt.isUser],
  subjectController.updateSubject
);

module.exports = subjectRouter;
