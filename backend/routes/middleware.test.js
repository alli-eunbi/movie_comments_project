const { isLoggedIn, isNotLoggedIn, logInChecker, updateTemperature } = require('./middleware')
jest.mock('jsonwebtoken')
const jwt = require('jsonwebtoken')
jest.mock('../models/index')
const { User, User_review } = require('../models/index')
import 'babel-polyfill'

// isLoggedIn 미들웨어 테스트
describe('isLoggedIn', () => {
  // mock functions를 만들어야한다.
  const res = {
    status: jest.fn(() => res),
    json: jest.fn()
  }
  const next = jest.fn()


  test('로그인이 되어 있으면 isLoggedIn이 req.user에 유저 정보를 넣고 next를 호출해야 한다.', () => {
    // const token = jwt.sign({index: 1, id: 'test1'}, process.env.JWT_SECRET_KEY, {expiresIn: '1m'})
    
    const req = {
      cookies: {
        accessToken: 'token'
      }
    }
    isLoggedIn(req, res, next)
    expect(next).toBeCalledTimes(1)
  })

  test('토큰이 유효하지 않다면 401에러와 메세지를 전달한다.', () => {
    const req = {
      cookies: {
        accessToken: 'token'
      }
    }

    jwt.verify.mockImplementation(() => {
      throw error;
    })

    const error = {
      name: 'JsonWebTokenError'
    }

    isLoggedIn(req, res, next)
    expect(res.status).toBeCalledWith(401)
    expect(res.json).toBeCalledWith({success: false, message: "유효하지 않은 토큰입니다."})
  })

  test('만료된 토큰이라면 419에러와 메세지를 전달한다.', () => {
    const req = {
      cookies: {
        accessToken: 'token'
      }
    }

    jwt.verify.mockImplementation(() => {throw error})
    const error = {
      name: 'TokenExpiredError'
    }

    isLoggedIn(req, res, next)
    expect(res.status).toBeCalledWith(419)
    expect(next).toBeCalledTimes(1)
  })
})

// isNotLoggedIn 테스트
describe('isNotLoggedIn', () => {
  const res = {
    status: jest.fn(() => res),
    json: jest.fn()
  }
  const next = jest.fn()

  test('로그인이 된 상태라면 유효하지 않은 접근 에러를 응답한다.', () => {
    const req = {
      cookies: {
        accessToken: 'accessToken'
      }
    }

    jwt.verify.mockImplementation(() => true)

    isNotLoggedIn(req, res, next)
    expect(res.status).toBeCalledWith(400)
    expect(res.json).toBeCalledWith({success: false, message: "유효하지 않은 접근입니다."})
  })

  test('로그인한 기록이 없어서 토큰이 없는 경우', () => {
    const req = {
      cookies: {
        accessToken: null
      }
    }

    jwt.verify.mockImplementation((token, secret_key) => {
      throw error
    })

    isNotLoggedIn(req, res, next)
    expect(next).toBeCalledTimes(1)
  })

  test('유효하지 않은 토큰인 경우', () => {
    const req = {
      cookies: {
        accessToken: 'token'
      }
    }

    jwt.verify.mockImplementation((token, scret_key) => {
      throw error
    })

    isNotLoggedIn(req, res, next)
    expect(res.status).toBeCalledWith(400)
    expect(res.json).toBeCalledWith({success: false, message: "유효하지 않은 접근입니다."})
  })
})

// logInChecker 미들웨어 테스트
describe('logInChecker', () => {
  const res = {}
  
  test('로그인이 된 상태라면 req.user에 로그인 정보를 넣고 next호출', () => {
    const next = jest.fn()
    const req = {
      cookies: {
        accessToken: 'token'
      },
    }

    const mockFn = jwt.verify.mockImplementation(() => {
      return {user_index: '1', user_id: 'test1'}
    })
    
    const decoded = mockFn()

    logInChecker(req, res, next)
    expect(req.user).toStrictEqual(decoded)
    expect(next).toBeCalledTimes(1)
  })

  test('로그인 되지 않았다면 next를 호출', () => {
    const req = {}
    const next = jest.fn()
    jwt.verify.mockImplementation(() => {throw error})

    logInChecker(req, res, next)
    expect(req.user).toBeUndefined()
    expect(next).toBeCalledTimes(1)
  })
})

// 온도를 업데이트하는 updateTemperature 함수 테스트
describe('updateTemperature', () => {
  
  test('User테이블의 temperature속성을 업데이트 해준다.', async () => {
    const reviewed_index = 3
    const mockFn = User_review.findAndCountAll.mockReturnValue(Promise.resolve({
      rows: [{score: 2}, {score: 4}],
      count: 2
    }))

    const findAndCount = await mockFn()

    let totalScore = 0;
    findAndCount.rows.forEach(el => {totalScore += el.score})
    const newTemperature = parseFloat(10 * totalScore/findAndCount.count).toFixed(1)

    User.update.mockImplementation(() => true)
    updateTemperature(reviewed_index)
    expect(newTemperature).toBe("30.0")
  })

  test('서버 내부에 에러가 발생하는 경우', async () => {
    const reviewed_index = 1
    const error = '테스트용 에러'
    User_review.findAndCountAll.mockRejectedValue(error)

    const newTemp = await updateTemperature(reviewed_index)
    expect(newTemp).toBe(0)
  })
})