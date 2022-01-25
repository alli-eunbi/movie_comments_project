const fs = require("fs");
const express = require("express");
const mysql = require("mysql");
var app = express();

const file1 = fs.readFileSync("./movie-crawler/final.json", {
  encoding: "utf8",
});
const { data: movies } = JSON.parse(file1);

//* mysql 연결 설정
var connection = mysql.createConnection({
  host: "mysql",
  user: "root",
  password: "password",
  database: "data_project",
});

//* mysql 연결하기
connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected to MySQL");
  //   var sql ="";
  //   connection.query(sql, function(err, result){
  //       if(err) throw err;
  //       console.log("기록 완료")
  //   })
});
