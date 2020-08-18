'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('ApiServices', [{
      service_name: 'giftbit',
      url: 'https://api-testbed.giftbit.com/papi/v1/',
      token_type: 'Bearer',
      token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJTSEEyNTYifQ==.NURaNk9jYUFxSTdjVFZPR2dwTzM1b0p1VWdaMGRnMlZGd084V3F3ZUljc1RkN2hqVWtpTXhwRjVWblJrME1BSlRZR1NIRkdqMWNCblVaSEU1cHFoL0I1Vnp6NDNuckhydEp6ak8xOTVoQVNTa09GQzg5cnNaUXJDRlBEelBFeXA=.Aa96kmf+XXyhNQ8vaKPwMyQbCHWqptdGla06nNBUzOA=',
      createdAt: new Date(),
      updatedAt: new Date()
    }])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('ApiServices', null, {});
  }
};
