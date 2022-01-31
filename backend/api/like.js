const express = require("express");
const {
  Movie,
  Movie_review,
  sequelize,
  Want_watch,
  User,
  User_review,
} = require("../models");
const Sequelize = require("sequelize");
const { logInChecker } = require("../routes/middleware");

const Op = Sequelize.Op;
//dotenv.config()
const like = express.Router();

like.post("/movies/:movie_id/like", logInChecker, async (req, res) => {
  const { movie_id } = req.params;
  console.log(movie_id);
  const user_index = req?.user?.user_index;
  if (!movie_id) {
    res.statusCode = 400;
    return res.end();
  }
  if (!user_index) {
    res.statusCode = 401;
    return res.end();
  }
  try {
    await Want_watch.create({
      user_index: user_index,
      movie_index: movie_id,
    });
    res.statusCode = 200;
    res.send({ message: "좋아요 등록 완료" });
  } catch (e) {
    console.error(e);
    res.statusCode = 500;
    res.end();
  }
});

like.delete("/movies/:movie_id/dislike", logInChecker, async (req, res) => {
  const { movie_id } = req.params;
  const user_index = req?.user?.user_index;
  if (!movie_id) {
    res.statusCode = 400;
    return res.end();
  }
  if (!user_index) {
    res.statusCode = 401;
    return res.end();
  }
  try {
    await Want_watch.destroy({
      where: {
        user_index: user_index,
        movie_index: movie_id,
      },
    });
    res.statusCode = 200;
    return res.send({ message: "좋아요 취소 완료" });
  } catch (e) {
    res.statusCode = 500;
    return res.end();
  }
});

export default like;
