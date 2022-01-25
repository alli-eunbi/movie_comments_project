const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
const User = require('./user')
const Movie = require('./movie')
const Want_watch = require('./want_watch')
const Movie_review = require('./movie_review')
const User_review = require('./user_review')
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.User = User;
db.Movie = Movie;
db.Want_watch = Want_watch;
db.Movie_review = Movie_review;
db.User_review = User_review;

User.init(sequelize)
Movie.init(sequelize)
Want_watch.init(sequelize)
Movie_review.init(sequelize)
User_review.init(sequelize)

User.associate(db)
Movie.associate(db)
Want_watch.associate(db)
Movie_review.associate(db)
User_review.associate(db)

module.exports = db;
