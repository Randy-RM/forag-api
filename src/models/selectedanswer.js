const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SelectedAnswer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SelectedAnswer.belongsTo(models.Choice, {
        foreignKey: 'choiceId',
      });
      SelectedAnswer.belongsTo(models.Answer, {
        foreignKey: 'answerId',
      });
    }
  }
  SelectedAnswer.init(
    {
      choiceId: DataTypes.INTEGER,
      answerId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'SelectedAnswer',
    }
  );
  return SelectedAnswer;
};
