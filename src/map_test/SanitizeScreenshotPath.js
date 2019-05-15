const path = require('path')

module.exports = function (opts) {
    let sp = opts.outputDir.replace('//$/', '')
    if (opts.screenshotUseRelativePath) {
        // screenshots will be in a folder under the mochawesome report
        sp = path.join('./', sp)
    } else {
        // absolute path
        sp = path.resolve(sp)
    }
    return sp
}
