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
checks whether or not 
the access rights allow 
the client to access the resource.
--------------------------
*/
function verifyPermission(req, res, next) {
  const token = req.headers['x-access-token'];

  const decoded = jwt.verify(token, jwtConfig.secret);
  const userIdToken = decoded.id;

  if (
    (req.params.userId && userIdToken !== +req.params.userId) ||
    (req.body.userId && userIdToken !== +req.body.userId)
  ) {
    return res.status(403).send({
      message: 'No permission to access the resource.',
    });
  }
  next();
}

/*
--------------------------
Check the client rights
--------------------------
*/
async function isUserRights(userId, userType) {
  if (userType === 'user' || 'organization' || 'admin') {
    return false;
  }
  const userRoles = await UserRole.findAll({
    where: {
      userId: userId,
    },
  });
  for (const userRole of userRoles) {
    const role = await Role.findByPk(userRole.roleId);
    if (userType === 'admin' && role.roleName === 'admin') {
      return true;
    }
    if (userType === 'organization' && (role.roleName === 'organization' || 'admin')) {
      return true;
    }
    if (userType === 'user' && (role.roleName === 'user' || 'organization' || 'admin')) {
      return true;
    }
  }
  return false;
}

/*
--------------------------
Check if the client has 
administrator rights
--------------------------
*/
async function isAdmin(req, res, next) {
  const user = await User.findByPk(req.userId);
  if (isUserRights(user.id, 'admin')) {
    next();
  } else {
    return res.status(403).send({
      message: 'Require admin role!',
    });
  }
}

/*
--------------------------
Check if the client has 
organization rights
--------------------------
*/
async function isOrganization(req, res, next) {
  const user = await User.findByPk(req.userId);
  if (isUserRights(user.id, 'organization')) {
    next();
  } else {
    return res.status(403).send({
      message: 'Require organization role or admin !',
    });
  }
}

/*
--------------------------
Check if the client has 
user rights
--------------------------
*/
async function isUser(req, res, next) {
  const user = await User.findByPk(req.userId);
  if (isUserRights(user.id, 'user')) {
    next();
  } else {
    return res.status(403).send({
      message: 'Require user role or higher !',
    });
  }
}

module.exports = {
  verifyToken,
  verifyPermission,
  isAdmin,
  isOrganization,
  isUser,
};
