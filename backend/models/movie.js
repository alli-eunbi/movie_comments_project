const { Model, DataTypes } = require("sequelize");

module.exports = class Movie extends Model {
  static init(sequelize) {
    return super.init(
      {
        index: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        title: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        genre: {
          type: DataTypes.STRING(255),
        },
        plot: {
          type: DataTypes.TEXT,
        },
        publish_year: {
          type: DataTypes.INTEGER,
        },
        poster_url: {
          type: DataTypes.STRING(255),
        },
        imdb_score: {
          type: DataTypes.FLOAT,
        },
        naver_user_score: {
          type: DataTypes.FLOAT,
        },
        naver_user_count: {
          type: DataTypes.INTEGER,
        },
        naver_expert_score: {
          type: DataTypes.FLOAT,
        },
        naver_expert_count: {
          type: DataTypes.INTEGER,
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: "Movie",
        tableName: "Movie",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {
    db.Movie.hasMany(db.Want_watch, {
      foreignKey: "movie_index",
      sourceKey: "index",
    });
    db.Movie.hasMany(db.Movie_review, {
      foreignKey: "movie_index",
      sourceKey: "index",
    });
  }
};
