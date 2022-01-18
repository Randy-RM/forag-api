const { validationResult } = require('express-validator');
const { Subject, Answer, sequelize } = require('../models');
const { getPagination, getPagingData } = require('../utils/pagination');
const { createOrUpdateEntityById } = require('../utils/createOrUpdateEntity');
const { isItUserSubject, isItUserAnswer } = require('../utils/isItForUser');

/**
 * --------------------------
 * Find all subject,
 * in database
 * --------------------------
 */
async function getAllSubjects(req, res, next) {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);

  try {
    // Recovers all subjects under certain conditions
    const subject = await Subject.findAndCountAll({
      include: [
        {
          model: Answer,
        },
      ],
      limit: limit,
      offset: offset,
    });

    if (!subject) {
      throw new Error('Some error occurred while retrieving subjects');
    }

    const response = getPagingData(subject, page, limit);
    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({
      message: err.message,
    });
  }
}

/**
 * --------------------------
 * Find all subject,
 * according to survey id
 * in database
 * --------------------------
 */
async function getAllSurveySubjects(req, res, next) {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);
  const { surveyId } = req.params;

  try {
    // Recovers all subjects under certain conditions
    const subject = await Subject.findAndCountAll({
      where: { surveyId: +surveyId },
      include: [
        {
          model: Answer,
        },
      ],
      limit: limit,
      offset: offset,
    });

    if (!subject) {
      throw new Error('Some error occurred while retrieving subjects');
    }

    const response = getPagingData(subject, page, limit);
    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({
      message: err.message,
    });
  }
}

/**
 * --------------------------
 * Find a single subject with an id
 * in the database
 * --------------------------
 */
async function getOneSubjectById(req, res, next) {
  const { subjectId } = req.params;

  try {
    const subject = await Subject.findOne({
      where: { id: subjectId },
      include: [
        {
          model: Answer,
        },
      ],
    });

    if (!subject) {
      return res.status(404).send({
        message: `Cannot find subject with id = ${subjectId}.`,
      });
    }
    return res.status(200).send(subject);
  } catch (err) {
    return res.status(500).send({
      message: `Error retrieving subject with id = ${subjectId}`,
    });
  }
}

/**
 * --------------------------
 * Create and save a new subject
 * in the database
 * --------------------------
 */
async function createSubject(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { answers, surveyId } = req.body;
  const transaction = await sequelize.transaction();

  try {
    // Create a subject and save it in database
    const subject = await createOrUpdateEntityById(
      Subject,
      null,
      req.body,
      { surveyId: surveyId },
      transaction
    );

    if (!subject.data) throw new Error('Some error occurred while creating subject');

    // Runs answers array if exist, links each answers in array to subject and records in database
    if (answers && answers.length > 0) {
      for (const answer of answers) {
        const curentAnswer = await createOrUpdateEntityById(
          Answer,
          null,
          answer,
          { subjectId: subject.data.id },
          transaction
        );

        if (!curentAnswer.data) throw new Error('Some error occurred while creating answer');
      }
    }

    // Persist entities if transaction is successful
    await transaction.commit().then(() => {
      return res.status(201).send({ message: 'subject was registered successfully!' });
    });
  } catch (err) {
    // Rollback transaction if is not successful
    await transaction.rollback().then(() => {
      return res
        .status(500)
        .send({ error: err.message || 'Some error occurred while creating the subject' });
    });
  }
}

/**
 * --------------------------
 * Update a subject in database
 * with the specified id in the request
 * --------------------------
 */
async function updateSubject(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { answers } = req.body;
  const transaction = await sequelize.transaction();

  try {
    if (!(await isItUserSubject(req.userId, req.params.subjectId))) {
      return res.status(403).send({
        message: 'No permission to access the resource.',
      });
    }

    const subject = await createOrUpdateEntityById(
      Subject,
      req.params.subjectId,
      req.body,
      {},
      transaction
    );

    if (!subject.data) throw new Error('Some error occurred while updating the subject');

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
    // Persist entities if transaction is successful
    await transaction.commit().then(() => {
      return res.status(201).send({ message: 'Subject was updated successfully!' });
    });
  } catch (err) {
    // Rollback transaction if is not successful
    await transaction.rollback().then(() => {
      return res
        .status(500)
        .send({ error: err.message || 'Some error occurred while updating the subject' });
    });
  }
}

module.exports = {
  getAllSubjects,
  getAllSurveySubjects,
  getOneSubjectById,
  createSubject,
  updateSubject,
};
