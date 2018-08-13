// 自定义模块
// 把信息保存到文件
const _saveJSON = function(path, answers) {
    const fs = require('fs')
    const s = JSON.stringify(answers, null, 2)
    fs.writeFile(path, s, function(error) {
        if (error !== null) {
            console.log('*** 写入文件错误', error)
        } else {
            console.log('--- 保存成功')
        }
    })
}


exports.saveJSON = _saveJSON
