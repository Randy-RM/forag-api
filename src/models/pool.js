const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Pool extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Pool.hasMany(models.Participation, {
        foreignKey: 'poolId',
      });
      Pool.hasMany(models.Subject, {
        foreignKey: 'poolId',
      });
      Pool.belongsTo(models.User, {
        foreignKey: 'userId',
      });
    }
  }
  Pool.init(
    {
      poolTitle: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Pool',
    }
  );
  return Pool;
};
