const fs = require("fs");
const mysql = require("mysql");

const { Movie } = require("../models/index.js");

const file1 = fs.readFileSync("./movie-crawler/final.json", {
  encoding: "utf8",
});
const { data: movies } = JSON.parse(file1);

//* mysql 연결 설정
function connect() {
  var connection = mysql.createConnection({
    host: "mysql",
    user: "root",
    password: "password",
    database: "data_project",
  });

  connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected to MySQL");
    movies.forEach((_movie) => {
      const test = Movie.build(_movie);
      test
        .save()
        .then((res) => {
          console.log("생성완료");
        })
        .catch((e) => {
          console.log("에러", e);
        });
    });
  });
  connection.on("error", function (err) {
    console.log("db error", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      handleDisconnect(); // Connection to the MySQL server is usually handleDisconnect(); // lost due to either server restart, or a } else { // connnection idle timeout (the wait_timeout throw err; // server variable configures this) } });
    } else {
      throw err;
    }
  });
}
connect();

// Movie.init(connection);
// async () => {
//   await sequelize.sync({ force: true });
//   const test = Movie.build({
//     title: "db 테스트중",
//     imdb_score: "0",
//     plot: "경찰 내사과 은시연. 비리 용의자 F1 레이서 재철을 향해 수사망을 좁히던 중 뺑소니 전담반, 일명 '뺑반'으로 좌천된다. 알고 보니 뺑반도 재철을 수사 중. 물불 안 가리는 스피드광, 네 놈을 잡으러 최강 팀플레이 뺑반이 간다!",
//     publish_year: "2019",
//     genre: "범죄, 액션",
//     poster_url:
//       "https://movie-phinf.pstatic.net/20190115_40/15475402622236yHgr_JPEG/movie_image.jpg?type=m203_290_2",
//     naver_user_score: 5.98,
//     naver_user_count: 12903,
//     naver_expert_score: 5.25,
//     naver_expert_count: 8,
//   });
//   await test.save();
// };
// // //* mysql 연결하기

// var sql = "";
// connection.query(sql, function (err, result) {
//   if (err) throw err;
//   console.log("기록 완료");
// });

// title: "db 테스트중",
// imdb_score: "0",
// plot: "경찰 내사과 은시연. 비리 용의자 F1 레이서 재철을 향해 수사망을 좁히던 중 뺑소니 전담반, 일명 '뺑반'으로 좌천된다. 알고 보니 뺑반도 재철을 수사 중. 물불 안 가리는 스피드광, 네 놈을 잡으러 최강 팀플레이 뺑반이 간다!",
// publish_year: "2019",
// genre: "범죄, 액션",
// poster_url:
//   "https://movie-phinf.pstatic.net/20190115_40/15475402622236yHgr_JPEG/movie_image.jpg?type=m203_290_2",
// naver_user_score: 5.98,
// naver_user_count: 12903,
// naver_expert_score: 5.25,
// naver_expert_count: 8,
