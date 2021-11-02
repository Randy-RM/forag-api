function allActivity(req, res, next) {
  res.status(200).send("Public Content.");
}

function userProfil(req, res, next) {
  res.status(200).send("User Content.");
}

function adminProfil(req, res, next) {
  res.status(200).send("Admin Content.");
}

function organizationProfil(req, res, next) {
  res.status(200).send("Organization Content.");
}

module.exports = {
  allActivity,
  userProfil,
  adminProfil,
  organizationProfil,
};
