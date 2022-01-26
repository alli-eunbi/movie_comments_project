const jwt = require('jsonwebtoken')

// 로그인이 된 상태인지 확인한다.
// 토큰을 통해 로그인된 유저인지 확인한 후 토큰의 상태에 따라 평가한다.
exports.isLoggedIn = (req, res, next) => {
  try {
    console.log(req.headers.authorization)
    const decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET_KEY)
    
    req.user = decoded
    next()
  } catch (err) {
    console.log(err.name)
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({success: false, message: '유효하지 않은 토큰입니다.'})
    } else {
      return res.status(419).json({success: false, message: '토큰이 만료되었습니다.'})
    }
  }
}

