
const express = require('express')
const passport = require('passport')
const {User} = require('../models/index')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { isLoggedIn, isNotLoggedIn } = require('./middleware')
const loginController = require('../controllers/login')


const router = express.Router();

// 회원가입 api 처리
router.post("/register", isNotLoggedIn, loginController.register);

// 우선 처음 로그인 하는 경우 jwt를 발급해주자.
router.post("/login/local", isNotLoggedIn, loginController.loginLocal);

// 로그 아웃 api
router.get("/logout", isLoggedIn, (req, res, next) => {
  res.clearCookie("accessToken", { httpOnly: true });
  res.json({ success: true, message: "로그아웃 성공" });
});

// 카카오 로그인 및 회원가입 api
router.get(
  "/login/kakao",
  isNotLoggedIn,
  passport.authenticate("kakao", { session: false })
);

// 카카오 리다이랙트 api
router.get("/callback/kakao", loginController.kakaoCallback);

module.exports = router;

/**
 * @swagger
 * /user/register:
 *  post:
 *    summary: 유저의 회원가입과 관련된 api
 *    tags:
 *      - USER
 *    requestBody:
 *      description: 프로필 이미지, 아이디, 닉네임, 비밀번호1,2를 body에 담아 보낸다.
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              profile_img:
 *                type: string
 *                example: 유저 프로필 이미지 파일
 *              id:
 *                tpye: string
 *                example: 유저 아이디
 *              name:
 *                type: string
 *                example: 유저의 닉네임
 *              password:
 *                type: string
 *                example: 유저의 비밀번호1
 *              confirmpassword:
 *                type: string
 *                example: 유저의 비밀번호2
 *    responses:
 *      200:
 *        description: 회원가입 성공 후 로그인 페이지로 이동합니다.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                message:
 *                  type: string
 *                  example: 회원가입 성공
 *      201:
 *        description: 아이디가 이미 존재하는 경우
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: false
 *                message:
 *                  type: string
 *                  example: 이미 존재하는 아이디입니다.
 *      500:
 *        description: 서버 내부 에러
 */

// 로그인 api 처리
/**
 * @swagger
 * /user/login/local:
 *  post:
 *    summary: 로컬 로그인과 관련된 api
 *    tags:
 *    - USER
 *    requestBody:
 *      description: 유저의 아이디와 비밀번호를 body에 담아 보낸다.
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              id:
 *                type: string
 *                example: 유저 아이디
 *              password:
 *                type: string
 *                example: 유저 비밀번호
 *    responses:
 *      200:
 *        description: 로그인 성공
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: true
 *                message:
 *                  type: string
 *                  example: 로그인 완료
 *      201:
 *        description: 가입되지 않은 유저의 경우
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: false
 *                message:
 *                  type: string
 *                  example: 가입되지 않은 회원입니다.
 *      202:
 *        description: 비밀번호가 틀린 경우
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: false
 *                message:
 *                  type: string
 *                  example: 비밀번호가 일치하지 않습니다.
 *      500:
 *        description: 서버 에러
 */

// 로그아웃 api 처리
/**
 * @swagger
 * /user/logout:
 *  get:
 *    summary: 로그아웃과 관련된 api
 *    tags:
 *    - USER
 *    ApiKeyAuth:
 *      type: apiKey
 *      in: header
 *      name: accessToken
 *    responses:
 *      200:
 *        description: 로그아웃 성공
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: true
 *                message:
 *                  type: string
 *                  example: 로그아웃 성공
 *      201:
 *        description: 토큰이 잘못된 경우
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: false
 *                message:
 *                  type: string
 *                  example: 유효하지 않은 토큰입니다.
 *      202:
 *        description: 토큰이 만료된 경우 기본은 1일이 지나야 만료됨
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: false
 *                message:
 *                  type: string
 *                  example: 만료된 토큰입니다.
 *      500:
 *        description: 서버 에러
 */


/**
 * @swagger
 * /user/login/kakao:
 *  get:
 *    summary: 카카오 회원가입, 로그인과 관련된 api
 *    tags:
 *    - USER
 *    responses:
 *      200:
 *        description: 카카오 로그인 성공
 *        content:
 *          application/json:
 *            schema:
 *              success:
 *                type: boolean
 *                example: true
 *              message:
 *                type: string
 *                example: 로그인 완료
 *      204:
 *        description: 로그인이 되어있는 상태에서 시도하는 경우
 *        content:
 *          application/json:
 *            schema:
 *              success:
 *                type: boolean
 *                example: false
 *              message:
 *                type: string
 *                example: 유효하지 않은 접근입니다.
 *      500:
 *        description: 서버 에러
 */