const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Move extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Player, {
        foreignKey: 'player_id',
        as: 'player',
      });
    }
  }
  Move.init({
    player_id: DataTypes.INTEGER,
    piece_id: DataTypes.INTEGER,
    position: DataTypes.INTEGER,
    dice_value: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Move',
  });
  return Move;
};
