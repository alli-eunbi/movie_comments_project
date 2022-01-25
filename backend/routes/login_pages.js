const express = require('express')
const {User} = require('../models/index')
const bcrypt = require('bcrypt')


const router = express.Router()

// 회원가입 api 처리
/**
 * @swagger
 * /user/register:
 *  post:
 *    summary: 프로필 이미지, 아이디, 닉네임, 비밀번호1,2 를 body로 부터 받는다.
 *    tags:
 *      - USER
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              profile_img:
 *                type: string
 *                description: 유저 프로필 이미지 파일
 *              id:
 *                tpye: string
 *                description: 유저 아이디
 *              name:
 *                type: string
 *                description: 유저의 닉네임
 *              password1:
 *                type: string
 *                description: 유저의 비밀번호1
 *              password2:
 *                type: string
 *                description: 유저의 비밀번호2
 *    responses:
 *      200:
 *        description: 회원가입 성공 후 로그인 페이지로 이동합니다.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  description: 회원가입 성공시 true
 *                message:
 *                  type: string
 *                  description: 성공한 경우 '회원가입 성공'
 *                  example: 회원가입 성공
 *      400:
 *        description: 아이디가 이미 존재하는 경우
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  description: 회원가입 실패시 false
 *                  example: false
 *                message:
 *                  type: string
 *                  description: 실패한 이유가 나옴
 *                  example: 이미 존재하는 아이디입니다.
 *      500:
 *        description: 서버 내부 에러
 */
router.post('/register', async (req, res, next) => {
  try {
    const {img, id, name, password1, password2} = req.body
    // 유저 테이블 내부에 id가 중복인지 확인
    const user = await User.findOne({
      where: {
        id: id
      }
    })
    // 중복된 아이디라면 400에러를 보낸다.
    if (user) {
      const response = {success: false, message: '이미 존재하는 아이디입니다.'}
      return res.status(400).json(response)
    }

    // 존재하지 않는 아이디라면 해쉬로 만들어서 저장 후 확인메시지를 보낸다.
    const hash = await bcrypt.hash(password1, 12)
    await User.create({
      id,
      name,
      password: hash,
      profile_image: img,
    })
    const response = {success: true, message: '회원가입 성공'}
    return res.json(response)
  } catch (err) {
    console.error(err)
    next(err)
  }
  
})





// 로그아웃 api 처리
/**
 * @swagger
 * /user/logout:
 *  get:
 *    summary: 로그아웃과 관련된 api
 *    tags:
 *    - USER
 *    responses:
 *      200:
 *        description: 로그아웃 성공
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: string
 *                  example: 성공           
 */
 router.get('/logout', (req, res, next) => {
  const result = {
    success: '성공'
  }
  res.json(result)
})

module.exports = router