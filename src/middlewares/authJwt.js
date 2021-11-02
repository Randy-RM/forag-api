const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/auth.config");
const { User, Role, UserRole } = require("../models");

/*
--------------------------
Verify if token exist or
if client is authorized
--------------------------
*/
function verifyToken(req, res, next) {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }

  jwt.verify(token, jwtConfig.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
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
  await User.findByPk(req.userId).then(async (user) => {
    const userRoles = await UserRole.findAll({
      where: {
        userId: user.id,
      },
    });

    for (const userRole of userRoles) {
      let role = await Role.findByPk(userRole.roleId);
      if (role.roleName === "admin") {
        next();
        return;
      }
    }

    res.status(403).send({
      message: "Require Admin Role!",
    });
    return;
  });
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
      if (role.roleName === "organization" || role.roleName === "admin") {
        next();
        return;
      }
    }

    res.status(403).send({
      message: "Require Organization Role!",
    });
    return;
  });
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
      if (
        role.roleName === "user" ||
        role.roleName === "organization" ||
        role.roleName === "admin"
      ) {
        next();
        return;
      }
    }

    res.status(403).send({
      message: "Require User Role!",
    });
    return;
  });
}

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isOrganization: isOrganization,
  isUser: isUser,
};

module.exports = authJwt;
