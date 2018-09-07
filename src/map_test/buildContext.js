import path from 'path'
import { sanitizeScreenshotPath } from './sanitizeScreenshotPath';

export default function (data, mochawesomeOpts, screenshotPath, sessionId) {
    let testContext = []
    // add session id to test context for debugging research
    testContext.push({
        title: 'Session Id',
        value: sessionId
    })
    // context can be specified in a Mocha test if there is any add it first
    if (data.context) {
        testContext.push(JSON.stringify(data.context))
    }
    if (mochawesomeOpts && mochawesomeOpts.includeScreenshots) {
        /**
         * output is a log of all the wdio commands issued for a test
         * we can filter this for any screenshot commands and include them in the context array
         */
        let screenshotCommands = data.output.filter(function (cmd) {
            return cmd.type === 'screenshot'
        })
        if (screenshotCommands.length > 0) {
            const sp = sanitizeScreenshotPath(mochawesomeOpts, screenshotPath)
            // https://github.com/adamgruber/mochawesome#example
            screenshotCommands.forEach(cmd => {
                // if the payload file name does not contain a path, then add the path given in the config file
                if (cmd.payload.filename.indexOf(path.sep) === -1) {
                    testContext.push({
                        title: `Screenshot: ${cmd.payload.filename}`,
                        value: path.join(sp, cmd.payload.filename)
                    })
                } else {
                    testContext.push({
                        title: `Screenshot: ${cmd.payload.filename}`,
                        value: cmd.payload.filename
                    })
                }
            })
        }
    }
    if (!testContext || testContext.length === 0) {
    } else {
        return JSON.stringify(testContext)
    }
}
