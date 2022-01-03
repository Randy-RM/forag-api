const { body } = require('express-validator');
const isOnlyEmptyCharacters = require('../utils/isOnlyEmptyCharacters');

function validateInputSurvey(surveyTitle) {
  return [
    body(surveyTitle)
      .exists()
      .withMessage('This field is require')
      .not()
      .notEmpty()
      .withMessage('This field must not be empty')
      .isLength({ min: 5 })
      .withMessage('This field must be at least 5 chars long')
      .custom((value) => {
        if (isOnlyEmptyCharacters(value)) {
          throw new Error('This field must not be composed only by empty character');
        }
        return value;
      })
      .trim()
      .escape(),
  ];
}

module.exports = validateInputSurvey;
