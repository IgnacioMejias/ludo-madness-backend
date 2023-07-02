const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Participant extends Model {
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
      this.belongsTo(models.Game, {
        foreignKey: 'game_id',
        as: 'game',
      });
    }
  }
  Participant.init({
    player_id: DataTypes.INTEGER,
    game_id: DataTypes.INTEGER,
    number: DataTypes.INTEGER,
    color: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Participant',
  });
  return Participant;
};
