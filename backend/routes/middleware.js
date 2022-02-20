
const jwt = require('jsonwebtoken')
const { User, User_review } = require('../models/index')

// 로그인이 된 상태인지 확인한다.
// 토큰을 통해 로그인된 유저인지 확인한 후 토큰의 상태에 따라 평가한다.
// 유저가 확인되었다면 req.user에 user_index와 user_id로 이루어진 객체를 할당한다.
exports.isLoggedIn = (req, res, next) => {
  try {
    const decoded = jwt.verify(
      req.cookies.accessToken,
      process.env.JWT_SECRET_KEY
    );
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return res
        .status(201)
        .json({ success: false, message: "유효하지 않은 토큰입니다." });
    } else {
      return res
        .status(202)
        .json({ success: false, message: "만료된 토큰입니다." });
    }
  }
};

// 로그인이 안된 상태인지 확인한다.
exports.isNotLoggedIn = (req, res, next) => {
  try {
    const decoded = jwt.verify(
      req.cookies.accessToken,
      process.env.JWT_SECRET_KEY
    );
    // 에러가 발생하지 않는다면 로그인 된 상태이기 때문에 유효하지 않은 접근 에러
    return res
      .status(206).json({ success: false, message: "유효하지 않은 접근입니다." });
  } catch (err) {
    // 토큰이 없는 경우
    if (!req.cookies.accessToken) return next();
    // 유효하지 않은 토큰인 경우
    return res
      .status(206)
      .json({ success: false, message: "유효하지 않은 접근입니다." });
  }
};

// 로그인상태를 체크하는 함수이다. 로그인이 된 상태라면 req.user를 이용할 수 있다.
exports.logInChecker = (req, res, next) => {
  try {
    const decoded = jwt.verify(req.cookies.accessToken, process.env.JWT_SECRET_KEY)
    // 로그인이 된 상태면 req.user에 user_index와 user_id가 있다.

    req.user = decoded
    next()
  } catch (err) {
    // 로그인이 된 상태가 아니라면 req.user에 아무것도 없다.
    next();
  }
}


// User테이블의 temperature를 업데이트 해주는 함수
// 위 3개의 함수는 미들웨어이지만 아래 작성된 함수는 일반 함수이다.
exports.updateTemperature = async (reviewed_index) => {
  try {
    const findAndCount = await User_review.findAndCountAll({
      where: {
        reviewed_index: reviewed_index
      },
      attributes: ['score']
    })
  
    // temperature 업데이트 부분
    let totalScore = 0;
    findAndCount.rows.forEach(el => {totalScore += el.score})
    console.log('temp: ', 10 * totalScore/findAndCount.count)
    const newTemperature = parseFloat(10 * totalScore/findAndCount.count).toFixed(1)
    console.log('temperature: ', newTemperature)
  
    await User.update({
      temperature: newTemperature
    }, {
      where: {
        index: reviewed_index
      }
    })
  
    return newTemperature
  } catch (err) {
    console.error(err)
    return 0
  }
}

