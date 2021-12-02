module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Subjects', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      subjectContent: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      poolId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Pools',
          key: 'id',
          as: 'poolId',
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Subjects');
  },
};
