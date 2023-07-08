const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Game extends Model {
    static associate(models) {
      this.belongsToMany(models.Player, {
        through: 'Participant',
        as: 'players',
        foreignKey: 'game_id',
      });

      this.belongsTo(models.Player, {
        as: 'winner',
        foreignKey: 'winner_id',
      });
    }
  }

  Game.init(
    {
      game_code: {
        type: DataTypes.STRING, // Adjust the data type according to your needs
        allowNull: false,
        unique: true,
      },
      winner_id: DataTypes.INTEGER,
      player_in_turn: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Game',
    }
  );

  return Game;
};
