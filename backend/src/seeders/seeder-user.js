"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Users", [
      {
        firstName: "Tu",
        lastName: "Tran",
        email: "admin@gmail.com",
        password: "1234560",
        address: "Cau Giay",
        gender: 1,
        roleId: "R1",
        phoneNumber: "R1",
        positionId: "CG",
        image: "image1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
