const isOnlyEmptyCharacters = require("./isOnlyEmptyCharacters");
const { body } = require("express-validator");

function validateInputUser(username, email, password, roles) {
  return [
    body(username)
      .exists()
      .withMessage("this field is require")
      .not()
      .notEmpty()
      .withMessage("this field must not be empty")
      .isLength({ min: 2 })
      .withMessage("this field must be at least 2 chars long")
      .custom((value) => {
        if (isOnlyEmptyCharacters(value)) {
          console.log(value);
          throw new Error(
            "this field must not be composed only by empty character"
          );
        }
        return value;
      })
      .trim()
      .escape(),
    body(email)
      .exists()
      .withMessage("this field is require")
      .isEmail()
      .withMessage("Invalid email format")
      .not()
      .notEmpty()
      .withMessage("this field must not be empty")
      .isLength({ min: 2 })
      .withMessage("this field must be at least 2 chars long")
      .custom((value) => {
        if (isOnlyEmptyCharacters(value)) {
          console.log(value);
          throw new Error(
            "this field must not be composed only by empty character"
          );
        }
        return value;
      })
      .trim()
      .escape(),
    body(password)
      .exists()
      .withMessage("this field is require")
      .not()
      .notEmpty()
      .withMessage("this field must not be empty")
      .isLength({ min: 5 })
      .withMessage("this field must be at least 5 chars long")
      .custom((value) => {
        if (isOnlyEmptyCharacters(value)) {
          console.log(value);
          throw new Error(
            "this field must not be composed only by empty character"
          );
        }
        return value;
      })
      .trim()
      .escape(),
    /*body(roles)
      .exists()
      .withMessage("this field is require")
      .not()
      .notEmpty()
      .withMessage("this field must not be empty")
      .trim()
      .escape(),*/
  ];
}

module.exports = validateInputUser;
