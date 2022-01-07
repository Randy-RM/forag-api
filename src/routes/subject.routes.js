const subjectRouter = require('express').Router();

const subjectController = require('../controllers/subjectController');

subjectRouter.get('/:subjectId', subjectController.getOneSubjectById);

module.exports = subjectRouter;
