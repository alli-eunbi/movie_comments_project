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
const review = express.Router();

review.post("/movies/:movie_id/rating", logInChecker, async (req, res) => {
  const { movie_id } = req.params;
  const user_index = req?.user?.user_index;
  const { rating } = req.body;

  if (!movie_id) {
    res.statusCode = 400;
    return res.end();
  }
  if (!user_index) {
    res.statusCode = 401;
    return res.end();
  }
  if (!rating) {
    res.statusCode = 400;
    return res.end();
  }
  try {
    await Movie_review.create({
      user_index: user_index,
      movie_index: movie_id,
      score: rating,
    });
    res.statusCode = 200;
    return res.send({ message: "평점 수정 완료" });
  } catch (e) {
    res.statusCode = 500;
    return res.end();
  }
});

review.post("/movies/:movie_id/comment", logInChecker, async (req, res) => {
  const { movie_id } = req.params;
  const { text } = req.body;
  const user_index = req?.user?.user_index;

  if (!movie_id) {
    res.statusCode = 400;
    return res.end();
  }
  if (!user_index) {
    res.statusCode = 401;
    return res.end();
  }
  if (!text) {
    res.statusCode = 400;
    return res.end();
  }
  try {
    await Movie_review.create({
      user_index: user_index,
      movie_index: movie_id,
      comment: text,
    });
    res.statusCode = 200;
    return res.send({ message: "평가 등록 완료" });
  } catch (e) {
    res.statusCode = 500;
    return res.end();
  }
});
//이미 있다면? 추가하기, 유저 테이블의 review_num 추가해주기

review.put("/movies/:movie_id/comment", logInChecker, async (req, res) => {
  const { movie_id } = req.params;
  const { text } = req.body;
  const user_index = req?.user?.user_index;
  if (!movie_id) {
    res.statusCode = 400;
    return res.end();
  }
  if (!user_index) {
    res.statusCode = 401;
    return res.end();
  }
  if (!text) {
    res.statusCode = 400;
    return res.end();
  }
  try {
    const exist = await Movie_review.findOne({
      where: { user_index: user_index, movie_index: movie_id },
    });
    if (!exist) {
      res.statusCode = 404;
      return res.end();
    }
    await Movie_review.update(
      {
        comment: text,
      },
      { where: { user_index: user_index, movie_index: movie_id } }
    );
    res.statusCode = 200;
    return res.send({ message: "평가 수정 완료" });
  } catch (e) {
    res.statusCode = 500;
    return res.end();
  }
});

review.delete("/movies/:movie_id/comment", logInChecker, async (req, res) => {
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
    const exist = await Movie_review.findOne({
      where: { user_index: user_id, movie_index: movie_id },
    });
    if (!exist) {
      res.statusCode = 404;
      return res.end();
    }
    await Movie_review.destroy({
      where: {
        user_index: user_index,
        movie_index: movie_id,
      },
    });
    res.statusCode = 200;
    return res.end();
  } catch (e) {
    res.statusCode = 500;
    return res.end();
  }
});

export default review;
