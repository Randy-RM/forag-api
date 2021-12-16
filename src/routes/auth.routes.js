const express = require('express');
const { verifySignUp, validateInputUser, validateInputAdresse } = require('../middlewares');
const authController = require('../controllers/authController');

const authRouter = express.Router();

authRouter.post(
  '/signup',
  [
    validateInputUser('username', 'email', 'password'),
    validateInputAdresse('street', 'city', 'country'),
    verifySignUp.checkDuplicateUsernameOrEmail,
    verifySignUp.checkRolesExisted,
  ],
  authController.signup
);

authRouter.post('/signin', authController.signin);

module.exports = authRouter;
