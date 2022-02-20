const { User } = require('../models/index')

exports.showUsersRanking = async (req, res, next) => {
  try {
    // 온도가 높은 인원 3명을 먼저 가져와보자
    const userTemperatureList = await User.findAll({
      attributes: ['index', 'name', 'profile_image', 'temperature'],
      order: [['temperature', 'DESC']]
    })

    // 리뷰 개수가 높은 인원 3명 가져오기
    const userReviewNumList = await User.findAll({
      attributes: ['index', 'name', 'profile_image', 'review_num'],
      order: [['review_num', 'DESC']]
    })

    // 로그인 한 유저의 순위를 담을 변수
    let myTemperatureRank, myReviewNumRank;

    // 로그인 한 유저의 순위를 담기 위한 for 문
    const user_index = req.user ? req.user.user_index : undefined
    if (user_index) {
      for (let i = 0; i < userTemperatureList.length; i++) {
        if (userTemperatureList[i].index === user_index) {
          myTemperatureRank = i + 1
          break
        }
      }
    }

    if (user_index) {
      for (let i = 0; i < userReviewNumList.length; i++) {
        if (userReviewNumList[i].index === user_index) {
          myReviewNumRank = i + 1
          break
        }
      }
    }

    const response = {
      success: true,
      message: '랭킹 정보 전달 성공',
      temperature_rank: userTemperatureList.slice(0, 3),
      user_temperature_rank: myTemperatureRank,
      reviewNum_rank: userReviewNumList.slice(0, 3),
      user_review_rank: myReviewNumRank
    }

    res.json(response)

  } catch (err) {
    console.error(err)
    next(err)
  }
}