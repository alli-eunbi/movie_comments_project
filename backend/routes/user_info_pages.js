const express = require('express')
const {isLoggedIn, isNotLoggedIn} = require('./middleware')
const { User, Movie, Movie_review, Want_watch, User_review } = require('../models/index')

const router = express.Router()

/**
 * @swagger
 * /user-info/{user_id}:
 *  get:
 *    summary: 유저의 상세정보 페이지 요청
 *    tags:
 *      - USER-INFO
 *    parameters:
 *      - name: user_id
 *        in: path
 *        required: true
 *        description: 해당하는 유저의 인덱스를 준다.
 *        schema:
 *          type: integer
 *    responses:
 *      200:
 *        description: 상세정보 데이터 전달 성공
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                comment_movies:
 *                  type: object
 *                  example: [{comment: 'good', movie_index: 3, poster_url: 'url', score: 8, title: '실종 2'},...]
 *                temperature:
 *                  type: integer
 *                  example: 6
 *                want_watch_movies:
 *                  type: array
 *                  example: [{movie_index: 1, poster_url: 'url1', title: '춤추는 남자들'}, {movie_index: 2, poster_url: 'url2', title: '여배우는 오늘도'}]
 *      401:
 *        description: 잘못된 토큰을 전달했을때
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UnvalidToken'
 *      419:
 *        description: 토큰이 만료된 경우
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ExpiredToken'
 *      402:
 *        description: user_id로 넘겨준 인덱스가 User 테이블에 없는경우
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
 *                  example: 없는 유저의 인덱스 입니다.
 *      500:
 *        description: 서버 내부 에러           
 */

// 유저 상세 페이지 이동 api
// 보내줘야되는 데이터는 영화 제목, 포스터, 별점, 코멘트, 상세페이지 유저의 온도, 보고싶은 영화
// 하나의 영화당 { 제목, 포스터, 별점, 코멘트 } 의 형식으로 보내주자
// 전체 데이터는 { 온도: 온도, 평가한영화들: [{영화1}, {영화2}, ... ], 보고싶은영화들: [ {제목, 포스터}, ...} ...] 의 형식
router.get('/:user_id', isLoggedIn, async (req, res, next) => {
  try {
    // 상세페이지에 해당하는 유저의 id
    const user_id = req.params.user_id

    // 보고싶은 영화들 먼저 선택한다.
    const want_watch_movies = await Want_watch.findAll({
      where: {
        user_index: user_id
      },
      attributes: ['movie_index'],
      include: [{
        model: Movie,
        attributes: ['title', 'poster_url']
      }]
    })

    const wantWatchMoviesArray = []  // 보고싶은 영화정보들을 담을 배열
    want_watch_movies.forEach(el => {
      const wantWatchMovie = {}      // 보고싶은 영화 정보를 담을 객체
      wantWatchMovie.movie_index = el.movie_index
      wantWatchMovie.title = el.Movie.title
      wantWatchMovie.poster_url = el.Movie.poster_url
      wantWatchMoviesArray.push(wantWatchMovie)
    })

    // 영화 평가 목록들을 가져오는 코드
    const comment_movies = await Movie_review.findAll({
      where: {
        user_index: user_id
      },
      attributes: ['movie_index', 'score', 'comment'],
      include: [{
        model: Movie,
        attributes: ['title', 'poster_url']
      }]
    })

    const commentMoviesArray = []  // 평가한 영화정보들을 담을 배열
    comment_movies.forEach(el => {
      const commentMovie = {}     // 평가한 영화 정보를 담을 객체
      commentMovie.movie_index = el.movie_index
      commentMovie.title = el.Movie.title
      commentMovie.poster_url = el.Movie.poster_url
      commentMovie.score = el.score
      commentMovie.comment = el.comment
      commentMoviesArray.push(commentMovie)
    })

    // 유저의 온도를 가져오는 코드
    const {temperature} = await User.findOne({
      where: { index: user_id },
      attributes: ['temperature']
    })

    const response = {
      temperature,
      want_watch_movies: wantWatchMoviesArray,
      comment_movies: commentMoviesArray
    }
    res.json(response)
    
  } catch (err) {
    if (err.name === 'TypeError') return res.status(402).json({success: false, message: '없는 유저의 인덱스 입니다.'})
    console.error(err)
    next(err)
  }
})



