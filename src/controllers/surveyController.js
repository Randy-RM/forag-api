const { validationResult } = require('express-validator');
const { Survey, Subject, Answer, sequelize, Sequelize } = require('../models');
const { getPagination, getPagingData } = require('../utils/pagination');
const { createOrUpdateEntityById } = require('../utils/createOrUpdateEntity');
const { isItUserSurvey, isItUserSubject, isItUserAnswer } = require('../utils/isItForUser');

const { Op } = Sequelize;

/**
 * --------------------------
 * Find all surveys,
 * and all surveys whose status is published
 * or unpublished in database.
 * --------------------------
 */
async function getAllSurveys(req, res, next) {
  const { page, size, published } = req.query;
  const { limit, offset } = getPagination(page, size);

  try {
    // Recovers all surveys under certain conditions
    let surveys = false;

    if (+published === 1 || +published === 0) {
      surveys = await Survey.findAndCountAll({
        where: { isSurveyPublished: +published },
        limit: limit,
        offset: offset,
      });
    } else {
      surveys = await Survey.findAndCountAll({
        limit: limit,
        offset: offset,
      });
    }

    if (!surveys) return res.status(404).send({ message: 'Cannot find surveys' });

    const response = getPagingData(surveys, page, limit);
    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({
      message: err.message || 'Some error occurred while retrieving Surveys',
    });
  }
}

/**
 * --------------------------
 * Find a single surveys with an id
 * in the database.
 * --------------------------
 */
async function getOneSurveyById(req, res, next) {
  const { surveyId } = req.params;

  try {
    const survey = await Survey.findOne({
      where: { id: surveyId },
      include: [
        {
          model: Subject,
          include: [
            {
              model: Answer,
            },
          ],
        },
      ],
    });

    if (!survey)
      return res.status(404).send({ message: `Cannot find survey with id = ${surveyId}.` });

    return res.status(200).send(survey);
  } catch (err) {
    return res.status(500).send({
      error: err.message || 'Some error occurred while retrieving survey',
    });
  }
}

/**
 * --------------------------
 * Find all the surveys
 * created by a user in the database.
 * --------------------------
 */
async function getAllUserSurveys(req, res, next) {
  const { page, size, published } = req.query;
  const { userId } = req.params || req.body;
  const { limit, offset } = getPagination(page, size);

  try {
    // Recovers all surveys under certain conditions
    const surveys = await Survey.findAndCountAll({
      where:
        userId && published && (+published === 0 || +published === 1)
          ? { [Op.and]: [{ isSurveyPublished: +published }, { userId: userId }] }
          : { userId: userId },
      include: [
        {
          model: Subject,
          include: [
            {
              model: Answer,
            },
          ],
        },
      ],
      limit: limit,
      offset: offset,
    });

    if (!surveys) return res.status(404).send({ message: 'Cannot find surveys' });

    const response = getPagingData(surveys, page, limit);
    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({
      error: err.message || 'Some error occurred while retrieving surveys',
    });
  }
}

/**
 * --------------------------
 * Find all the surveys
 * whose status is published
 * and created by a user in the database.
 * --------------------------
 */
async function getAllUserSurveysPublished(req, res, next) {
  const { page, size } = req.query;
  const { userId } = req.params || req.body;
  const { limit, offset } = getPagination(page, size);

  try {
    // Recovers all surveys under certain conditions
    let surveys = false;

    if (userId) {
      surveys = await Survey.findAndCountAll({
        where: { [Op.and]: [{ isSurveyPublished: true }, { userId: userId }] },
        include: [
          {
            model: Subject,
            include: [
              {
                model: Answer,
              },
            ],
          },
        ],
        limit: limit,
        offset: offset,
      });
    }

    if (!surveys) return res.status(404).send({ message: 'Cannot find surveys' });

    const response = getPagingData(surveys, page, limit);
    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({
      error: err.message || 'Some error occurred while retrieving surveys',
    });
  }
}

/**
 * --------------------------
 * Find all the surveys
 * whose status is published
 * in database.
 * --------------------------
 */
async function getAllSurveysPublished(req, res, next) {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);

  try {
    // Recovers all surveys under certain conditions
    const surveys = await Survey.findAndCountAll({
      where: { isSurveyPublished: true },
      include: [
        {
          model: Subject,
          include: [
            {
              model: Answer,
            },
          ],
        },
      ],
      limit: limit,
      offset: offset,
    });

    if (!surveys) return res.status(404).send({ message: 'Cannot find surveys' });

    const response = getPagingData(surveys, page, limit);
    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({
      error: err.message || 'Some error occurred while retrieving surveys',
    });
  }
}

