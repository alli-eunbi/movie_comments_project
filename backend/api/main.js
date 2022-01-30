//const dotenv = require("dotenv");
//*페이지 네이션 추가, 주석 추가하기, 코드 리팩토링, error케이스 추가 생산, 라우터 분리
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
const main = express.Router();

main.get("/movies", logInChecker, async (req, res) => {
  //TODO 페이지네이션하기
  //? url query 로 keyword받기
  const index = req?.user?.user_index;
  const isLoggedIn = !!index;
  try {
    const movies = await Movie.findAll({
      order: sequelize.random(),
      attributes: ["index", "poster_url"],
      where: {
        poster_url: {
          [Op.ne]: null,
        },
      },
      limit: 8,
      subQuery: false,
    });

    if (isLoggedIn) {
      //* 나의 좋아요들
      const likes = await Want_watch.findAll({
        where: {
          user_index: index,
        },
      });

      //* 해당 키워드 영화들중 내가 좋아요한 영화가 있는지
      const result = movies.map((_movie) => {
        if (likes.some((like) => like.movie_id === _movie.id)) {
          return { ..._movie, isLiked: true };
        }
        return { ..._movie, isLiked: false };
      });

      res.statusCode = 200;
      return res.send({ data: result });
    }
    res.statusCode = 200;
    return res.send({ data: movies });
  } catch (e) {
    console.log(e, "에러");
    res.statusCode = 500;
    return res.end();
  }
});

//*영화 검색 페이지
main.get("/movies/search", logInChecker, async (req, res, next) => {
  try {
    const { keyword } = req.query;
    const index = req?.user?.user_index;
    const isLoggedIn = !!index;
    console.log(isLoggedIn, "로그인 여부 ");

    if (!keyword) {
      res.statusCode = 400;
      return res.send("키워드가 없습니다");
    }

    //* 해당 키워드의 영화들
    const movies = await Movie.findAll({
      where: {
        title: {
          [Op.like]: `%${keyword}%`,
        },
      },
      raw: true,
    });
    if (isLoggedIn) {
      //* 나의 좋아요들
      const likes = await Want_watch.findAll({
        where: {
          user_index: index,
        },
      });
      console.log(likes, "좋아요들");
      //* 해당 키워드 영화들중 내가 좋아요한 영화가 있는지
      const result = movies.map((_movie) => {
        if (likes.some((like) => like.movie_id === _movie.id)) {
          return { ..._movie, isLiked: true };
        }
        return _movie;
      });
      res.statusCode = 200;
      return res.send({ data: result });
    }
    res.statusCode = 200;
    return res.send({ data: movies });
  } catch (e) {
    console.log(e, "에러");
    res.statusCode = 500;
    return res.end();
  }
});

main.post("/movies/:movie_id/like", logInChecker, async (req, res) => {
  const { movie_id } = req.params;
  const { user_id } = req.user;
  if (!movie_id) {
    res.statusCode = 400;
    return res.end();
  }
  if (!user_id) {
    res.statusCode = 401;
    return res.end();
  }
  try {
    await Want_watch.create({
      user_index: user_id,
      movie_index: movie_id,
    });
    res.statusCode = 200;
    res.send("ok");
  } catch (e) {
    console.error(e);
    res.statusCode = 500;
    res.end();
  }
});

main.delete("/movies/:movie_id/dislike", logInChecker, async (req, res) => {
  const { movie_id } = req.params;
  const { user_id } = req.user;
  if (!movie_id) {
    res.statusCode = 400;
    return res.end();
  }
  if (!user_id) {
    res.statusCode = 401;
    return res.end();
  }
  try {
    await Want_watch.destroy({
      where: {
        user_index: user_id,
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

main.post("/movies/:movie_id/rating", logInChecker, async (req, res) => {
  const { movie_id } = req.params;
  const { user_id } = req.user;
  const { rating } = req.body;

  if (!movie_id) {
    res.statusCode = 400;
    return res.end();
  }
  if (!user_id) {
    res.statusCode = 401;
    return res.end();
  }
  if (!rating) {
    res.statusCode = 400;
    return res.end();
  }
  try {
    await Movie_review.create({
      user_index: user_id,
      movie_index: movie_id,
      score: rating,
    });
    res.statusCode = 200;
    return res.end();
  } catch (e) {
    res.statusCode = 500;
    return res.end();
  }
});
//이미 있다면? 추가하기 혹은 FindorCreate로 바꾸기, 유저 테이블의 review_num 추가해주기

main.post("/movies/:movie_id/comment", logInChecker, async (req, res) => {
  const { movie_id } = req.params;
  const { text } = req.body;
  const { user_id } = req.user;

  if (!movie_id) {
    res.statusCode = 400;
    return res.end();
  }
  if (!user_id) {
    res.statusCode = 401;
    return res.end();
  }
  if (!text) {
    res.statusCode = 400;
    return res.end();
  }
  try {
    await Movie_review.create({
      user_index: user_id,
      movie_index: movie_id,
      comment: text,
    });
    res.statusCode = 200;
    return res.end();
  } catch (e) {
    res.statusCode = 500;
    return res.end();
  }
});
//이미 있다면? 추가하기, 유저 테이블의 review_num 추가해주기

main.put("/movies/:movie_id/comment", logInChecker, async (req, res) => {
  const { movie_id } = req.params;
  const { text } = req.body;
  const { user_id } = req.user;
  if (!movie_id) {
    res.statusCode = 400;
    return res.end();
  }
  if (!user_id) {
    res.statusCode = 401;
    return res.end();
  }
  if (!text) {
    res.statusCode = 400;
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
    await Movie_review.update(
      {
        comment: text,
      },
      { where: { user_index: user_id, movie_index: movie_id } }
    );
    res.statusCode = 200;
    return res.end();
  } catch (e) {
    res.statusCode = 500;
    return res.end();
  }
});

main.delete("/movies/:movie_id/comment", logInChecker, async (req, res) => {
  const { movie_id } = req.params;
  const { user_id } = req.user;
  if (!movie_id) {
    res.statusCode = 400;
    return res.end();
  }
  if (!user_id) {
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
        user_index: user_id,
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

export default main;
