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

/**
 * @swagger
 * /movies/{movie_id}/rating:
 *  post:
 *    summary: 영화 별점 매기기
 *    tags:
 *    - Service
 *    parameters:
 *      - name: movie_id
 *        in: path
 *        required: true
 *        description: 영화의 인덱스
 *        schema:
 *          type: integer
 *    requestBody:
 *      description: 별점 정보를 body에 담아 보낸다.
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *           type: object
 *           properties:
 *            rating:
 *             type: integer
 *             example: 7
 *    responses:
 *      200:
 *        description: 평점 작성 성공
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: 평점 작성 완료
 *      400:
 *        description: 영화 인덱스가 없는 경우, 평점 데이터가 없는 경우
 *      401:
 *        description: 유저 인덱스가 없는 경우(로그인이 되어 있지 않은 경우)
 *      500:
 *        description: 서버 에러
 */
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
    return res.send({ message: "평점 작성 완료" });
  } catch (e) {
    res.statusCode = 500;
    return res.end();
  }
});

/**
 * @swagger
 * /movies/{movie_id}/rating:
 *  delete:
 *    summary: 영화 별점 삭제
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
 *        description: 평점 삭제 완료
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: 평점 삭제 완료
 *      400:
 *        description: 영화 인덱스가 없는 경우
 *      401:
 *        description: 유저 인덱스가 없는 경우(로그인이 되어 있지 않은 경우)
 *      500:
 *        description: 서버 에러
 */
review.delete("/movies/:movie_id/rating", logInChecker, async (req, res) => {
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
    await Movie_review.destroy({
      user_index: user_index,
      movie_index: movie_id,
    });
    res.statusCode = 200;
    return res.send({ message: "평점 삭제 완료" });
  } catch (e) {
    res.statusCode = 500;
    return res.end();
  }
});

/**
 * @swagger
 * /movies/{movie_id}/comment:
 *  post:
 *    summary: 영화 평가 작성
 *    tags:
 *    - Service
 *    parameters:
 *      - name: movie_id
 *        in: path
 *        required: true
 *        description: 영화의 인덱스
 *        schema:
 *          type: integer
 *    requestBody:
 *      description: 평가 정보를 body에 담아 보낸다.
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *           type: object
 *           properties:
 *            text:
 *             type: string
 *             example: 아주 재밌는 영화입니다.
 *    responses:
 *      200:
 *        description: 평점 작성 성공
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: 평가등록 완료
 *      400:
 *        description: 영화 인덱스가 없는 경우, 평가 데이터가 없는 경우
 *      401:
 *        description: 유저 인덱스가 없는 경우(로그인이 되어 있지 않은 경우)
 *      500:
 *        description: 서버 에러
 */
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

/**
 * @swagger
 * /movies/{movie_id}/comment:
 *  put:
 *    summary: 영화 평가 수정
 *    tags:
 *    - Service
 *    parameters:
 *      - name: movie_id
 *        in: path
 *        required: true
 *        description: 영화의 인덱스
 *        schema:
 *          type: integer
 *    requestBody:
 *      description: 평가 정보를 body에 담아 보낸다.
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *           type: object
 *           properties:
 *            text:
 *             type: string
 *             example: 아주 재미없는 영화입니다.
 *    responses:
 *      200:
 *        description: 평가 수정 성공
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: 평가 수정 완료
 *      400:
 *        description: 영화 인덱스가 없는 경우, 평가 데이터가 없는 경우
 *      401:
 *        description: 유저 인덱스가 없는 경우(로그인이 되어 있지 않은 경우)
 *      500:
 *        description: 서버 에러
 */
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

/**
 * @swagger
 * /movies/{movie_id}/comment:
 *  delete:
 *    summary: 영화 평가 수정
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
 *        description: 평가 삭제 성공
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: 평가 삭제 완료
 *      400:
 *        description: 영화 인덱스가 없는 경우, 평가 데이터가 없는 경우
 *      401:
 *        description: 유저 인덱스가 없는 경우(로그인이 되어 있지 않은 경우)
 *      500:
 *        description: 서버 에러
 */
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
    return res.send({ message: "평가 삭제 완료" });
  } catch (e) {
    res.statusCode = 500;
    return res.end();
  }
});

export default review;
