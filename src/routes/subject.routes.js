const subjectRouter = require('express').Router();

const subjectController = require('../controllers/subjectController');

subjectRouter.get('/:subjectId', subjectController.getOneSubjectById);

// Create new survey
subjectRouter.post('/', subjectController.createSubject);

module.exports = subjectRouter;
