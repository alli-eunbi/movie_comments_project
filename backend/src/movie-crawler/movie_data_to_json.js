import * as fs from "fs";
import { parseFile } from "fast-csv";

const data = [];

parseFile("./movie_data.csv")
  .on("error", (error) => console.error(error))
  .on("data", (row) => {
    const [title, imdb_score, plot] = row;

    data.push({
      title,
      imdb_score,
      plot,
    });
  })
  .on("end", (rowCount) => {
    fs.writeFileSync("movie.json", JSON.stringify({ data }));
  });
