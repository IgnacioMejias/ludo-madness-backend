module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Games', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      game_code: { // Add the game_code column definition
        type: Sequelize.STRING, // Adjust the data type according to your needs
        allowNull: false,
        unique: true,
      },
      winner_id: {
        type: Sequelize.INTEGER,
        references: { model: 'Players', key: 'id' },
        allowNull: true,
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Games');
  },
};
