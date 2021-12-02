const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Choice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Choice.hasMany(models.SelectedAnswer, {
        foreignKey: 'choiceId',
      });
      Choice.belongsTo(models.Participation, {
        foreignKey: 'participationId',
      });
      Choice.belongsTo(models.Subject, {
        foreignKey: 'subjectId',
      });
    }
  }
  Choice.init(
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
      modelName: 'Choice',
    }
  );
  return Choice;
};
