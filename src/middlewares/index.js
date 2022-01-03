const validateInputUser = require('./validateInputUser');
const validateInputAdresse = require('./validateInputAdresse');
const validateId = require('./validateId');
const validateInputSurvey = require('./validateInputSurvey');
const validateInputSubjectTable = require('./validateInputSubjectTable');
const verifySignUp = require('./verifySignUp');
const authJwt = require('./authJwt');

module.exports = {
  validateInputUser,
  validateInputAdresse,
  validateId,
  validateInputSurvey,
  validateInputSubjectTable,
  verifySignUp,
  authJwt,
};
