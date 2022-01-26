const express = require('express')
const morgan = require('morgan')
require('dotenv').config()
const swaggerUi = require('swagger-ui-express')
const swaggerJsdoc = require('swagger-jsdoc')
const passport = require('passport')
const cookieParser = require('cookie-parser')
const { sequelize } = require('./models/index')
const loginRouter = require('./routes/login_pages')
const passportConfig = require('./passport/strategies')


const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "RemoN 프로젝트 api 명세서",
      description: "프로젝트 진행에 필요한 api에 대한 명세서",
    },
    servers: [{ url: "http://localhost:5000" }],
    version: "1.0.0",
  },
  apis: ["./routes/*.js", "app.js"],
};
const openapiSpecification = swaggerJsdoc(options);


app = express();
app.set("port", process.env.PORT || 5000);
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("데이터베이스 연결 성공");
  })
  .catch((err) => {
    console.error(err);
  });


// 필요한 세팅
app.use(morgan("dev"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpecification));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(passport.initialize())

// router 연결
app.use('/user', loginRouter)


// 스웨거 영역을 tag로 구분
/**
 * @swagger
 * tags:
 *  - name: USER
 *    description: 유저의 로그인, 회원가입, 로그아웃과 관련된 api
 *  - name: MAIN
 *    description: 메인 페이지, 영화 상세 페이지, 영화 검색 페이지와 관련된 api
 *  - name: Service
 *    description: 보고싶어요, 영화의 별점 및 코멘트 기능에 관한 api
 *  - name: USER-INFO
 *    description: 유저 상세 페이지
 */


// 404에러처리 미들웨어
app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

// 에러처리 미들웨어
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json(err.stack);
});

// 서버 띄우기
app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중");
});
