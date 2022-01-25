const {Model, DataTypes} = require('sequelize')

module.exports = class Movie_review extends Model {
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
        allowNull: false
      },
      score: {
        type: DataTypes.INTEGER,
      },
      comment: {
        type: DataTypes.TEXT
      }
    }, {
      sequelize,
      timestamps: false,
      underscored: false,
      modelName: 'Movie_review',
      tableName: 'Movie_review',
      paranoid: false,
      charset: 'utf8',
      collate: 'utf8_general_ci'
    })
  }

  static associate(db) {
    db.Movie_review.belongsTo(db.User, {foreignKey: 'user_index', sourceKey: 'index'})
    db.Movie_review.belongsTo(db.Movie, {foreignKey: 'movie_index', sourceKey: 'index'})
  }
}