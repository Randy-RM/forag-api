const express = require('express');
const { authJwt } = require('../middlewares/index');
const UserController = require('../controllers/userController');

const userRouter = express.Router();

userRouter.get('/all-activity', UserController.allActivity);

userRouter.get('/profil/user', [authJwt.verifyToken, authJwt.isUser], UserController.userProfil);

userRouter.get(
  '/profil/organization',
  [authJwt.verifyToken, authJwt.isOrganization],
  UserController.organizationProfil
);

userRouter.get('/profil/admin', [authJwt.verifyToken, authJwt.isAdmin], UserController.adminProfil);

module.exports = userRouter;
