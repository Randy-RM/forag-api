const express = require('express');
const { verifySignUp, validateInputUser } = require('../middlewares');
const authController = require('../controllers/authController');

const authRouter = express.Router();

authRouter.post(
  '/signup',
  [
    validateInputUser('username', 'email', 'password'),
    verifySignUp.checkDuplicateUsernameOrEmail,
    verifySignUp.checkRolesExisted,
  ],
  authController.signup
);

authRouter.post('/signin', authController.signin);

module.exports = authRouter;
