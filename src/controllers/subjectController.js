/* 
--------------------------
Find a single surveys with an id 
in the database
--------------------------
*/
async function getOneSubjectById(req, res, next) {
  return res.status(200).send({ message: 'One subject' });
}

module.exports = {
  getOneSubjectById,
};
