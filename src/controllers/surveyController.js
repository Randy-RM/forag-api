const { validationResult } = require('express-validator');
const { Survey } = require('../models');

// Retrieve all posts from the database.
async function getAllSurveys(req, res, next) {
  return res.status(200).send({ message: 'All surveys' });
}

// Retrieve all posts from the database.
async function getAllSurveysOfUser(req, res, next) {
  return res.status(200).send({ message: 'All surveys of user' });
}

// Find a single post with an id
async function getOneSurveyById(req, res, next) {
  return res.status(200).send({ message: 'One survey by Id' });
}

// Find all published posts
async function findAllPublishedSurveys(req, res, next) {
  return res.status(200).send({ message: 'All published surveys' });
}

// Find all published posts
async function findAllUserPublishedSurveys(req, res, next) {
  return res.status(200).send({ message: 'All user s published surveys' });
}

// Create and save a new survey
async function createSurvey(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  // Create a survey
  const inputSurvey = {
    surveyTitle: req.body.surveyTitle,
    userId: req.params.userId,
    isSurveyPublished: req.body.isSurveyPublished ? req.body.isSurveyPublished : false,
  };
  // Save survey in the database
  try {
    const survey = await Survey.create(inputSurvey);
    if (survey) {
      return res.status(200).send(survey);
    }
    throw new Error('Some error occurred while creating the Survey');
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while creating the Post',
    });
  }
}

// Update a post by the id in the request
async function updateSurvey(req, res, next) {
  return res.status(200).send({ message: 'Update survey' });
}

// Delete a post with the specified id in the request
async function deleteSurvey(req, res, next) {
  return res.status(200).send({ message: 'Delete survey' });
}

// Delete all posts from the database.
async function deleteAllSurveys(req, res, next) {
  return res.status(200).send({ message: 'Delete all surveys' });
}

// Delete all posts from the database.
async function deleteAllSurveysOfUser(req, res, next) {
  return res.status(200).send({ message: 'Delete all surveys of user' });
}

module.exports = {
  getAllSurveys,
  getAllSurveysOfUser,
  getOneSurveyById,
  findAllPublishedSurveys,
  findAllUserPublishedSurveys,
  createSurvey,
  updateSurvey,
  deleteSurvey,
  deleteAllSurveys,
  deleteAllSurveysOfUser,
};
