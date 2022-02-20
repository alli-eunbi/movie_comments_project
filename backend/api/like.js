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

/**
 * @swagger
 * /movies/{movie_id}/like:
 *  post:
 *    summary: 영화 보고싶어요(혹은 좋아요) 데이터 보내기
 *    tags:
 *    - Service
 *    parameters:
 *      - name: movie_id
 *        in: path
 *        required: true
 *        description: 영화의 인덱스
 *        schema:
 *          type: integer
 *    responses:
 *      200:
 *        description: 좋아요 성공
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: 좋아요 등록 완료
 *      400:
 *        description: 영화 인덱스가 없는 경우
 *      401:
 *        description: 유저 인덱스가 없는 경우(로그인되어 있지 않을 경우)
 *      500:
 *        description: 서버 에러
 */
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

/**
 * @swagger
 * /movies/{movie_id}/dislike:
 *  delete:
 *    summary: 영화 보고싶어요(혹은 좋아요) 취소하기
 *    tags:
 *    - Service
 *    parameters:
 *      - name: movie_id
 *        in: path
 *        required: true
 *        description: 영화의 인덱스
 *        schema:
 *          type: integer
 *    responses:
 *      200:
 *        description: 좋아요 취소
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: 좋아요 취소 완료
 *      400:
 *        description: 영화 인덱스가 없는 경우
 *      401:
 *        description: 유저 인덱스가 없는 경우(로그인되어 있지 않을 경우)
 *      500:
 *        description: 서버 에러
 */
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
