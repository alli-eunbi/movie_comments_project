import puppeteer from "puppeteer"
import fs from "fs"

const crawling = async () => {
    const browser = await puppeteer.launch()

    const moviesString = fs.readFileSync("./movie.json", { encoding: "utf8" })
    const { data: movies } = JSON.parse(moviesString)
    const datas = []

    const handleTask = async (movie, index) => {
        const publish_year = movie.title.split("(")
        const movieTitle = publish_year[0]
        const year = publish_year[1].replace(")", "")
        console.log(movieTitle, index)
        try {
            //* 이미지 주소
            const page = await browser.newPage()
            await page.goto(
                `https://movie.naver.com/movie/search/result.naver?query=${movieTitle}`
            )

            //* 네이버 영화에 없는 경우
            const titleLink = await page.$(".search_list_1 > li > dl > dt > a ")
            if (!titleLink) {
                datas.push({
                    ...movie,
                    title: movieTitle,
                    publish_year: year,
                    genre: null,
                    poster_url: null,
                    naver_user_score: 0,
                    naver_user_count: 0,
                    naver_expert_score: 0,
                    naver_expert_count: 0,
                })

                if (datas.length % 20 === 0) {
                    fs.writeFileSync(
                        "./data1.json",
                        JSON.stringify({ data: datas })
                    )
                }
                if (movies.length - 1 === index) {
                    console.log("저장합니다.")
                    fs.writeFileSync(
                        "./data1.json",
                        JSON.stringify({ data: datas })
                    )
                    process.exit(1)
                }
                return
            }

            const stars = await page.$(".point > .num")

            const rating =
                (await (await stars?.getProperty("innerText"))?.jsonValue()) ||
                null

            const userCount = await page.$(".point > .cuser_cnt")
            const user_count =
                (await (
                    await userCount?.getProperty("innerText")
                )?.jsonValue()) || null

            const href =
                (await (await titleLink?.getProperty("href"))?.jsonValue()) ||
                null

            //* 장르 찾기
            const GenreDom = await page.$(".etc")
            const genreDomInnerText = await (
                await GenreDom?.getProperty("innerText")
            )?.jsonValue()
            const genre = genreDomInnerText?.split("|")[0] || null

            await page.goto(href)
            const posterDoms = await page.$$(".poster")

            const postDom = posterDoms[1] || posterDoms[0]
            let posterUrl = null
            if (postDom) {
                const image = await postDom.$("img")

                posterUrl =
                    (await (await image?.getProperty("src"))?.jsonValue()) ||
                    null
            }

            let description = "no plot"
            if (movie.plot === "no plot") {
                //* 줄거리
                const descriptionDom = await page.$(".con_tx")

                let description =
                    (await (
                        await descriptionDom?.getProperty("innerText")
                    )?.jsonValue()) || "no plot"
            }

            //* 평가 점수 찾기
            const scoreDoms = await page.$$(".sc_view")

            const expertScoreDomWrapper = scoreDoms[1]

            let expertScore = null
            let expertScoreCount = null
            if (expertScoreDomWrapper) {
                const expertScoreDom = await expertScoreDomWrapper.$(
                    ".star_score > em"
                )

                expertScore =
                    (await (
                        await expertScoreDom?.getProperty("innerText")
                    )?.jsonValue()) || null

                const expertScoreCountDom = await expertScoreDomWrapper.$(
                    ".user_count > em"
                )

                expertScoreCount =
                    (await (
                        await expertScoreCountDom.getProperty("innerText")
                    )?.jsonValue()) || null
            }
            datas.push({
                ...movie,
                title: movieTitle,
                publish_year: year,
                genre: genre,
                plot: movie.plot === "no plot" ? description : movie.plot,
                poster_url: posterUrl,
                naver_user_score: rating ? Number(rating) : 0,
                naver_user_count: user_count
                    ? Number(
                          user_count.replace("(참여 ", "").replace("명)", "")
                      )
                    : 0,
                naver_expert_score: expertScore ? Number(expertScore) : 0,
                naver_expert_count: expertScoreCount
                    ? Number(expertScoreCount)
                    : 0,
            })
        } catch (e) {
            console.log(movie?.title?.replace(/\s/g, "+"), "이름")
            console.debug(e)
        }
        if (datas.length % 20 === 0) {
            fs.writeFileSync("./data1.json", JSON.stringify({ data: datas }))
        }
        if (movies.length - 1 === index) {
            console.log("저장합니다.")
            fs.writeFileSync("./data1.json", JSON.stringify({ data: datas }))
            process.exit(1)
        }
    }

    await movies.reduce(async (prevTask, currTask, index) => {
        await prevTask
        return handleTask(currTask, index)
    }, Promise.resolve())
}
crawling()