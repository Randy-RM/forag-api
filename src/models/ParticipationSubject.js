const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ParticipationSubject extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ParticipationSubject.hasMany(models.SelectedAnswer, {
        foreignKey: 'participationSubjectId',
      });
      ParticipationSubject.belongsTo(models.Participation, {
        foreignKey: 'participationId',
      });
      ParticipationSubject.belongsTo(models.Subject, {
        foreignKey: 'subjectId',
      });
    }
  }
  ParticipationSubject.init(
    {
      participationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      subjectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'ParticipationSubject',
    }
  );
  return ParticipationSubject;
};
