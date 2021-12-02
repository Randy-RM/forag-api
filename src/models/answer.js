const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Answer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Answer.hasMany(models.SelectedAnswer, {
        foreignKey: 'answerId',
      });
      Answer.belongsTo(models.Subject, {
        foreignKey: 'subjectId',
      });
    }
  }
  Answer.init(
    {
      answerContent: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      subjectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Answer',
    }
  );
  return Answer;
};
