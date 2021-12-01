module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert(
      'Roles',
      [
        {
          roleName: 'admin',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          roleName: 'organization',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          roleName: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Roles', null, {});
  },
};
