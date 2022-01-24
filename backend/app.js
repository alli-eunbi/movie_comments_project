const express = require('express')
const morgan = require('morgan')
const dotenv = require('dotenv')

dotenv.config()

app = express()
app.set('port', process.env.PORT || 5000);

// 필요한 세팅
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))







// 404에러처리 미들웨어
app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`)
  error.status = 404
  next(error)
})

// 에러처리 미들웨어
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.send(err.message)
})

// 서버 띄우기
app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중')
})
