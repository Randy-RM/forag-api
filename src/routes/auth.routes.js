const express = require("express");
const { verifySignUp, validateInputUser } = require("../middlewares");
const authRouter = express.Router();
const controller = require("../controllers/authController");

authRouter.post(
  "/signup",
  [
    validateInputUser("username", "email", "password", "roles"),
    verifySignUp.checkDuplicateUsernameOrEmail,
    verifySignUp.checkRolesExisted,
  ],
  controller.signup
);

authRouter.post("/signin", controller.signin);

module.exports = authRouter;
