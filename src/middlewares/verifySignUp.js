const { User, Role, Sequelize } = require('../models');

const { Op } = Sequelize;

/*
--------------------------
Check if user with the same 
username or email already exists
in the database
--------------------------
*/
async function checkDuplicateUsernameOrEmail(req, res, next) {
  const user = await User.findOne({
    where: { [Op.or]: [{ username: req.body.username }, { email: req.body.email }] },
  });
  // Check username and Email
  if (user) {
    if (user.username === req.body.username) {
      return res.status(422).send({
        message: 'Failed! username is already in use!',
      });
    }
    if (user.email === req.body.email) {
      return res.status(422).send({
        message: 'Failed! email is already in use!',
      });
    }
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
  if (req.body.roles && !Array.isArray(req.body.roles)) {
    return res.status(400).send({ message: 'Invalid format, array of roles is expected' });
  }
  if (req.body.roles && req.body.roles.length > 0) {
    const roles = await Role.findAll({
      where: { roleName: { [Op.in]: req.body.roles } },
    });
    if (roles && roles.length !== req.body.roles.length) {
      return res.status(400).send({
        message: `Failed! some roles in array '${req.body.roles}' does not exist`,
      });
    }
  }
  next();
}

module.exports = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted,
};
