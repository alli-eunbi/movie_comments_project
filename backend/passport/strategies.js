
const passport = require("passport");
const LocalStrategy = require("passport-local");
const KakaoStrategy = require("passport-kakao").Strategy;
const { User } = require("../models/index");
const bcrypt = require("bcryptjs");



// 로그인 전략
const strategy_login = new LocalStrategy(
  {
    usernameField: "id",
    passwordField: "password",
  },
  async (id, password, cb) => {
    try {
      const exUser = await User.findOne({ where: { id } });

      // exUser가 없다면 없는 회원이다.
      if (!exUser) return cb(null, false, { message: "no user" });
      // exUser가 있는경우
      else {
        // 비밀번호가 틀린경우
        const result = await bcrypt.compare(password, exUser.password);
        if (!result) return cb(null, false, { message: "no password" });

        // 유저 확인이 완료된 경우
        return cb(null, exUser);
      }
    } catch (error) {
      console.error(error);
      return cb(error);
    }
  }
);

passport.use("login", strategy_login);

// 카카오 로그인 전략
const CALLBACK_URL = "http://localhost:5000/user/callback/kakao";

const strategy_kakao = new KakaoStrategy(
  {
    clientID: process.env.KAKAO_API_KEY,
    callbackURL: CALLBACK_URL,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // id가 있는지 확인해보고 있으면 해당 모델을 반환하고 없으면 저장 후 반환한다.
      // 이때 user의 형태는 배열의 형태이고 0번 인덱스에는 모델의 정보가 있고
      // 1번 인덱스에는 새로 만들었으면 true, 기존에 있던 유저면 false를 나타낸다.
      const user = await User.findOrCreate({
        where: {
          id: profile.id,
        },
        defaults: {
          name: profile.displayName,
          password: "kakao-login",
          social: profile.provider,
        },
      });

      done(null, user);
    } catch (err) {
      console.error(err);
      done(err);
    }
  }
);

passport.use(strategy_kakao);

module.exports = { passport };
