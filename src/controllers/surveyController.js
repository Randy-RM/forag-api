const { validationResult } = require('express-validator');
const { Survey, Subject, Answer, sequelize, Sequelize } = require('../models');
const { getPagination, getPagingData } = require('../utils/pagination');

const { Op } = Sequelize;

/* 
--------------------------
Find all surveys,
and all surveys whose status is published
or unpublished in database
--------------------------
*/
async function getAllSurveys(req, res, next) {
  const { page, size, published } = req.query;
  const { limit, offset } = getPagination(page, size);

  try {
    // Recovers all surveys under certain conditions
    let survey = false;

    if (+published === 1 || +published === 0) {
      survey = await Survey.findAndCountAll({
        where: { isSurveyPublished: +published },
        limit: limit,
        offset: offset,
      });
    } else {
      survey = await Survey.findAndCountAll({
        limit: limit,
        offset: offset,
      });
    }

    if (!survey) {
      throw new Error('Some error occurred while retrieving Surveys');
    }

    const response = getPagingData(survey, page, limit);
    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({
      message: err.message,
    });
  }
}

/* 
--------------------------
Find a single surveys with an id 
in the database
--------------------------
*/
async function getOneSurveyById(req, res, next) {
  const { surveyId } = req.params;

  try {
    const survey = await Survey.findByPk(surveyId);

    if (!survey) {
      return res.status(404).send({
        message: `Cannot find survey with id = ${surveyId}.`,
      });
    }
    return res.status(200).send(survey);
  } catch (err) {
    return res.status(500).send({
      message: `Error retrieving survey with id = ${surveyId}`,
    });
  }
}

/* 
--------------------------
Find all the surveys 
created by a user in the database
--------------------------
*/
async function getAllUserSurveys(req, res, next) {
  const { page, size, published } = req.query;
  const { userId } = req.params || req.body;
  const { limit, offset } = getPagination(page, size);

  try {
    // Recovers all surveys under certain conditions
    const survey = await Survey.findAndCountAll({
      where:
        userId && published && (+published === 0 || +published === 1)
          ? { [Op.and]: [{ isSurveyPublished: +published }, { userId: userId }] }
          : { userId: userId },
      limit: limit,
      offset: offset,
    });

    if (!survey) {
      throw new Error('Some error occurred while retrieving Surveys');
    }

    const response = getPagingData(survey, page, limit);
    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({
      message: err.message,
    });
  }
}

/* 
--------------------------
Find all the surveys 
whose status is published 
and created by a user in the database
--------------------------
*/
async function getAllUserSurveysPublished(req, res, next) {
  const { page, size } = req.query;
  const { userId } = req.params || req.body;
  const { limit, offset } = getPagination(page, size);

  try {
    // Recovers all surveys under certain conditions
    let survey = false;

    if (userId) {
      survey = await Survey.findAndCountAll({
        where: { [Op.and]: [{ isSurveyPublished: true }, { userId: userId }] },
        limit: limit,
        offset: offset,
      });
    }

    if (!survey) {
      throw new Error('Some error occurred while retrieving Surveys');
    }

    const response = getPagingData(survey, page, limit);
    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({
      message: err.message,
    });
  }
}

/* 
--------------------------
Find all the surveys 
whose status is published 
in database
--------------------------
*/
async function getAllSurveysPublished(req, res, next) {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);

  try {
    // Recovers all surveys under certain conditions
    const survey = await Survey.findAndCountAll({
      where: { isSurveyPublished: true },
      limit: limit,
      offset: offset,
    });

    if (!survey) {
      throw new Error('Some error occurred while retrieving Surveys');
    }

    const response = getPagingData(survey, page, limit);
    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({
      message: err.message,
    });
  }
}

