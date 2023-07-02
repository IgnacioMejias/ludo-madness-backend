const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Piece extends Model {
    static associate(models) {
      this.belongsTo(models.Player, {
        foreignKey: 'player_id',
        as: 'player',
      });
      this.belongsTo(models.Game, {
        foreignKey: 'game_id',
        as: 'game',
      });
    }
  }
  Piece.init({
    player_id: DataTypes.INTEGER,
    game_id: DataTypes.INTEGER,
    base_position: DataTypes.INTEGER,
    enter_position: DataTypes.INTEGER,
    position: DataTypes.INTEGER,
    status: DataTypes.STRING,
    left_to_finish: DataTypes.INTEGER,
    number: {
      type: DataTypes.INTEGER,
      validate: { min: 1, max: 4 },
    },
  }, {
    sequelize,
    modelName: 'Piece',
  });
  return Piece;
};
