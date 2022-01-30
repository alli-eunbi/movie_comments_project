const { Model, DataTypes } = require('sequelize')

module.exports = class User_review extends Model {
  static init(sequelize) {
    return super.init({
      index: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      reviewed_index: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      reviewer_index: {
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
      modelName: 'User_review',
      tableName: 'User_review',
      paranoid: false,
      charset: 'utf8',
      collate: 'utf8_general_ci'
    })
  }

  static associate(db) {
    db.User_review.belongsTo(db.User, {foreignKey: 'reviewed_index', sourceKey: 'index'})
    db.User_review.belongsTo(db.User, {foreignKey: 'reviewer_index', sourceKey: 'index'})
  }
}