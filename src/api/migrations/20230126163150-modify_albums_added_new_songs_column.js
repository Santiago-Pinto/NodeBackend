"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      "Albums",
      "songs", // new field name
      {
        type: Sequelize.DataTypes.ARRAY(Sequelize.DataTypes.STRING),
        allowNull: true,
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("Albums", "songs");
  },
};
