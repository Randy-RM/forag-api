module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('SelectedAnswers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      choiceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Choices',
          key: 'id',
          as: 'choiceId',
        },
      },
      answerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Answers',
          key: 'id',
          as: 'answerId',
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
    await queryInterface.dropTable('SelectedAnswers');
  },
};