/**
 * @swagger
 * /user-info/rating/{reviewed_user_id}:
 *  post:
 *    summary: 유저의 상세정보 페이지 요청
 *    tags:
 *      - USER-INFO
 *    parameters:
 *      - name: reviewed_user_id
 *        in: path
 *        required: true
 *        description: 평가받는 유저의 인덱스를 준다.
 *        schema:
 *          type: integer
 *    requestBody:
 *      description: 평가한 점수와 코멘트를 전달한다.
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              score:
 *                type: integer
 *                example: 6
 *              comment:
 *                type: string
 *                example: very nice
 *    responses:
 *      200:
 *        description: 성공여부와 메시지 업데이트된 유저의 온도를 전달한다.
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
 *                  example: 유저 평가 성공
 *                temperature:
 *                  type: number
 *                  example: 5.6
 *      401:
 *        description: 잘못된 토큰을 전달했을때
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UnvalidToken'
 *      419:
 *        description: 토큰이 만료된 경우
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ExpiredToken'
 *      500:
 *        description: 서버 에러
 */
// 유저 평가하는 기능
router.post('/rating/:reviewed_user_id', isLoggedIn, async (req, res, next) => {
  try {
    const reviewedUserIndex = req.params.reviewed_user_id    // 평가받는 유저의 인덱스, 즉 user-info페이지의 유저 인덱스
  
    const reviewerUserIndex = req.user.user_index   // 평가하는 유저의 인덱스, 즉 실제 사용하고 있는 유저의 인덱스
    const { score, comment } = req.body

    // User_review테이블에 데이터 추가하고 User 테이블에 평가받은 유저의 temperature 수정하기
    await User_review.create({
      reviewed_index: reviewedUserIndex,
      reviewer_index: reviewerUserIndex,
      score,
      comment
    })
  
    // 평가된 유저의 평가 개수와 점수를 이용해 temperature 업데이트
    const findAndCount = await User_review.findAndCountAll({
      where: {
        reviewed_index: reviewedUserIndex
      },
      attributes: ['score']
    })

    // temperature 업데이트 부분
    let totalScore = 0;
    findAndCount.rows.forEach(el => {totalScore += el.score})
    const newTemperature = (totalScore/findAndCount.count).toFixed(1)
    console.log('temperature: ', newTemperature)

    await User.update({
      temperature: newTemperature
    }, {
      where: {
        index: reviewedUserIndex
      }
    })

    // 최종 response로 success: true, message: 성공, temperature: newTemperature 전달
    const response = { success: true, message: '유저 평가 성공', temperature: newTemperature}
    res.json(response)

  } catch (err) {
    console.error(err)
    next(err)
  }
})


/**
 * @swagger
 * /user-info/comments/{reviewed_user_id}:
 *  get:
 *    summary: 유저의 상세정보 페이지 요청
 *    tags:
 *      - USER-INFO
 *    parameters:
 *      - name: reviewed_user_id
 *        in: path
 *        required: true
 *        description: 평가받는 유저의 인덱스를 준다.
 *        schema:
 *          type: integer
 *    responses:
 *      200:
 *        description: 해당하는 유저에 대한 평가 목록이 있는 객체들의 배열로 나타난다.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                index:
 *                  type: integer
 *                  example: 1
 *                reviewer_index:
 *                  type: integer
 *                  example: 4
 *                score:
 *                  type: integer
 *                  example: 6
 *                comment:
 *                  type: string
 *                  example: good reviewer
 *                User:
 *                  type: object
 *                  example: {name: 평가한 유저의 닉네임}
 *      300:
 *        description: 상세 정보에 해당하는 유저에 대한 코멘트가 없는경우
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
 *                  example: 유저에 해당하는 코멘트가 없습니다.
 *      401:
 *        description: 잘못된 토큰을 전달했을때
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UnvalidToken'
 *      419:
 *        description: 토큰이 만료된 경우
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ExpiredToken'
 *      500:
 *        description: 서버 에러    
 */
// 유저 리뷰의 인덱스, 리뷰한 유저의 인덱스, 리뷰한 유저의 닉네임, 리뷰 점수 및 코멘트를 전달한다.
// 해당 유저의 평가목록을 불러오는 api
router.get('/comments/:reviewed_user_id', isLoggedIn, async (req, res, next) => {
  try {
    const reviewedUserIndex = req.params.reviewed_user_id   // 평가 받은 유저의 인덱스
    // 평가 받은 유저에 해당하는 코멘트들을 가져온다.
    const scoreAndComments = await User_review.findAll({
      where: {
        reviewed_index: reviewedUserIndex
      },
      attributes: ['index', 'reviewer_index', 'score', 'comment'],
      include: {
        model: User,
        attributes: ['name'],
      }
    })
    
    if (scoreAndComments.length === 0) return res.status(300).json({success: false, message: '유저에 해당하는 코멘트가 없습니다.'})
  
    res.json(scoreAndComments)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

module.exports = router