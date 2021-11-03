const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/authConfig');
const { User, Role, UserRole } = require('../models');

/*
--------------------------
Verify if token exist or
if client is authorized
--------------------------
*/
function verifyToken(req, res, next) {
  let token = req.headers['x-access-token'];

  if (!token) {
    return res.status(403).send({
      message: 'No token provided!',
    });
  }

  jwt.verify(token, jwtConfig.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: 'Unauthorized access !',
      });
    }
    req.userId = decoded.id;
    next();
    return;
  });

  return;
}

/*
--------------------------
Check if the client has 
administrator rights
--------------------------
*/
async function isAdmin(req, res, next) {
  await User.findByPk(req.userId).then(async (user) => {
    const userRoles = await UserRole.findAll({
      where: {
        userId: user.id,
      },
    });

    for (const userRole of userRoles) {
      let role = await Role.findByPk(userRole.roleId);
      if (role.roleName === 'admin') {
        next();
        return;
      }
    }

    return res.status(403).send({
      message: 'Require admin role!',
    });
  });

  return;
}

/*
--------------------------
Check if the client has 
organization rights
--------------------------
*/
async function isOrganization(req, res, next) {
  await User.findByPk(req.userId).then(async (user) => {
    const userRoles = await UserRole.findAll({
      where: {
        userId: user.id,
      },
    });

    for (const userRole of userRoles) {
      let role = await Role.findByPk(userRole.roleId);
      if (role.roleName === 'organization' || 'admin') {
        next();
        return;
      }
    }

    return res.status(403).send({
      message: 'Require organization role or admin !',
    });
  });

  return;
}

/*
--------------------------
Check if the client has 
user rights
--------------------------
*/
async function isUser(req, res, next) {
  await User.findByPk(req.userId).then(async (user) => {
    const userRoles = await UserRole.findAll({
      where: {
        userId: user.id,
      },
    });

    for (const userRole of userRoles) {
      let role = await Role.findByPk(userRole.roleId);
      if (role.roleName === 'user' || 'organization' || 'admin') {
        next();
        return;
      }
    }

    return res.status(403).send({
      message: 'Require user role or higher !',
    });
  });

  return;
}

module.exports = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isOrganization: isOrganization,
  isUser: isUser,
};
