const passport = require('passport')
const LocalStrategy = require('passport-local')
const { User } = require('../models/index')
const bcrypt = require('bcrypt')

// 로그인 전략
const strategy_login = new LocalStrategy({
  usernameField: 'id',
  passwordField: 'password'
}, async (id, password, cb) => {
  try{
    const exUser = await User.findOne({where: {id}})

    // exUser가 없다면 없는 회원이다.
    if (!exUser) return cb(null, false, {message: 'no user'})
    // exUser가 있는경우
    else {
      // 비밀번호가 틀린경우
      const result = await bcrypt.compare(password, exUser.password)
      if(!result) return cb(null, false, {message: 'no password'})

      // 유저 확인이 완료된 경우
      return cb(null, exUser)
    }
  } catch (error) {
    console.error(error)
    return cb(error)
  }
})

passport.use('login', strategy_login)


module.exports = { passport }
