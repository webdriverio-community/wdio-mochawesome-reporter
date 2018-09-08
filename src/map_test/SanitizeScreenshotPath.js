import path from 'path'

export default function (mochawesomeOpts, screenshotPath) {
    let sp = screenshotPath.replace('//$/', '')
    if (mochawesomeOpts && mochawesomeOpts.screenshotUseRelativePath) {
        // screenshots will be in a folder under the mochawesome report
        sp = path.join('./', sp)
    } else {
        // absolute path
        sp = path.resolve(sp)
    }
    return sp
}
