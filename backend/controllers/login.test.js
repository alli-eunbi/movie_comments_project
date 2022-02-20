const { register, loginLocal, kakaoCallback, } = require('./login')
jest.mock('passport')
jest.mock('bcryptjs')
jest.mock('jsonwebtoken')
jest.mock('../models/index')
const { User } = require('../models/index')
const passport = require('passport')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
import 'regenerator-runtime'

// 회원가입 컨트롤러 테스트
describe('register', () => {
  const next =jest.fn()
  const res = {
    status: jest.fn(() => res),
    json: jest.fn()
  }

  const req = {
    body: {
      img: 'img',
      id: 'id',
      name: 'name',
      password1: 'password',
      confirmpassword: 'password'
    }
  }

  test('회원가입에 성공한 경우', async () => {

    User.findOne.mockResolvedValue(false)

    const mock = bcrypt.hash.mockResolvedValue(true)
    const hash = await mock()

    User.create.mockResolvedValue(true)
    await register(req, res, next)
    expect(res.json).toBeCalledWith({success: true, message: "회원가입 성공"})
  })


  test('중복된 아이디가 있어서 회원가입에 실패한 경우', async () => {
    User.findOne.mockResolvedValue(true)
    await register(req, res, next)
    expect(res.status).toBeCalledWith(400)
    expect(res.json).toBeCalledWith({success: false, message: "이미 존재하는 아이디입니다."})
  })


  test('이미 가입한 아이디인지 찾는 쿼리에서 에러가 발생하는 경우', async () => {
    const error = '테스트용 에러'
    User.findOne.mockImplementation(() => Promise.reject(error))
    await register(req, res, next)
    expect(next).toBeCalledWith(error)
  })


  test('아이디 생성하는 쿼리에서 에러가 발생하는 경우', async () => {
    const error = '테스트용 에러'

    User.findOne.mockResolvedValue(false)

    const mock = bcrypt.hash.mockResolvedValue(true)
    const hash = await mock()
    User.create.mockRejectedValue(error)
    await register(req, res, next)
    expect(next).toBeCalledWith(error)
  })
})


// 로컬 로그인 테스트
describe('loginlocal', () => {
  const next = jest.fn()
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
    cookie: jest.fn(() => true)
  }
  const req = {}

  test('로그인이 정상적으로 작동한 경우', () => {
    passport.authenticate.mockImplementation((strategy, option, callback) => () => {
      callback(null, true)
    })

    jwt.sign.mockImplementation(() => {return true})

    loginLocal(req, res, next)
    expect(res.json).toBeCalledWith({success: true, message: "로그인 완료"})
  })

  test('회원가입한 유저가 아닌 경우', () => {
    const info = {
      message: "no user"
    }

    passport.authenticate.mockImplementation((strategy, option, callback) => () => {
      callback(null, false, info)
    })

    loginLocal(req, res, next)
    expect(res.status).toBeCalledWith(400)
    expect(res.json).toBeCalledWith({success: false, message: "가입되지 않은 회원입니다."})
  })

  test('비밀번호가 일치하지 않는경우', () => {
    const info = {
      message: "테스트"
    }

    passport.authenticate.mockImplementation((strategy, option, callback) => () => {
      callback(null, false, info)
    })

    loginLocal(req, res, next)
    expect(res.status).toBeCalledWith(401)
    expect(res.json).toBeCalledWith({success: false, message: "비밀번호가 일치하지 않습니다."})
  })

  test('서버에서 에러가 난 경우', () => {
    const error = new Error('테스트용 에러')
    passport.authenticate.mockImplementation((strategy, option, callback) => () => {
      callback(error)
    })

    loginLocal(req, res, next)
    expect(next).toBeCalledWith(error)
  })
})


// 카카오 로그인 테스트
describe('kakaoCallback', () => {
  const next = jest.fn()
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
    cookie: jest.fn(() => true)
  }
  const req = {}

  test('로그인이 정상 작동 한 경우', () => {
    const user = [{
      dataValues: {
        index: 1,
        id: 1
      }
    }]

    passport.authenticate.mockImplementation((strategy, option, callback) => () => {
      callback(null, user)
    })

    jwt.sign.mockImplementation(() => {return true})
    kakaoCallback(req, res, next)
    expect(res.json).toBeCalledWith({success: true, message: "로그인 완료"})
  })

  test('서버 에러가 발생한 경우', () => {
    const error = new Error('테스트용 에러')
    passport.authenticate.mockImplementation((strategy, option, callback) => () => {
      callback(error)
    })

    kakaoCallback(req, res, next)
    expect(next).toBeCalledWith(error)
  })
})