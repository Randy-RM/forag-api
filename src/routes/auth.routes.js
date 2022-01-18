const express = require('express');
const { verifySignUp, validateInputUser, validateInputAdresse } = require('../middlewares');
const authController = require('../controllers/authController');

const authRouter = express.Router();

// Create and save a new user account.
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

// Signin if user have an account.
authRouter.post('/signin', authController.signin);

// Logout user.
authRouter.post('/logout', authController.logout);

module.exports = authRouter;
