//const dotenv = require("dotenv");
const express = require("express");
const { Movie, sequelize } = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
//dotenv.config()
const main = express.Router();

main.get("/main/movies", async (req, res) => {
  res.statusCode = 200;
  const data = await Movie.findAll({
    order: sequelize.random(),
    attributes: ["index", "poster_url"],
    where: {
      poster_url: {
        [Op.ne]: null,
      },
    },
    limit: 8,
    subQuery: false,
  });
  res.send(data);
});

main.get("/main/movie/:id", async (req, res) => {
  const { id } = req.params;
  res.statusCode = 200;
  const data = await Movie.findOne({
    where: {
      index: id,
    },
  });
  res.send(data);
});

main.get("/main/search/:keyword", async (req, res) => {
  const { keyword } = req.params;
  res.statusCode = 200;
  const data = await Movie.findAll({
    where: {
      title: {
        [Op.like]: `%${keyword}%`,
      },
    },
  });
  res.send(data);
});
export default main;
