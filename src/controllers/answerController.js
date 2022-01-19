const { validationResult } = require('express-validator');
const { Subject, Answer, sequelize } = require('../models');
const { getPagination, getPagingData } = require('../utils/pagination');
const { createOrUpdateEntityById } = require('../utils/createOrUpdateEntity');
const { isItUserAnswer } = require('../utils/isItForUser');

/**
 * --------------------------
 * Find all answers,
 * in database.
 * --------------------------
 */
async function getAllAnswers(req, res, next) {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);

  try {
    // Recovers all answers under certain conditions
    const answers = await Answer.findAndCountAll({
      include: [
        {
          model: Subject,
        },
      ],
      limit: limit,
      offset: offset,
    });

    if (!answers) {
      throw new Error('Some error occurred while retrieving answers');
    }

    const response = getPagingData(answers, page, limit);
    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({
      message: err.message,
    });
  }
}

/**
 * --------------------------
 * Find all answers,
 * according to subject id
 * in database.
 * --------------------------
 */
async function getAllSubjectAnswers(req, res, next) {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);
  const { subjectId } = req.params;

  try {
    // Recovers all answers under certain conditions
    const answers = await Answer.findAndCountAll({
      where: { subjectId: +subjectId },
      include: [
        {
          model: Subject,
        },
      ],
      limit: limit,
      offset: offset,
    });

    if (!answers) {
      throw new Error('Some error occurred while retrieving answers');
    }

    const response = getPagingData(answers, page, limit);
    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({
      message: err.message,
    });
  }
}

/**
 * --------------------------
 * Find a single answer with an id
 * in the database.
 * --------------------------
 */
async function getOneAnswerById(req, res, next) {
  const { answerId } = req.params;

  try {
    const answer = await Answer.findOne({
      where: { id: answerId },
      include: [
        {
          model: Subject,
        },
      ],
    });

    if (!answer) {
      return res.status(404).send({
        message: `Cannot find answer with id = ${answerId}.`,
      });
    }
    return res.status(200).send(answer);
  } catch (err) {
    return res.status(500).send({
      message: `Error retrieving answer with id = ${answerId}`,
    });
  }
}

/**
 * --------------------------
 * Create and save a new answer
 * in the database.
 * --------------------------
 */
async function createAnswer(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { answerId } = req.body;
  const transaction = await sequelize.transaction();

  try {
    if (!(await isItUserAnswer(req.userId, answerId))) {
      return res.status(403).send({
        message: 'No permission to access the resource.',
      });
    }

    const answer = await createOrUpdateEntityById(Answer, answerId, req.body, {}, transaction);

    if (!answer.data) throw new Error('Some error occurred while creating answer');

    // Persist entities if transaction is successful
    await transaction.commit().then(() => {
      return res.status(201).send({ message: 'answer was registered successfully!' });
    });
  } catch (err) {
    // Rollback transaction if is not successful
    await transaction.rollback().then(() => {
      return res
        .status(500)
        .send({ error: err.message || 'Some error occurred while creating the answer' });
    });
  }
}

/**
 * --------------------------
 * Update a answer in database
 * with the specified id in the request.
 * --------------------------
 */
async function updateAnswer(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { answerId } = req.body;
  const transaction = await sequelize.transaction();

  try {
    if (!(await isItUserAnswer(req.userId, answerId))) {
      return res.status(403).send({
        message: 'No permission to access the resource.',
      });
    }

    const answer = await createOrUpdateEntityById(Answer, answerId, req.body, {}, transaction);

    if (!answer.data) throw new Error('Some error occurred while creating answer');

    // Persist entities if transaction is successful
    await transaction.commit().then(() => {
      return res.status(201).send({ message: 'answer was registered successfully!' });
    });
  } catch (err) {
    // Rollback transaction if is not successful
    await transaction.rollback().then(() => {
      return res
        .status(500)
        .send({ error: err.message || 'Some error occurred while creating the answer' });
    });
  }
}

module.exports = {
  getAllAnswers,
  getAllSubjectAnswers,
  getOneAnswerById,
  createAnswer,
  updateAnswer,
};
