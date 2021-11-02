const { validationResult } = require("express-validator");
const { User, Role, UserRole, sequelize } = require("../models");
const authConfig = require("../config/auth.config");
let jwt = require("jsonwebtoken");
let bcrypt = require("bcryptjs");

/*
--------------------------
Create and save a new user
in the database
--------------------------
*/
async function signup(req, res, next) {
  const errors = await validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }

  const transaction = await sequelize.transaction();

  const userInput = {
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  };

  try {
    // Save User to Database
    const user = await User.create(userInput, { transaction });
    if (req.body.roles && req.body.roles.length > 0) {
      // Save relationship userRole for user if is specified
      for (const role of req.body.roles) {
        let currentRole = await Role.findOne({
          where: { roleName: role },
        });
        if (currentRole) {
          await UserRole.create(
            {
              roleId: currentRole.dataValues.id,
              userId: user.id,
            },
            { transaction }
          );
        } else {
          throw new Error("problems arising from the roles");
        }
      }
    } else {
      // Save default relationship userRole for User, if relationship is not specified
      await UserRole.create(
        {
          roleId: Role.findOne({ where: { roleName: "user" } }).id,
          userId: user.id,
        },
        { transaction }
      );
    }
    // Persist entities if transaction is successful
    await transaction.commit().then(() => {
      res.status(201).send({ message: "User was registered successfully!" });
    });
  } catch (error) {
    // Rollback transaction if is not successful
    await transaction.rollback().then(() => {
      res.status(500).send({ error: ` ${error}` });
    });
  }
}

/*
--------------------------
Signin if user have an account 
and roles 
--------------------------
*/
async function signin(req, res, next) {
  await User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then(async (user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      let token = jwt.sign({ id: user.id }, authConfig.secret, {
        expiresIn: 86400, // 24 hours
      });

      let authorities = [];

      const userRoles = await UserRole.findAll({
        where: {
          userId: user.id,
        },
      });

      for (const userRole of userRoles) {
        let role = await Role.findByPk(userRole.roleId);
        authorities.push(role.roleName);
      }

      res.status(200).send({
        id: user.id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token,
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
}

module.exports = {
  signup,
  signin,
};
