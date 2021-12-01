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
  const token = req.headers['x-access-token'];

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
  });
}

/*
--------------------------
Check if the client has 
administrator rights
--------------------------
*/
async function isAdmin(req, res, next) {
  const user = await User.findByPk(req.userId);
  const userRoles = await UserRole.findAll({
    where: {
      userId: user.id,
    },
  });
  for (const userRole of userRoles) {
    const role = await Role.findByPk(userRole.roleId);
    if (role.roleName === 'admin') {
      next();
    }
  }
  return res.status(403).send({
    message: 'Require admin role!',
  });
}

/*
--------------------------
Check if the client has 
organization rights
--------------------------
*/
async function isOrganization(req, res, next) {
  const user = await User.findByPk(req.userId);
  const userRoles = await UserRole.findAll({
    where: {
      userId: user.id,
    },
  });
  for (const userRole of userRoles) {
    const role = await Role.findByPk(userRole.roleId);
    if (role.roleName === 'organization' || 'admin') {
      next();
    }
  }
  return res.status(403).send({
    message: 'Require organization role or admin !',
  });
}

/*
--------------------------
Check if the client has 
user rights
--------------------------
*/
async function isUser(req, res, next) {
  const user = await User.findByPk(req.userId);
  const userRoles = await UserRole.findAll({
    where: {
      userId: user.id,
    },
  });
  for (const userRole of userRoles) {
    const role = await Role.findByPk(userRole.roleId);
    if (role.roleName === 'user' || 'organization' || 'admin') {
      next();
    }
  }
  return res.status(403).send({
    message: 'Require user role or higher !',
  });
}

module.exports = {
  verifyToken,
  isAdmin,
  isOrganization,
  isUser,
};
