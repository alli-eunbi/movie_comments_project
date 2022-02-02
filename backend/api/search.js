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
 * /movies/search:
 *  get:
 *    summary: 영화 검색 페이지
 *    tags:
 *      - MAIN
 *    parameters:
 *      - name: keyword
 *        in: query
 *        required: true
 *        description: 검색어
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: 검색결과 데이터 전달 성공, isLiked는 로그인 하지 않았을 경우 data에 포함되지 않음. 로그인 되어 있는 경우 isLiked는 true 혹은 false로 전송
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: object
 *                  example: [{"index":5,"title":"춤추는 남자들","genre":"드라마","plot":"동성애자인 아흐메트는 남성 벨리댄서와 연인에게 자극 받아, 보수적인 가족에게 동성애자임을 밝히지만 이는 비극적인 결과를 낳는다.","publish_year":2012,"poster_url":"https://movie-phinf.pstatic.net/20180831_61/15356896197711rW9C_JPEG/movie_image.jpg?type=m203_290_2","imdb_score":0,"naver_user_score":0,"naver_user_count":0,"naver_expert_score":0,"naver_expert_count":0, "isLiked" : true}]
 *      400:
 *        description: 키워드가 전달되지 않은 경우
 *        content:
 *          application/json:
 *            schema:
 *              type : object
 *              properties:
 *                message:
 *                  type: object
 *                  example: {"message":"키워드가 없습니다"}
 *      500:
 *        description: 서버 내부 에러
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

/**
 * @swagger
 * /movies/{movie_id}:
 *  get:
 *    summary: 영화 상세 페이지
 *    tags:
 *      - MAIN
 *    parameters:
 *      - name: movie_id
 *        in: path
 *        required: true
 *        description: 영화의 인덱스
 *        schema:
 *          type: integer
 *    responses:
 *      200:
 *        description: 영화 상세 데이터 전달 성공, isLiked는 로그인 하지 않았을 경우 data에 포함되지 않음. 로그인 되어 있는 경우 isLiked는 true 혹은 false로 전송
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: object
 *                  example: {"movie_info":{"index":1,"title":"실종 2","genre":"스릴러","plot":"사채까지 쓴 처지에 취업만이 살길인 선영. 각오를 다지며 최종 면접이 있을 산으로 향한다. 뜻하지 않게 목격한 끔찍한 상황, 도망쳐 다다른 곳엔 더한 지옥이 기다리고 있었으니. 살아남으려면 뭐든 해야 한다. 손에 피를 묻힐지라도.","publish_year":2016,"poster_url":"https://movie-phinf.pstatic.net/20171128_221/1511853722091CXitW_JPEG/movie_image.jpg?type=m203_290_2","imdb_score":0,"naver_user_score":3.49,"naver_user_count":254,"naver_expert_score":0,"naver_expert_count":0},"review_data":[{"index":1,"user_index":1,"movie_index":1,"score":null,"comment":"춤추는 사람들 얘기다"}]}
 *      400:
 *        description: 영화 인덱스가 전달되지 않은 경우
 *      500:
 *        description: 서버 내부 에러
 */
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