/* 
--------------------------
Create and save a new survey
in the database
--------------------------
*/
async function createSurvey(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const transaction = await sequelize.transaction();

  try {
    // Create a survey and save it in database
    const survey = await Survey.create(
      {
        surveyTitle: req.body.surveyTitle,
        userId: req.body.userId,
        isSurveyPublished: req.body.isSurveyPublished ? req.body.isSurveyPublished : false,
      },
      { transaction }
    );

    if (!survey) {
      throw new Error('Some error occurred while creating the Survey');
    }

    /* 
    Runs subjects array if exist, 
    links each subjects in array to survey 
    and records in database
    */
    if (req.body.subjects && req.body.subjects.length > 0) {
      for (const curentSubject of req.body.subjects) {
        const subject = await Subject.create(
          {
            subjectContent: curentSubject.subjectContent,
            surveyId: survey.id,
          },
          { transaction }
        );
        if (!subject) {
          throw new Error('Some error occurred while creating subject');
        }
        /* 
        Runs answers array if exist, 
        links each answers in array to subject 
        and records in database
        */
        if (curentSubject.answers && curentSubject.answers.length) {
          for (const curentAnswer of curentSubject.answers) {
            const answer = await Answer.create(
              {
                answerContent: curentAnswer.answerContent,
                subjectId: subject.id,
              },
              { transaction }
            );
            if (!answer) {
              throw new Error('Some error occurred while creating answer');
            }
          }
        }
      }
    }

    // Persist entities if transaction is successful
    await transaction.commit().then(() => {
      return res.status(201).send({ message: 'Survey was registered successfully!' });
    });
  } catch (err) {
    // Rollback transaction if is not successful
    await transaction.rollback().then(() => {
      return res
        .status(500)
        .send({ error: err.message || 'Some error occurred while creating the Survey' });
    });
  }
}

/* 
--------------------------
Update a survey in database 
with the specified id in the request
--------------------------
*/
async function updateSurvey(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const transaction = await sequelize.transaction();

  try {
    const survey = await Survey.update(req.body, {
      where: { id: req.params.surveyId },
      transaction: transaction,
    });

    if (survey[0] !== 1) {
      throw new Error('Some error occurred while updating the Survey');
    }

    /* 
    Runs subjects array if exist, 
    and updates in database each subject according to
    survey.
    */
    if (req.body.subjects && req.body.subjects.length > 0) {
      for (const curentSubject of req.body.subjects) {
        const subject = await Subject.update(curentSubject, {
          where: { id: curentSubject.subjectId },
          transaction: transaction,
        });
        if (subject[0] !== 1) {
          throw new Error('Some error occurred while creating subject');
        }
        /* 
        Runs answers array if exist, 
        and updates in database each answer according to
        subject.
        */
        if (curentSubject.answers && curentSubject.answers.length) {
          for (const curentAnswer of curentSubject.answers) {
            const answer = await Answer.update(curentAnswer, {
              where: { id: curentAnswer.answerId },
              transaction: transaction,
            });
            if (answer[0] !== 1) {
              throw new Error('Some error occurred while creating answer');
            }
          }
        }
      }
    }

    // Persist entities if transaction is successful
    await transaction.commit().then(() => {
      return res.status(201).send({ message: 'Survey was updated successfully!' });
    });
  } catch (err) {
    // Rollback transaction if is not successful
    await transaction.rollback().then(() => {
      return res
        .status(500)
        .send({ error: err.message || 'Some error occurred while updating the Survey' });
    });
  }
}

/* 
--------------------------
Delete a survey in database 
with the specified id in the request
--------------------------
*/
async function deleteSurvey(req, res, next) {
  return res.status(200).send({ message: 'Delete survey' });
}

/* 
--------------------------
Delete all surveys from the database.
--------------------------
*/
async function deleteAllSurveys(req, res, next) {
  return res.status(200).send({ message: 'Delete all surveys' });
}

/* 
--------------------------
Delete all surveys from the database.
--------------------------
*/
async function deleteAllSurveysOfUser(req, res, next) {
  return res.status(200).send({ message: 'Delete all surveys of user' });
}

module.exports = {
  getAllSurveys,
  getOneSurveyById,
  getAllUserSurveys,
  getAllUserSurveysPublished,
  getAllSurveysPublished,
  createSurvey,
  updateSurvey,
  deleteSurvey,
  deleteAllSurveys,
  deleteAllSurveysOfUser,
};
