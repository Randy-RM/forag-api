const { param } = require("express-validator");

function validateId(id) {
  return [
    param(id)
      .exists()
      .withMessage("this field is require")
      .isInt()
      .withMessage("this must be a number")
      .not()
      .notEmpty()
      .withMessage("this field must not be empty"),
  ];
}

module.exports = validateId;
