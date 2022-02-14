const express = require('express')
const { User } = require('../models/index')
const { logInChecker } = require('./middleware')

const router = express.Router()

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
// 유저 랭킹 페이지를 불러오기 위한 api
router.get('/', logInChecker , async (req, res, next) => {
  try {
    // 온도가 높은 인원 3명을 먼저 가져와보자
    const userTemperatureList = await User.findAll({
      attributes: ['index', 'name', 'profile_image', 'temperature'],
      order: [['temperature', 'DESC']]
    })

    // 리뷰 개수가 높은 인원 3명 가져오기
    const userReviewNumList = await User.findAll({
      attributes: ['index', 'name', 'profile_image', 'review_num'],
      order: [['review_num', 'DESC']]
    })

    // 로그인 한 유저의 순위를 담을 변수
    let myTemperatureRank, myReviewNumRank;

    // 로그인 한 유저의 순위를 담기 위한 for 문
    const user_index = req.user ? req.user.user_index : undefined
    if (user_index) {
      for (let i = 0; i < userTemperatureList.length; i++) {
        if (userTemperatureList[i].index === user_index) {
          myTemperatureRank = i + 1
          break
        }
      }
    }

    if (user_index) {
      for (let i = 0; i < userReviewNumList.length; i++) {
        if (userReviewNumList[i].index === user_index) {
          myReviewNumRank = i + 1
          break
        }
      }
    }

    const response = {
      success: true,
      message: '랭킹 정보 전달 성공',
      temperature_rank: userTemperatureList.slice(0, 5),
      user_temperature_rank: myTemperatureRank,
      reviewNum_rank: userReviewNumList.slice(0, 5),
      user_review_rank: myReviewNumRank
    }

    res.json(response)

  } catch (err) {
    console.error(err)
    next(err)
  }
})

module.exports = router