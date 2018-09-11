import path from 'path'
import SanitizeScreenshotPath from './SanitizeScreenshotPath'

export default function (data, mochawesomeOpts, screenshotPath, sessionId) {
    let testContext = []
    // add session id to test context for debugging research
    testContext.push({
        title: 'Session Id',
        value: sessionId
    })
    // context can be specified in a Mocha test if there is any add it first
    if (data.context) {
        if (Array.isArray(data.context)) {
            data.context.forEach((ctx) => {
                testContext.push(ctx)
            })
        } else {
            testContext.push(data.context)
        }
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
            const sp = SanitizeScreenshotPath(mochawesomeOpts, screenshotPath)
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
                        title: `Screenshot: ${path.basename(cmd.payload.filename)}`,
                        value: cmd.payload.filename
                    })
                }
            })
        }
    }
    return testContext
}
