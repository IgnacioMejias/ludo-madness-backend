const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Player extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
      this.belongsToMany(models.Game, {
        through: 'Participant',
        as: 'games',
        foreignKey: 'player_id',
      });
      this.hasMany(models.Game, {
        foreignKey: 'winner_id',
        as: 'won_games',
      });
      // this.hasMany(models.Move, {
      //   foreignKey: 'participant_id',
      //   as: 'moves'
      // });
    }
  }
  Player.init({
    user_id: DataTypes.INTEGER,
    score: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Player',
  });
  return Player;
};
