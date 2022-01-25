const {Model, DataTypes} = require('sequelize')

module.exports = class Want_watch extends Model {
  static init(sequelize) {
    return super.init({
      index: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      user_index: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      movie_index: {
        type: DataTypes.INTEGER,
        allowNull: false,
      }
    }, {
      sequelize,
      timestamps: false,
      underscored: false,
      modelName: 'Want_watch',
      tableName: 'Want_watch',
      paranoid: false,
      charset: 'utf8',
      collate: 'utf8_general_ci'
    })
  }

  static associate(db) {
    db.Want_watch.belongsTo(db.User, {foreignKey: 'user_index', sourceKey: 'index'})
    db.Want_watch.belongsTo(db.Movie, {foreignKey: 'movie_index', sourceKey: 'index'})
  }
}