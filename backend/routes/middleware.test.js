const { isLoggedIn } = require('./middleware')
jest.mock('jsonwebtoken')
const jwt = require('jsonwebtoken')
import 'babel-polyfill'

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