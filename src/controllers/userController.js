function allActivity(req, res, next) {
  return res.status(200).send('Public Content.');
}

function userProfil(req, res, next) {
  return res.status(200).send('User Content.');
}

function adminProfil(req, res, next) {
  return res.status(200).send('Admin Content.');
}

function organizationProfil(req, res, next) {
  return res.status(200).send('Organization Content.');
}

module.exports = {
  allActivity,
  userProfil,
  adminProfil,
  organizationProfil,
};
