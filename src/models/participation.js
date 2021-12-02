const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Participation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Participation.hasMany(models.Choice, {
        foreignKey: 'participationId',
      });
      Participation.belongsTo(models.User, {
        foreignKey: 'userId',
      });
      Participation.belongsTo(models.Pool, {
        foreignKey: 'poolId',
      });
    }
  }
  Participation.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      poolId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Participation',
    }
  );
  return Participation;
};