/**
 * --------------------------
 * Create and save a new survey
 * in the database.
 * --------------------------
 */
async function createSurvey(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { subjects } = req.body;
  const transaction = await sequelize.transaction();

  try {
    // Create a survey and save it in database
    const survey = await createOrUpdateEntityById(
      Survey,
      null,
      req.body,
      { userId: req.userId },
      transaction
    );

    if (!survey.data) throw new Error('Some error occurred while creating the Survey');

    // Runs subjects array if exist, links each subjects in array to survey and records in database
    if (subjects && subjects.length > 0) {
      for (const subject of subjects) {
        // Create a subject and save it in database
        const curentSubject = await createOrUpdateEntityById(
          Subject,
          null,
          subject,
          { surveyId: survey.data.id },
          transaction
        );

        if (!curentSubject.data) throw new Error('Some error occurred while creating subject');

        if (subject.answers && subject.answers.length > 0) {
          for (const answer of subject.answers) {
            const curentAnswer = await createOrUpdateEntityById(
              Answer,
              null,
              answer,
              { subjectId: curentSubject.data.id },
              transaction
            );

            if (!curentAnswer.data) throw new Error('Some error occurred while creating answer');
          }
        }
      }
    }

    // Persist entities if transaction is successful
    await transaction.commit().then(() => {
      return res.status(201).send({ message: 'Survey was registered successfully!' });
    });
  } catch (err) {
    // Rollback transaction if is not successful
    await transaction.rollback().then(() => {
      return res
        .status(500)
        .send({ error: err.message || 'Some error occurred while creating the Survey' });
    });
  }
}

/**
 * --------------------------
 * Update a survey in database
 * with the specified id in the request.
 * --------------------------
 */
async function updateSurvey(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { subjects } = req.body;
  const transaction = await sequelize.transaction();

  try {
    if (!(await isItUserSurvey(req.userId, req.params.surveyId))) {
      return res.status(403).send({
        message: 'No permission to access the resource.',
      });
    }

    const survey = await createOrUpdateEntityById(
      Survey,
      req.params.surveyId,
      req.body,
      {},
      transaction
    );

    if (!survey.data) throw new Error('Some error occurred while updating the Survey');

    // Runs subjects array if exist, and updates in database each subject according to survey.
    if (subjects && subjects.length > 0) {
      for (const subject of subjects) {
        const { answers } = subject;

        if (!(await isItUserSubject(req.userId, subject.subjectId))) {
          return res.status(403).send({
            message: 'No permission to access the resource.',
          });
        }

        const curentSubject = await createOrUpdateEntityById(
          Subject,
          subject.subjectId,
          subject,
          { surveyId: survey.data.id },
          transaction
        );

        if (!curentSubject.data) throw new Error('Some error occurred while creating subject');

        // Runs answers array if exist, and updates in database each answer according to subject.
        if (answers && answers.length > 0) {
          for (const answer of answers) {
            if (!(await isItUserAnswer(req.userId, answer.answerId))) {
              return res.status(403).send({
                message: 'No permission to access the resource.',
              });
            }

            const curentAnswer = await createOrUpdateEntityById(
              Answer,
              answer.answerId,
              answer,
              { subjectId: subject.data.id },
              transaction
            );

            if (!curentAnswer.data) throw new Error('Some error occurred while creating answer');
          }
        }
      }
    }

    // Persist entities if transaction is successful
    await transaction.commit().then(() => {
      return res.status(201).send({ message: 'Survey was updated successfully!' });
    });
  } catch (err) {
    // Rollback transaction if is not successful
    await transaction.rollback().then(() => {
      return res
        .status(500)
        .send({ error: err.message || 'Some error occurred while updating the Survey' });
    });
  }
}

/**
 * --------------------------
 * Delete a survey in database
 * with the specified id in the request.
 * --------------------------
 */
async function deleteSurvey(req, res, next) {
  return res.status(200).send({ message: 'Delete survey' });
}

/**
 * --------------------------
 * Delete all surveys from the database.
 * --------------------------
 */
async function deleteAllSurveys(req, res, next) {
  return res.status(200).send({ message: 'Delete all surveys' });
}

/**
 * --------------------------
 * Delete all surveys from the database.
 * --------------------------
 */
async function deleteAllSurveysOfUser(req, res, next) {
  return res.status(200).send({ message: 'Delete all surveys of user' });
}

module.exports = {
  getAllSurveys,
  getOneSurveyById,
  getAllUserSurveys,
  getAllUserSurveysPublished,
  getAllSurveysPublished,
  createSurvey,
  updateSurvey,
  deleteSurvey,
  deleteAllSurveys,
  deleteAllSurveysOfUser,
};
