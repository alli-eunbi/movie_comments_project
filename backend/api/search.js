//*영화 검색 페이지
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
const search = express.Router();

//스웨거 사용
/**
 * @swagger
 *  /movies/search:
 *    get:
 *      tags: [MAIN]
 *      description: "/movies/search?keyword=검색어 로 영화 데이터 조회"
 *      produces:
 *      - application/json
 *      parameters:
 *      - in: query
 *        name: keyword
 *        required : true
 *        schema:
 *           type: string
 *        description: "검색어"
 *        responses:
 *           "200":
 *          description: 검색어 기반 영화 조회 성공, 로그인된 경우만 "isliked"가 true나 false로 보내짐, 로그인이 되어 있지 않을 경우 "isliked"는 없음.
 *          content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                ok:
 *                  type: boolean
 *                data:
 *                  type: string
 *                  example:
 *                data": [
 *                  { "index": 221,
 *                  "title": "The Monster of Mangatiti",
 *                  "genre": "다큐멘터리",
 *                  "plot": "1980년대 외딴 농장에서 포악한 약탈자에게 포로로 잡힌 불굴의 십대의 이야기를 드라마로 구성한 충격 실화",
 *                  "publish_year": 2015,
 *                  "poster_url": "https://movie-phinf.pstatic.net/20160530_103/1464575780269B9XaM_JPEG/movie_image.jpg?type=m203_290_2",
 *                  "imdb_score": 6.2,
 *                  "naver_user_score": 0,
 *                  "naver_user_count": 0,
 *                  "naver_expert_score": 0,
 *                  "naver_expert_count": 0,
 *                  "isLiked": false
 *                  }]
 *            "400":
 *              description: 검색어 없는 경우
 *               example: 키워드가 없습니다.
 *            "500":
 *              description: 서버 내부 에러
 */
search.get("/movies/search", logInChecker, async (req, res, next) => {
  try {
    const { keyword } = req.query;
    console.log(keyword);
    const index = req?.user?.user_index;
    const isLoggedIn = !!index;
    console.log(isLoggedIn, "로그인 여부 ");

    if (!keyword) {
      res.statusCode = 400;
      return res.send({ message: "키워드가 없습니다" });
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

//*영화 상세 페이지
search.get("/movies/:movie_id", logInChecker, async (req, res) => {
  try {
    const { movie_id } = req.params;
    const index = req?.user?.user_index;
    const isLoggedIn = !!index;
    console.log(isLoggedIn, "로그인 여부 ");
    if (!movie_id) {
      return (res.statusCode = 400);
    }
    const movie_info = await Movie.findOne({
      where: {
        index: movie_id,
      },
    });
    if (!movie_info) {
      res.statusCode = 404;
      return res.end();
    }
    const review_data = await Movie_review.findAll({
      where: {
        movie_index: movie_id,
      },
    });
    if (isLoggedIn) {
      //* 나의 좋아요
      const isLiked = await Want_watch.findOne({
        where: {
          user_index: index,
          movie_index: movie_id,
        },
      });
      res.statusCode = 200;
      return res.send({
        data: { movie_info, review_data, isLiked: !!isLiked },
      });
    }
    res.statusCode = 200;
    return res.send({ data: { movie_info, review_data } });
  } catch (e) {
    console.log(e, "에러");
    res.statusCode = 500;
    return res.end();
  }
});
export default search;
