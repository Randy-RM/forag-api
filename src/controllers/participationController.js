const { validationResult } = require('express-validator');
const {
  User,
  Participation,
  ParticipationSubject,
  SelectedAnswer,
  sequelize,
  Sequelize,
} = require('../models');
const { getPagination, getPagingData } = require('../utils/pagination');
const { createOrUpdateEntityById } = require('../utils/createOrUpdateEntity');

const { Op } = Sequelize;

/**
 * --------------------------
 * Insert a new selected answer
 * in the database.
 * --------------------------
 */
async function insertSelectedAnswer(userId, participationData, transaction) {
  const { surveyId, subjectId, answerId } = participationData;
  try {
    // verify if survey with surveyId exists
    const participation = await createOrUpdateEntityById(
      Participation,
      null,
      { userId: userId, surveyId: surveyId },
      {},
      transaction
    );

    if (!participation.data) throw new Error('An error occurred during the selection');

    const participationSubject = await createOrUpdateEntityById(
      ParticipationSubject,
      null,
      { participationId: participation.data.id, subjectId: subjectId },
      {},
      transaction
    );

    if (!participationSubject.data) throw new Error('An error occurred during the selection');

    const selectedAnswer = await createOrUpdateEntityById(
      SelectedAnswer,
      null,
      { participationSubjectId: participationSubject.data.id, answerId: answerId },
      {},
      transaction
    );

    if (!selectedAnswer.data) throw new Error('An error occurred during the selection');

    return { data: selectedAnswer.data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}

/**
 * --------------------------
 * Update selected answer
 * in the database.
 * --------------------------
 */
async function updateSelectedAnswer(participationData, transaction) {
  const { participationId, subjectId, answerId, selectedAnswerId } = participationData;
  try {
    const participationSubjectExist = await ParticipationSubject.findOne({
      where: { [Op.and]: { participationId: participationId, subjectId: subjectId } },
    });

    if (participationSubjectExist) {
      if (!selectedAnswerId)
        throw new Error(
          'An error occurred during update answer, selectedAnswerId field is require'
        );

      const selectedAnswerExist = await SelectedAnswer.findOne({
        where: { id: selectedAnswerId },
      });

      if (selectedAnswerExist) {
        const selectedAnswer = await createOrUpdateEntityById(
          SelectedAnswer,
          selectedAnswerExist.dataValues.id,
          { answerId: answerId },
          {},
          transaction
        );

        if (!selectedAnswer.data) throw new Error('An error occurred during the selection');

        return { data: selectedAnswer.data, error: null };
      }

      const selectedAnswer = await createOrUpdateEntityById(
        SelectedAnswer,
        null,
        { participationSubjectId: participationSubjectExist.dataValues.id, answerId: answerId },
        {},
        transaction
      );

      if (!selectedAnswer.data) throw new Error('An error occurred during the selection');

      return { data: selectedAnswer.data, error: null };
    }
    const participationSubject = await createOrUpdateEntityById(
      ParticipationSubject,
      null,
      { participationId: participationId, subjectId: subjectId },
      {},
      transaction
    );

    if (!participationSubject.data) throw new Error('An error occurred during the selection');

    const selectedAnswer = await createOrUpdateEntityById(
      SelectedAnswer,
      null,
      { participationSubjectId: participationSubject.data.id, answerId: answerId },
      {},
      transaction
    );

    if (!selectedAnswer.data) throw new Error('An error occurred during the selection');

    return { data: selectedAnswer.data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}

/**
 * --------------------------
 * Selects answer related
 * to a survey subject
 * and save it in the database.
 * --------------------------
 */
async function selectAnswer(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const transaction = await sequelize.transaction();

  try {
    let selectedAnswer = null;
    const participationExist = await Participation.findOne({
      where: { [Op.and]: { userId: req.userId, surveyId: req.body.surveyId } },
    });

    if (!participationExist) {
      selectedAnswer = await insertSelectedAnswer(
        req.userId,
        {
          surveyId: req.body.surveyId,
          subjectId: req.body.subjectId,
          answerId: req.body.answerId,
        },
        transaction
      );

      if (!selectedAnswer.data) throw new Error('An error occurred during the selection');
    } else {
      selectedAnswer = await updateSelectedAnswer(
        {
          participationId: participationExist.id,
          subjectId: req.body.subjectId,
          answerId: req.body.answerId,
          selectedAnswerId: req.body.selectedAnswerId,
        },
        transaction
      );

      if (!selectedAnswer.data) throw new Error('An error occurred during update answer');
    }

    // Persist entities if transaction is successful participationExist.ParticipationSubjects
    await transaction.commit().then(() => {
      return res.status(201).send({ message: 'Successfully selected' });
    });
  } catch (err) {
    // Rollback transaction if is not successful
    await transaction.rollback().then(() => {
      return res
        .status(500)
        .send({ error: err.message || 'An error occurred during the selection' });
    });
  }
}

/**
 * --------------------------
 * Get participation according
 * to a survey.
 * --------------------------
 */
async function getAllParticipationsSurvey(req, res, next) {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);

  try {
    // Recovers all participations under certain conditions
    const participation = await Participation.findAndCountAll({
      where: { surveyId: req.params.surveyId },
      include: [
        {
          model: User,
          attributes: ['username', 'email'],
        },
      ],
      limit: limit,
      offset: offset,
    });

    if (!participation) {
      throw new Error('Some error occurred while retrieving participations');
    }

    const response = getPagingData(participation, page, limit);
    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({
      message: err.message,
    });
  }
}

/**
 * --------------------------
 * Get participation according
 * to subject related to survey.
 * --------------------------
 */
async function getAllParticipationsSubject(req, res, next) {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);

  try {
    // Recovers all participations under certain conditions
    const participationSubject = await ParticipationSubject.findAndCountAll({
      where: {
        [Op.and]: {
          subjectId: req.params.subjectId,
        },
      },
      include: [
        {
          model: Participation,
          include: [
            {
              model: User,
              attributes: ['username', 'email'],
            },
          ],
        },
      ],
      limit: limit,
      offset: offset,
    });

    if (!participationSubject) {
      throw new Error('Some error occurred while retrieving participations to subject');
    }

    const response = getPagingData(participationSubject, page, limit);
    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({
      message: err.message,
    });
  }
}

/**
 * --------------------------
 * Get participation according
 * to subject related to survey.
 * --------------------------
 */
async function getAllSelectedAnswerByIdAnswer(req, res, next) {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);

  try {
    // Recovers all participations under certain conditions
    const selectedAnswer = await SelectedAnswer.findAndCountAll({
      where: {
        [Op.and]: {
          answerId: req.params.answerId,
        },
      },
      include: [
        {
          model: ParticipationSubject,
          include: [
            {
              model: Participation,
              include: [
                {
                  model: User,
                  attributes: ['username', 'email'],
                },
              ],
            },
          ],
        },
      ],
      limit: limit,
      offset: offset,
    });

    if (!selectedAnswer) {
      throw new Error('Some error occurred while retrieving participations to subject');
    }

    const response = getPagingData(selectedAnswer, page, limit);
    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({
      message: err.message,
    });
  }
}

module.exports = {
  selectAnswer,
  getAllParticipationsSurvey,
  getAllParticipationsSubject,
  getAllSelectedAnswerByIdAnswer,
};
