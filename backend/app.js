const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const { sequelize } = require("./models/index");
const loginRouter = require("./routes/login_pages");
const userInfoRouter = require("./routes/user_info_pages");
const userRankingRouter = require("./routes/user_ranking_pages");
import main from "./api/main";
import search from "./api/search";
import like from "./api/like";
import review from "./api/review";
const passportConfig = require("./passport/strategies");

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
  apis: ["./routes/*.js", "./api/*.js", "app.js"],
};
const openapiSpecification = swaggerJsdoc(options);

const app = express();
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
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(morgan("dev"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpecification));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(passport.initialize());

// router 연결
app.use("/user", loginRouter);
app.use("/", main);
app.use("/", search);
app.use("/", like);
app.use("/", review);
app.use("/user-info", userInfoRouter);
app.use("/user-ranking", userRankingRouter);

// swagger 스키마 설정
/**
 * @swagger
 * components:
 *  schemas:
 *    UnvalidToken:
 *      description: 잘못된 토큰을 전달했을때
 *      properties:
 *        success:
 *          type: boolean
 *          example: false
 *        message:
 *          type: string
 *          example: 유효하지 않은 토큰입니다.
 *    ExpiredToken:
 *      description: 토큰이 만료된 경우
 *      properties:
 *        success:
 *          type: boolean
 *          example: false
 *        message:
 *          type: string
 *          example: 만료된 토큰입니다.
 *    IsNotLoggedIn:
 *      description: 로그인이 된 상태에서 접근하면 에러가 발생하는 경우(예를 들어 로그인)
 *      properties:
 *        success:
 *          type: boolean
 *          example: false
 *        message:
 *          type: string
 *          example: 유효하지 않은 접근입니다.
 */

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
 *  - name: USER-RANKING
 *    description: 유저 랭킹 페이지
 */

// 404에러처리 미들웨어
app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

// 에러처리 미들웨어
app.use((err, req, res, next) => {
  console.log(err.stack)
  res.status(err.status || 500);
  res.json(err.stack);
});

// 서버 띄우기
app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중");
});
