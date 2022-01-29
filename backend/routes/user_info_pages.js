const express = require('express')
const {isLoggedIn, isNotLoggedIn, updateTemperature} = require('./middleware')
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
 *    summary: 유저에 대한 평가를 진행하는 api
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
 *        description: 성공여부와 메시지 업데이트된 유저의 온도와 평가 내용을 전달한다.
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
 *                new_comment:
 *                  type: object
 *                  example: {index: 6, reviewed_index: 4, reviewer_index: 2, score: 4, comment: 평가 내용}
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
    const newComment = await User_review.create({
      reviewed_index: reviewedUserIndex,
      reviewer_index: reviewerUserIndex,
      score,
      comment
    })
  
    // 평가된 유저의 평가 개수와 점수를 이용해 temperature 업데이트
    const newTemperature = await updateTemperature(reviewedUserIndex)

    // 최종 response로 success: true, message: 성공, temperature: newTemperature 전달
    const response = { success: true, message: '유저 평가 성공', temperature: newTemperature, new_commnet: newComment}
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
 *    summary: 해당 유저에 달린 평가들 목록을 가져오는 api
 *    tags:
 *      - USER-INFO
 *    parameters:
 *      - name: reviewed_user_id
 *        in: path
 *        required: true
 *        description: 평가받은 유저의 인덱스를 준다.
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


/**
 * @swagger
 * /user-info/rating/{reviewed_index}/{user_review_index}:
 *  put:
 *    summary: 작성된 유저에 대한 평가를 수정하고 수정 내용을 전달해주는 api
 *    tags:
 *      - USER-INFO
 *    parameters:
 *      - name: reviewed_index
 *        in: path
 *        required: true
 *        description: 평가 받은 유저의 유저 인덱스
 *        schema:
 *          type: integer
 *      - name: user_review_index
 *        in: path
 *        required: true
 *        description: 수정하고자 하는 평가의 테이블 인덱스를 전달한다.
 *        schema:
 *          type: integer
 *    requestBody:
 *      description: 평가한 점수와 코멘트, 평가된 유저의 인덱스를 전달한다.
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
 *        description: 해당하는 유저에 대한 평가 목록이 있는 객체들의 배열로 나타난다.
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
 *                  example: 평가 수정 완료
 *                temperature:
 *                  type: number
 *                  example: 새로 업데이트된 유저의 온도
 *                new_comment:
 *                  type: object
 *                  example: {index: 유저평가 테이블 인덱스, reviewed_index: 평가된 유저의 인덱스, reviewer_index: 평가한 유저의 인덱스, score: 점수, comment: 평가내용}
 *      400:
 *        description: 전달받은 커멘트가 없어서 삭제를 못한 경우
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
 *                  example: 해당하는 평가혹은 평가에 변화가 없습니다.
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
// 유저 평가를 수정하는 api
// 프론트 서버로부터 score, comment, reviewed_index(상세페이지에 해당하는 유저의 인덱스)를 받는다.
router.put('/rating/:reviewed_index/:user_review_index', isLoggedIn, async (req, res, next) => {
  try {
    // User_review 테이블의 인덱스 번호를 가져온다.
    const UserReviewTableIndex = req.params.user_review_index
    const reviewed_index = req.params.reviewed_index
    // body에서 수정할 score와 comment, reviewed_index를 받는다.
    const { score, comment } = req.body
    const reviewer_index = req.user.user_index

    // 머저 전달받은 정보로 테이블을 update시켜준다.
    const result = await User_review.update({
      score: score,
      comment: comment
    }, {
      where: {
        index: UserReviewTableIndex,
        reviewed_index,
        reviewer_index
      }
    })

    // update한 부분이 없는 경우
    if (result[0] === 0) return res.status(400).json({success: false, message: '해당하는 평가혹은 평가에 변화가 없습니다.'})

    // update시킨 점수를 바탕으로 User테이블의 temperature를 수정해준다.
    const newTemperature = await updateTemperature(reviewed_index)

    // update한 내용을 전달한다.
    const newComment = await User_review.findOne({
      where: {
        index: UserReviewTableIndex
      }
    })

    res.json({success: true, message: '평가 수정 완료', temperature: newTemperature, new_comment: newComment})

  } catch (err) {
    console.error(err)
    next(err)
  }
})


/**
 * @swagger
 * /user-info/rating/{reviewed_index}/{user_review_index}:
 *  delete:
 *    summary: 작성된 유저에 대한 평가를 삭제하는 api
 *    tags:
 *      - USER-INFO
 *    parameters:
 *      - name: reviewed_index
 *        in: path
 *        required: true
 *        description: 평가 받은 유저의 유저 인덱스
 *        schema:
 *          type: integer
 *      - name: user_review_index
 *        in: path
 *        required: true
 *        description: 삭제하고자 하는 평가의 테이블 인덱스를 전달한다.
 *        schema:
 *          type: integer
 *    responses:
 *      200:
 *        description: 성공 여부와 메시지, 새로 업데이트된 유저의 온도를 보내준다.
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
 *                  example: 평가 삭제 완료
 *                temperature:
 *                  type: number
 *                  example: 새로 업데이트된 유저의 온도
 *      400:
 *        description: 전달받은 커멘트가 없어서 삭제를 못한 경우
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
 *                  example: 해당하는 평가가 없습니다.
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
// 유저 평가 삭제하는 기능 관련 api
router.delete('/rating/:reviewed_index/:user_review_index', isLoggedIn, async (req, res, next) => {
  try {
    const UserReviewTableIndex = req.params.user_review_index   // 삭제하고 싶은 코멘트의 index
    const reviewed_index = req.params.reviewed_index   // 평가 받은 유저의 아이디
  
    const reviewer_index = req.user.user_index  // 평가한 유저의 아이디, 즉 로그인 한 유저가 자신이 평가한 글만 삭제할 수 있다.
  
    const result = await User_review.destroy({
      where: {
        index: UserReviewTableIndex,
        reviewed_index,
        reviewer_index
      }
    })

    // 전달받은 커멘트가 없는경우
    if (result === 0) return res.status(400).json({success: false, message: '해당하는 평가가 없습니다.'})

    // 삭제시킨 코멘트와 점수를 바탕으로 User테이블의 temperature를 수정해준다.
    const newTemperature = await updateTemperature(reviewed_index)

    res.json({success: true, message: '평가 삭제 완료', temperature: newTemperature})

  } catch (err) {
    console.error(err)
    next(err)
  }
})


module.exports = router