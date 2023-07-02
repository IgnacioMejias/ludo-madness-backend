const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Game extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.Player, {
        // cambiar a 'Player'???
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
  Game.init({
    winner_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Game',
  });
  return Game;
};
