"use strict"


const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs')


const Movie = function() {
    this.name = ''
    this.score = 0
    this.quote = ''
    this.ranking = 0
    this.coverUrl = ''
}


const log = function() {
    console.log.apply(console, arguments)
}


// 从电影 div 里面读取电影信息
const movieFromDiv = function(div) {
    const movie = new Movie()
    const e = cheerio.load(div)

    movie.name = e('.title').text()
    movie.score = e('.rating_num').text()
    movie.quote = e('.inq').text()

    const pic = e('.pic')
    movie.ranking = pic.find('em').text()
    movie.coverUrl = pic.find('img').attr('src')

    return movie
}


// 把电影信息写入文件
const saveMovies = function(movies) {
    const fs = require('fs')
    const path = 'douban.txt'
    const s = JSON.stringify(movies, null, 2)
    fs.writeFile(path, s, function(error) {
        if (error !== null) {
            log('*** 写入文件错误', error)
        } else {
            log('--- 保存成功')
        }
    })
}


// 保存电影图片
const downloadCovers = function(movies) {
    for (let i = 0; i < movies.length; i++) {
        const m = movies[i]
        const url = m.coverUrl
        const path = m.name.split('/')[0] + '.jpg'
        request(url).pipe(fs.createWriteStream(path))
    }
}


const moviesFromUrl = function(url) {
    request(url, function(error, response, body) {
        if (error === null && response.statusCode == 200) {
            const e = cheerio.load(body)
            const movies = []
            const movieDivs = e('.item')
            for(let i = 0; i < movieDivs.length; i++) {
                let element = movieDivs[i]
                const div = e(element).html()
                const m = movieFromDiv(div)
                movies.push(m)
            }
            saveMovies(movies)
            downloadCovers(movies)
        } else {
            log('*** ERROR 请求失败 ', error)
        }
    })
}


const __main = function() {
    var url = 'https://movie.douban.com/top250'
    moviesFromUrl(url)
    // https://movie.douban.com/top250?start=25&filter=
    var array = [25, 50, 75, 100, 125, 150, 175, 200, 225]
    for (var i = 0; i < array.length; i++) {
        var index = array[i]
        var url = 'https://movie.douban.com/top250?start=' + index + '&filter='
        moviesFromUrl(url)
    }

}


// 程序入口
__main()
