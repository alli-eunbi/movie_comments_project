const express = require('express')

const router = express.Router()

// get api 처리
/**
 * @swagger
 * /logout:
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
 router.get('/logout', (req, res, next) => {
  const result = {
    name: 'jinmook',
    message: 'fucking swagger'
  }
  res.json(result)
})

module.exports = router