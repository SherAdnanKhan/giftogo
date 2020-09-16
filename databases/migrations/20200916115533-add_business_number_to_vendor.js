'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'Vendors',
        'verified_token',
        {
          type: Sequelize.BOOLEAN,
          after: 'website'
        }
      ),
      queryInterface.addColumn(
        'Vendors',
        'verified_email',
        {
          type: Sequelize.STRING,
          after: 'website'
        }
      ),
      queryInterface.addColumn(
        'Vendors',
        'business_number',
        {
          type: Sequelize.STRING,
          after: 'website'
        }
      ),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
