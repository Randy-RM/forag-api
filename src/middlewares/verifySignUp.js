const { User, Role } = require("../models");

/*
--------------------------
Check if user with the same 
username or email already exists
in the database
--------------------------
*/
async function checkDuplicateUsernameOrEmail(req, res, next) {
  // Username and Email
  if (await User.findOne({ where: { username: req.body.username } })) {
    res.status(400).send({
      message: "Failed! Username is already in use!",
    });
    return;
  } else if (await User.findOne({ where: { username: req.body.email } })) {
    res.status(400).send({
      message: "Failed! Email is already in use!",
    });
    return;
  }
  next();
}

/*
--------------------------
Check if roles given is the same
to the database
--------------------------
*/
async function checkRolesExisted(req, res, next) {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!(await Role.findOne({ where: { roleName: req.body.roles[i] } }))) {
        res.status(400).send({
          message: `Failed! Role '${req.body.roles[i]}' does not exist`,
        });
        return;
      }
    }
  }
  next();
}

const verifySignUp = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
  checkRolesExisted: checkRolesExisted,
};

module.exports = verifySignUp;
