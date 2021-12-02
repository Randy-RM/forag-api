const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Adresse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Adresse.hasOne(models.User, {
        foreignKey: 'adresseId',
      });
    }
  }
  Adresse.init(
    {
      street: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Adresse',
    }
  );
  return Adresse;
};
