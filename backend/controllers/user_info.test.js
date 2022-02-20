const { showUserInfoPage, ratingUser, showUserComment, modifyUserComment, deleteUserComment } = require('./user_info')
jest.mock('../routes/middleware')
const { updateTemperature } = require('../routes/middleware')
jest.mock('../models/index')
const { User, Movie, Movie_review, Want_watch, User_review } = require('../models/index')
import 'regenerator-runtime'



describe('showUserInfoPage', () => {
  const req = {
    params: {
      user_id: 3
    }
  }
  const next = jest.fn()
  const res = {
    status: jest.fn(() => res),
    json: jest.fn()
  }


  test('유저 상세 페이지에서 유저 정보 가져오기', async () => {
    Want_watch.findAll.mockResolvedValue([{
      movie_index: '1',
      Movie: {
        title: '테스트 제목',
        poster_url: '테스트 포스터'
      }
    }])

    Movie_review.findAll.mockResolvedValue([{
      movie_index: '1',
      Movie: {
        title: '테스트 제목',
        poster_url: '테스트 포스터',
      },
      score: '50',
      comment: '테스트 코멘트'
    }])

    User.findOne.mockResolvedValue({temperature: 14})
    const response = {
      temperature: 14,
      want_watch_movies: [ { movie_index: '1', title: '테스트 제목', poster_url: '테스트 포스터'}],
      comment_movies: [{
        movie_index: '1',
        title: '테스트 제목',
        poster_url: '테스트 포스터',
        score: '50',
        comment: '테스트 코멘트'
      }]
    }

    await showUserInfoPage(req, res, next)
    expect(res.json).toBeCalledWith(response)
  })

  test('없는 유저의 인덱스를 받는 경우', async () => {
    const error = new Error()
    error.name = 'TypeError'
    Want_watch.findAll.mockRejectedValue(error)

    await showUserInfoPage(req, res, next)
    expect(res.json).toBeCalledWith({success: false, message: '없는 유저의 인덱스 입니다.'})
  })

  test('서버 내부 에러', async () => {
    const error = '테스트용 에러'
    Want_watch.findAll.mockRejectedValue(error)

    await showUserInfoPage(req, res, next)
    expect(next).toBeCalledTimes(1)
  })
})

describe('ratingUser', () => {
  const req = {
    params: {
      reviewed_user_id: 1
    },
    user: {
      user_index: 1
    },
    body: {
      score: 80,
      comment: '테스트용 코멘트'
    }
  }
  const res = {
    status: jest.fn(() => res),
    json: jest.fn()
  }
  const next = jest.fn()

  test('유저 평가 코멘트 작성 성공', async () => {
    const mockfn = User_review.create.mockResolvedValue({
      reviewed_index: 2,
      reviewer_index: 1,
      score: req.body.score,
      comment: req.body.comment
    })

    const newComment = await mockfn()

    updateTemperature.mockResolvedValue(60)
    const newTemperature = await updateTemperature()
    const response = {
      success: true,
      message: '유저 평가 성공',
      temperature: newTemperature,
      new_commnet: newComment
    }

    await ratingUser(req, res, next)
    expect(res.json).toBeCalledWith(response)
  })

  test('서버 내부 에러', async () => {
    const error = '테스트용 에러'
    User_review.create.mockRejectedValue(error)

    await ratingUser(req, res, next)
    expect(next).toBeCalledTimes(1)
  })
})


describe('showUserComment', () => {
  const req = {
    params: {
      reviewed_user_id: 1,
    }
  }
  const res = {
    status: jest.fn(() => res),
    json: jest.fn()
  }
  const next = jest.fn()

  test('유저에 대한 코멘트를 보여준다.', async () => {
    User_review.findAll.mockResolvedValue([{test: '테스트용 데이터'}])
    const scoreAndComments = await User_review.findAll()

    await showUserComment(req, res, next)
    expect(res.json).toBeCalledWith(scoreAndComments)
  })

  test('찾고자 하는 유저에 해당하는 코멘트가 없는 경우', async () => {
    User_review.findAll.mockResolvedValue([])
    const scoreAndComments = await User_review.findAll()

    await showUserComment(req, res, next)
    expect(res.status).toBeCalledWith(300)
    expect(res.json).toBeCalledWith({success: false, message: '유저에 해당하는 코멘트가 없습니다.'})
  })

  test('서버 에러가 발생하는 경우', async () => {
    const error = '테스트용 에러'
    User_review.findAll.mockRejectedValue(error)

    await showUserComment(req, res, next)
    expect(next).toBeCalledWith(error)
  })
})


describe('modifyUserComment', () => {
  const req = {
    params: {
      user_review_index: 1,
      reviewed_index: 1
    },
    body: {
      score: 8,
      comment: 'test comment'
    },
    user: { user_index: 2 }
  }
  const res = {
    status: jest.fn(() => res),
    json: jest.fn()
  }
  const next = jest.fn()

  test('성공적으로 평가를 수정한 경우', async () => {
    User_review.update.mockResolvedValue(true)
    updateTemperature.mockResolvedValue(60)
    User_review.findOne.mockResolvedValue(true)

    const newComment = await User_review.findOne()
    await modifyUserComment(req, res, next)
    expect(res.json).toBeCalledWith({success: true, message: '평가 수정 완료', temperature: 60, new_comment: newComment})
  })

  test('평가 수정의 변화가 없는 경우', async () => {
    User_review.update.mockResolvedValue([0])

    await modifyUserComment(req, res, next)
    expect(res.status).toBeCalledWith(400)
    expect(res.json).toBeCalledWith({success: false, message: '해당하는 평가혹은 평가에 변화가 없습니다.'})
  })

  test('서버 에러가 발생한 경우', async () => {
    const error = '테스트용 에러'
    User_review.update.mockRejectedValue(error)

    await modifyUserComment(req, res, next)
    expect(next).toBeCalledWith(error)
  })
})


describe('deleteUserComment', () => {
  const req = {
    params: {
      user_review_index: 1,
      reviewed_index: 1
    },
    user: { user_index: 2 }
  }
  const res = {
    status: jest.fn(() => res),
    json: jest.fn()
  }
  const next = jest.fn()

  test('유저 평가를 정상적으로 삭제한 경우', async () => {
    User_review.destroy.mockResolvedValue(true)
    updateTemperature.mockResolvedValue(60)

    await deleteUserComment(req, res, next)
    expect(res.json).toBeCalledWith({success: true, message: '평가 삭제 완료', temperature: 60})
  })

  test('해당하는 평가가 없어서 삭제를 못한 경우', async () => {
    User_review.destroy.mockResolvedValue(0)

    await deleteUserComment(req, res, next)
    expect(res.status).toBeCalledWith(400)
    expect(res.json).toBeCalledWith({success: false, message: '해당하는 평가가 없습니다.'})
  })

  test('서버 에러가 발생한 경우', async () => {
    const error ='테스트용 에러'
    User_review.destroy.mockRejectedValue(error)

    await deleteUserComment(req, res, next)
    expect(next).toBeCalledWith(error)
  })
})