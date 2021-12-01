const { param } = require('express-validator');

function validateId(id) {
  return [
    param(id)
      .exists()
      .withMessage('This field is require')
      .isInt()
      .withMessage('This must be a number')
      .not()
      .notEmpty()
      .withMessage('This field must not be empty'),
  ];
}

module.exports = validateId;
