const { Survey, Subject, Answer } = require('../models');

/**
 * --------------------------
 * Method that checks if
 * the connected user is
 * the author of survey
 * --------------------------
 */
async function isItUserSurvey(userId, surveyId) {
  const survey = await Survey.findOne({
    where: { id: surveyId },
  });

  if (!survey || survey.dataValues.userId !== userId) return false;

  return true;
}

/**
 * --------------------------
 * Method that checks if
 * the connected user is
 * the author of subject
 * --------------------------
 */
async function isItUserSubject(userId, subjectId) {
  const subject = await Subject.findOne({
    where: { id: subjectId },
    include: [
      {
        model: Survey,
      },
    ],
  });

  if (!subject || subject.Survey.dataValues.userId !== userId) return false;

  return true;
}

/**
 * --------------------------
 * Method that checks if
 * the connected user is
 * the author of answer
 * --------------------------
 */
async function isItUserAnswer(userId, answerId) {
  const answer = await Answer.findOne({
    where: { id: answerId },
    include: [
      {
        model: Subject,
        include: [
          {
            model: Survey,
          },
        ],
      },
    ],
  });

  if (!answer || answer.Subject.Survey.dataValues.userId !== userId) return false;

  return true;
}

module.exports = { isItUserSurvey, isItUserSubject, isItUserAnswer };
