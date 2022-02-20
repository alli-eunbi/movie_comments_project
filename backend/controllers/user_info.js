const { User, Movie, Movie_review, Want_watch, User_review } = require('../models/index')
const { updateTemperature } = require('../routes/middleware')


// 유저 인포페이지 접속과 관련된 컨트롤러
exports.showUserInfoPage = async (req, res, next) => {
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
}

// 유저 평가 컨트롤러
exports.ratingUser = async (req, res, next) => {
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
}

// 유저 평가 목록 불러오기 컨트롤러
exports.showUserComment = async (req, res, next) => {
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
}

// 유저 평가 수정하는 컨트롤러
exports.modifyUserComment = async (req, res, next) => {
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
}

// 유저 평가 삭제하는 컨트롤러
exports.deleteUserComment = async (req, res, next) => {
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
}