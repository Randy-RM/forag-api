const { validationResult } = require('express-validator');

/**
 * --------------------------
 * Find all answer,
 * in database.
 * --------------------------
 */
async function getAllAnswers(req, res, next) {
  return 0;
}

/**
 * --------------------------
 * Find all answer,
 * according to subject id
 * in database.
 * --------------------------
 */
async function getAllSubjectAnswers(req, res, next) {
  return 0;
}

/**
 * --------------------------
 * Find a single answer with an id
 * in the database.
 * --------------------------
 */
async function getOneAnswerById(req, res, next) {
  return 0;
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
  return 0;
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
  return 0;
}

module.exports = {
  getAllAnswers,
  getAllSubjectAnswers,
  getOneAnswerById,
  createAnswer,
  updateAnswer,
};
