const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const { sequelize } = require("./models/index");
import main from "./api/main";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "team19_data_project",
      description: "api information about team19_data_project",
    },
    servers: [{ url: "http://localhost:5000" }],
    version: "1.0.0",
  },
  apis: ["./routes/*.js", "app.js"],
};
const openapiSpecification = swaggerJsdoc(options);

dotenv.config();
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
app.use(morgan("dev"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpecification));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", main);

// 스웨거 스키마 작성 $ref를 통해 스키마를 가져올 수 있다.
/**
 * @swagger
 * components:
 *   schemas:
 *     GETtest:
 *       properties:
 *         name:
 *           type: string
 *           description: 이름
 *         message:
 *           type: string
 *           description: 테스트 성공 메세지
 *     GETtest2:
 *       properties:
 *         name:
 *           type: string
 *           description: 이름
 *         message:
 *           type: string
 *           description: 테스트 성공 메세지
 *         id:
 *           type: integer
 *           description: 아이디 번호
 *     POSTtest3:
 *       properties:
 *         email:
 *           type: string
 *           description: 이메일 주소
 *         password:
 *           type: string
 *           description: 비밀번호
 *         success:
 *           type: string
 *           description: 성공여부
 */

// 스웨거 영역을 tag로 구분
/**
 * @swagger
 * tags:
 *  - name: Test
 *    description: test swagger
 *  - name: Test2
 *    description: post api test
 */

// get api 처리
/**
 * @swagger
 * /main:
 *   get:
 *     summary: returns the result
 *     tags:
 *     - Test
 *     responses:
 *       200:
 *         description: the result
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GETtest'
 */
app.get("/main", (req, res, next) => {
  const result = {
    name: "jinmook",
    message: "fucking swagger",
  };
  res.json(result);
});

// get api에서 파라미터가 있는 경우 처리
/**
 * @swagger
 * /main/{id}:
 *  get:
 *    summary: get the main id
 *    tags:
 *    - Test
 *    parameters:
 *      - in: path
 *        name: id
 *        schemas:
 *          type: string
 *        required: true
 *        description: the main id
 *    responses:
 *      200:
 *        description: result book id
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/GETtest2'
 *      404:
 *        description: no number id
 */
app.get("/main/:id", (req, res, next) => {
  const result = {
    name: "elice",
    message: "elice data_project",
    id: Number(req.params.id),
  };
  res.json(result);
});

// post api 처리
/**
 * @swagger
 * /input:
 *  post:
 *    summary: post email, password data
 *    tags:
 *    - Test2
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                description: input email
 *              password:
 *                type: string
 *    responses:
 *      200:
 *        description: login ok
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#components/schemas/POSTtest3'
 *      500:
 *        description: login fail
 */
app.post("/input", (req, res, next) => {
  const { email, password } = req.body;
  const result = {
    email,
    password,
    success: "ok",
  };
  if (result.password === "error") return res.status(500).json(result);
  res.json(result);
});

// 404에러처리 미들웨어
app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

// 에러처리 미들웨어
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send(err.message);
});

// 서버 띄우기
app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중");
});
