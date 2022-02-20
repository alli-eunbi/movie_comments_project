const { User } = require('../models/index')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const jwt = require('jsonwebtoken')

// 회원가입
exports.register = async (req, res, next) => {
  try {
    const { img, id, name, password1, confirmpassword } = req.body;
    // 유저 테이블 내부에 id가 중복인지 확인
    const user = await User.findOne({
      where: {
        id: id,
      },
    });

    // 중복된 아이디라면 400에러를 보낸다.
    if (user) {
      const response = {
        success: false,
        message: "이미 존재하는 아이디입니다.",
      };
      return res.status(400).json(response);
    }

    // 존재하지 않는 아이디라면 해쉬로 만들어서 저장 후 확인메시지를 보낸다.
    const hash = await bcrypt.hash(password1, 12);
    await User.create({
      id,
      name,
      password: hash,
      profile_image: img,
    });
    const response = { success: true, message: "회원가입 성공" };
    return res.json(response);
  } catch (err) {
    console.error(err);
    next(err);
  }
}

// 로컬 로그인
exports.loginLocal = async (req, res, next) => {
  passport.authenticate("login", { session: false }, (err, user, info) => {
    // 서버에러가 발생하는 경우
    if (err) {
      return next(err);
    }
    // 회원가입한 유저가 아닌 경우
    if (!user) {
      if (info.message === "no user") {
        return res
          .status(400)
          .json({ success: false, message: "가입되지 않은 회원입니다." });
      } else {
        return res
          .status(401)
          .json({ success: false, message: "비밀번호가 일치하지 않습니다." });
      }
    }

    // 로그인이 확인되었다면 생성한 토큰을 전달한다.
    // user.index, user.id 정보를 토큰에 넣어서 전달한다.
    const token = jwt.sign(
      {
        user_index: user.index,
        user_id: user.id,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("accessToken", token, {
      expires: new Date(Date.now() + 24 * 3600000), // 1일 뒤에 사라짐
      httpOnly: true,
    });

    return res.json({ success: true, message: "로그인 완료" });
  })(req, res, next);
}

// 카카오 로그인
exports.kakaoCallback = async (req, res, next) => {
  passport.authenticate("kakao", { session: false }, (err, user, info) => {
    // 서버 에러
    if (err) return next(err);

    const userObject = user[0].dataValues;
    // 토큰 발급
    const token = jwt.sign(
      {
        user_index: userObject.index,
        user_id: userObject.id,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("accessToken", token, {
      expires: new Date(Date.now() + 24 * 3600000), // 1일 뒤에 사라짐
      httpOnly: true,
    });

    return res.json({ success: true, message: "로그인 완료" });
  })(req, res, next);
}