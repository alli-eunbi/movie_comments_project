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
        if (likes.some((like) => like.movie_index === _movie.index)) {
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

export default main;
