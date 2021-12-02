const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.UserRole, {
        foreignKey: 'userId',
      });
      User.hasMany(models.Participation, {
        foreignKey: 'userId',
      });
      User.hasMany(models.Pool, {
        foreignKey: 'userId',
      });
      User.belongsTo(models.Adresse, {
        foreignKey: 'adresseId',
      });
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      adresseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'User',
    }
  );
  return User;
};
