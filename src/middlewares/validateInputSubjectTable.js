const isOnlyEmptyCharacters = require('../utils/isOnlyEmptyCharacters');

function validateInputSubjectTable(req, res, next) {
  if (req.body.subjects && !Array.isArray(req.body.subjects)) {
    return res.status(400).send({ message: 'Invalid format, array of object is expected' });
  }
  if (req.body.subjects.length > 0) {
    for (const subject of req.body.subjects) {
      if (!subject.subjectContent) {
        return res.status(400).send({ message: 'SubjectContent property is expected' });
      }
      if (subject.subjectContent && isOnlyEmptyCharacters(subject.subjectContent)) {
        return res.status(400).send({
          message:
            'The subjectContent field must not be composed only by empty character and must not start or end with empty character',
        });
      }
    }
  }
  next();
}

module.exports = validateInputSubjectTable;
