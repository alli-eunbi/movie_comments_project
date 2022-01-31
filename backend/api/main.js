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

//스웨거 사용
/**
 * @swagger
 * /movies:
 *  get:
 *    summary: 메인페이지의 영화 포스터 데이터 불러오기
 *    tags:
 *      - MAIN
 *    responses:
 *      200:
 *        description: 포스터 8개 데이터 전달 성공, isLiked는 로그인 하지 않았을 경우 data에 포함되지 않음. 로그인 되어 있는 경우 isLiked는 true 혹은 false로 전송
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: object
 *                  example: [{"index":6562,"poster_url":"https://movie-phinf.pstatic.net/20170118_31/14847059479790YrAT_JPEG/movie_image.jpg?type=m203_290_2"},{"index":5615,"poster_url":"https://movie-phinf.pstatic.net/20200220_249/15821856046314x21v_JPEG/movie_image.jpg?type=m203_290_2"},{"index":882,"poster_url":"https://movie-phinf.pstatic.net/20111222_108/1324495565302Pc8wc_JPEG/movie_image.jpg?type=m203_290_2"},{"index":2235,"poster_url":"https://movie-phinf.pstatic.net/20111222_8/1324550141503pCeQ4_JPEG/movie_image.jpg?type=m203_290_2"},{"index":2159,"poster_url":"https://movie-phinf.pstatic.net/20210805_300/162814061484975IGc_JPEG/movie_image.jpg?type=m203_290_2"},{"index":5329,"poster_url":"https://movie-phinf.pstatic.net/20111222_285/1324561324283YjFPm_JPEG/movie_image.jpg?type=m203_290_2"},{"index":1692,"poster_url":"https://movie-phinf.pstatic.net/20210723_183/1627015769493LNnaP_JPEG/movie_image.jpg?type=m203_290_2"},{"index":6527,"poster_url":"https://movie-phinf.pstatic.net/20111222_269/1324520502386h95JO_JPEG/movie_image.jpg?type=m203_290_2"}]
 *      500:
 *        description: 서버 내부 에러
 */

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
