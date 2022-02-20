const {showUsersRanking} = require('./user_ranking')
jest.mock('../models/index')
const {User} = require('../models/index')
import 'regenerator-runtime'

describe('showUsersRanking', () => {
  const res = {
    status: jest.fn(() => res),
    json: jest.fn()
  }
  const next = jest.fn()

  test('로그인한 상태에서 유저 랭킹 목록을 보여주는 경우', async () => {
    const req = {
      user: {
        user_index: 1
      }
    }

    User.findAll.mockResolvedValue([{index: 1, name: '테스트1'}, {index: 1, name: '테스트1'}, {index: 1, name: '테스트1'}, {index: 1, name: '테스트1'}])

    const userTemperatureList = await User.findAll()
    const userReviewNumList = await User.findAll()

    const myTemperatureRank = 1
    const myReviewNumRank = 1

    const response = {
      success: true,
      message: '랭킹 정보 전달 성공',
      temperature_rank: userTemperatureList.slice(0, 3),
      user_temperature_rank: myTemperatureRank,
      reviewNum_rank: userReviewNumList.slice(0, 3),
      user_review_rank: myReviewNumRank
    }

    await showUsersRanking(req, res, next)
    expect(res.json).toBeCalledWith(response)
  })

  test('로그인하지 않은 상태에서 유저 랭킹 목록을 보여주는 경우', async () => {
    const req = {}

    User.findAll.mockResolvedValue([{index: 1, name: '테스트1'}, {index: 1, name: '테스트1'}, {index: 1, name: '테스트1'}, {index: 1, name: '테스트1'}])

    const userTemperatureList = await User.findAll()
    const userReviewNumList = await User.findAll()

    let myTemperatureRank, myReviewNumRank

    const response = {
      success: true,
      message: '랭킹 정보 전달 성공',
      temperature_rank: userTemperatureList.slice(0, 3),
      user_temperature_rank: myTemperatureRank,
      reviewNum_rank: userReviewNumList.slice(0, 3),
      user_review_rank: myReviewNumRank
    }

    await showUsersRanking(req, res, next)
    expect(res.json).toBeCalledWith(response)
  })

  test('서버 내부 에러', async () => {
    const req = {}
    const error = '서버 내부 에러'
    User.findAll.mockRejectedValue(error)

    await showUsersRanking(req, res, next)
    expect(next).toBeCalledWith(error)
  })
})