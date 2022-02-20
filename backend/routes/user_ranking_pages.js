const express = require('express')
const usersRankingPageController = require('../controllers/user_ranking')
const { logInChecker } = require('./middleware')

const router = express.Router()

// 유저 랭킹 페이지를 불러오기 위한 api
router.get('/', logInChecker, usersRankingPageController.showUsersRanking)

module.exports = router

/**
 * @swagger
 * /user-ranking:
 *  get:
 *    summary: 유저들의 랭킹을 보기 위한 페이지에 관한 api 참고로 201응답 코드는 설명을 위해 201로 사용하였고 실제로는 200응답으로 갑니다.
 *    tags:
 *    - USER-RANKING
 *    responses:
 *      200:
 *        description: 로그인 했다면 해당 유저의 랭킹과 모든 유저의 랭킹을 보내준다.
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
 *                  example: 랭킹 정보 전달 성공
 *                temperature_rank:
 *                  type: array
 *                  example: [{index: 해당 유저인덱스, name: 닉네임, profile_image: 프로필이미지, temperature: 온도}, ...]
 *                user_temperature_rank:
 *                  type: integer
 *                  example: 로그인한 유저의 온도 순위
 *                reviewNum_rank:
 *                  type: array
 *                  example: [{index: 해당 유저인덱스, name: 닉네임, profile_image: 프로필이미지, temperature: 영화리뷰개수}, ...]
 *                user_review_rank:
 *                  type: integer
 *                  example: 로그인한 유저의 리뷰 순위
 *                  
 *      201:
 *        description: 로그인 하지 않았다면 모든 유저의 랭킹만 보여준다.
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
 *                  example: 랭킹 정보 전달 성공
 *                temperature_rank:
 *                  type: array
 *                  example: [{index: 해당 유저인덱스, name: 닉네임, profile_image: 프로필이미지, temperature: 온도}, ...]
 *                reviewNum_rank:
 *                  type: array
 *                  example: [{index: 해당 유저인덱스, name: 닉네임, profile_image: 프로필이미지, temperature: 영화리뷰개수}, ...]
 *      500:
 *        description: 서버 에러
 */