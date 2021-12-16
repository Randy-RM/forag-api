const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Survey extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Survey.hasMany(models.Participation, {
        foreignKey: 'surveyId',
      });
      Survey.hasMany(models.Subject, {
        foreignKey: 'surveyId',
      });
      Survey.belongsTo(models.User, {
        foreignKey: 'userId',
      });
    }
  }
  Survey.init(
    {
      surveyTitle: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      isSurveyPublished: {
        type: DataTypes.BOOLEAN(false),
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Survey',
    }
  );
  return Survey;
};
