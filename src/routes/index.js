const authRouter = require('./auth.routes');
const userRouter = require('./user.routes');
const surveyRouter = require('./survey.routes');
const subjectRouter = require('./subject.routes');
const answerRouter = require('./answer.routes');

module.exports = {
  authRouter,
  userRouter,
  surveyRouter,
  subjectRouter,
  answerRouter,
};
