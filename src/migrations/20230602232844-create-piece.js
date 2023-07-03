module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Pieces', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      player_id: { // Cambio de participant_id a player_id
        type: Sequelize.INTEGER,
        references: {
          model: 'Players', // name of Target model
          key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      game_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Games',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      base_position: {
        type: Sequelize.INTEGER,
      },
      enter_position: {
        type: Sequelize.INTEGER,
      },
      position: {
        type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.STRING,
      },
      left_to_finish: {
        type: Sequelize.INTEGER,
      },
      number: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 4 },
      },
      color: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('Pieces');
  },
};
