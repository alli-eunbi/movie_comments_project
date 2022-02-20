import fs from "fs"

const file1 = fs.readFileSync("./filtered.json", { encoding: "utf8" })
const { data: movies } = JSON.parse(file1)

const checkedItems = []

const 중복된영화들 = movies.filter((movie) => {
    if (checkedItems.includes(movie.title)) {
        return true
    }
    checkedItems.push(movie.title)
    return false
})

//? 중복 타이틀 이름들
const 중복된영화들_타이틀 = 중복된영화들.map((movie) => movie.title)

console.log(중복된영화들_타이틀)

//? 중복인데 점수 0인애들
const zeroDuplicated = []

const 중복을제거한영화들 = movies.filter((movie) => {
    //? 중복이고
    if (중복된영화들_타이틀.includes(movie.title)) {
        const 해당중복영화들 = movies.filter(
            (_movie) => _movie.title === movie.title
        )
        //? 해당 영화들의 score 가 다 0이 아니라면
        if (해당중복영화들.some((_movie) => _movie.imdb_score !== "0")) {
            if (movie.imdb_score !== "0") {
                // console.log(movie)
                return true
            }
            return false
        }
        //? 해당 영화들이 싹다 0점임
        if (zeroDuplicated.some((_movie) => _movie.title === movie.title)) {
            return false
        }
        zeroDuplicated.push(movie)
        return false
    }
    return true
})

const final = [...중복을제거한영화들, ...zeroDuplicated]

// console.log(final.length)
fs.writeFileSync("./filtered.json", JSON.stringify({ data: final }))