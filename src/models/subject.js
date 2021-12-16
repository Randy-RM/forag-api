const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Subject extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Subject.hasMany(models.Answer, {
        foreignKey: 'subjectId',
      });
      Subject.hasMany(models.Choice, {
        foreignKey: 'subjectId',
      });
      Subject.belongsTo(models.Survey, {
        foreignKey: 'surveyId',
      });
    }
  }
  Subject.init(
    {
      subjectContent: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      surveyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Subject',
    }
  );
  return Subject;
};
