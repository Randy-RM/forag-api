const { Subject, Answer } = require('../models');

/**
 * --------------------------
 * Method of creating or updating
 * an entity by its id if it exists
 * --------------------------
 */
async function createOrUpdateEntityById(model, idEntity, newData, InheritedProperty, transaction) {
  let data = {};
  try {
    // First try to find the record
    let foundData = idEntity ? await model.findOne({ where: { id: idEntity } }) : null;
    if (!foundData) {
      // Item not found, create a new one
      const dataCreated = transaction
        ? await model.create({ ...newData, ...InheritedProperty }, { transaction })
        : await model.create({ ...newData, ...InheritedProperty });

      if (!dataCreated) throw new Error('Some error occurred while creating');
      data = { ...dataCreated.dataValues };

      return { data: data, created: true, updated: false, error: null };
    }
    // Found data, update it
    if (transaction) {
      const dataUpdated = await model.update(newData, {
        where: { id: idEntity },
        transaction: transaction,
      });
      if (!dataUpdated[0]) throw new Error('Some error occurred while updating');
    }
    if (!transaction) {
      const dataUpdated = await model.update(newData, { where: { id: idEntity } });
      if (!dataUpdated[0]) throw new Error('Some error occurred while updating');
    }
    foundData = await model.findOne({ where: { id: idEntity } });
    data = { ...foundData.dataValues };

    return { data: data, created: false, updated: true, error: null };
  } catch (err) {
    return { data: null, created: false, updated: false, error: err.message };
  }
}

/**
 * --------------------------
 * Method of insertion in bulk
 * of subject and answers if they exist.
 * --------------------------
 */
async function bulkCreateSubjects(subjects, InheritedProperty, transaction) {
  try {
    if (!subjects && !InheritedProperty)
      throw new Error('Subject and InheritedProperty are require');

    for (const subject of subjects) {
      // Create a subject and save it in database
      const curentSubject = await createOrUpdateEntityById(
        Subject,
        null,
        subject,
        InheritedProperty,
        transaction
      );

      if (!curentSubject.data) throw new Error('Some error occurred while creating subject');

      if (subject.answers && subject.answers.length > 0) {
        for (const answer of subject.answers) {
          const curentAnswer = await createOrUpdateEntityById(
            Answer,
            null,
            answer,
            { subjectId: curentSubject.data.id },
            transaction
          );

          if (!curentAnswer.data) throw new Error('Some error occurred while creating answer');
        }
      }
    }
    return { created: true, error: null };
  } catch (err) {
    return { created: false, error: err.message };
  }
}

async function bulkUpdateSubjects() {
  return 0;
}

async function bulkCreateAnswers() {
  return 0;
}

async function bulkUpdateAnswers() {
  return 0;
}

module.exports = {
  createOrUpdateEntityById,
  bulkCreateSubjects,
  bulkUpdateSubjects,
  bulkCreateAnswers,
  bulkUpdateAnswers,
};
