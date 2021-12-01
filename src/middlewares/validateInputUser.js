const { body } = require('express-validator');
const isOnlyEmptyCharacters = require('../utils/isOnlyEmptyCharacters');

function validateInputUser(username, email, password) {
  return [
    body(username)
      .exists()
      .withMessage('This field is require')
      .not()
      .notEmpty()
      .withMessage('This field must not be empty')
      .isLength({ min: 2 })
      .withMessage('This field must be at least 2 chars long')
      .custom((value) => {
        if (isOnlyEmptyCharacters(value)) {
          console.log(value);
          throw new Error('This field must not be composed only by empty character');
        }
        return value;
      })
      .trim()
      .escape(),
    body(email)
      .exists()
      .withMessage('This field is require')
      .isEmail()
      .withMessage('Invalid email format')
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
    body(password)
      .exists()
      .withMessage('This field is require')
      .not()
      .notEmpty()
      .withMessage('This field must not be empty')
      .isLength({ min: 5 })
      .withMessage('This field must be at least 5 chars long')
      .custom((value) => {
        if (isOnlyEmptyCharacters(value)) {
          console.log(value);
          throw new Error('This field must not be composed only by empty character');
        }
        return value;
      })
      .trim()
      .escape(),
  ];
}

module.exports = validateInputUser;
