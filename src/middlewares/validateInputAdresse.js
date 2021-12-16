const { body } = require('express-validator');
const isOnlyEmptyCharacters = require('../utils/isOnlyEmptyCharacters');

function validateInputUser(street, city, country) {
  return [
    body(street)
      .exists()
      .withMessage('This field is require')
      .not()
      .notEmpty()
      .withMessage('This field must not be empty')
      .isLength({ min: 2 })
      .withMessage('This field must be at least 2 chars long')
      .custom((value) => {
        if (isOnlyEmptyCharacters(value)) {
          throw new Error('This field must not be composed only by empty character');
        }
        return value;
      })
      .trim()
      .escape(),
    body(city)
      .exists()
      .withMessage('This field is require')
      .not()
      .notEmpty()
      .withMessage('This field must not be empty')
      .isLength({ min: 2 })
      .withMessage('This field must be at least 2 chars long')
      .custom((value) => {
        if (isOnlyEmptyCharacters(value)) {
          throw new Error('This field must not be composed only by empty character');
        }
        return value;
      })
      .trim()
      .escape(),
    body(country)
      .exists()
      .withMessage('This field is require')
      .not()
      .notEmpty()
      .withMessage('This field must not be empty')
      .isLength({ min: 2 })
      .withMessage('This field must be at least 2 chars long')
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

module.exports = validateInputUser;
