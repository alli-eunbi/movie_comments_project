const {Model, DataTypes} = require('sequelize')

module.exports = class User extends Model {
  static init(sequelize) {
    return super.init({
      index: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      id: {
        type: DataTypes.STRING(12),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(12),
        allowNull: false,
      },
      password: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      profile_image: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: 'profile image',
      },
      temperature: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      review_num: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      social: {
        type: DataTypes.STRING(12),
        allowNull: false,
        defaultValue: 'local'
      }
    }, {
      sequelize,
      timestamps: false,
      underscored: false,
      modelName: 'User',
      tableName: 'User',
      paranoid: false,
      charset: 'utf8',
      collate: 'utf8_general_ci'
    })
  }

  static associate(db) {
    db.User.hasMany(db.Want_watch, {foreignKey: 'user_index', sourceKey: 'index'})
    db.User.hasMany(db.Movie_review, {foreignKey: 'user_index', sourceKey: 'index'})
    db.User.hasMany(db.User_review, {foreignKey: 'reviewed_index', sourceKey: 'index'})
    db.User.hasMany(db.User_review, {foreignKey: 'reviewer_index', sourceKey: 'index'})
  }
}