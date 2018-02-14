const path = require('path')
const stringify = require('json-stringify-safe')
const uuidV4 = require('uuid/v4')

const BuildTestResult = (data,suiteUUID,config) => {

    let test = {
        'title': data.title,
        'fullTitle': data.title,
        'timedOut': false,
        'duration': data._duration,
        'speed': 'fast',
        'pass': data.state === 'pass',
        'fail': data.state === 'fail',
        'pending': data.state === 'pending',
        'code': '',
        'isRoot': false,
        'uuid': uuidV4(),
        'parentUUID': suiteUUID,
        'skipped': data.state === 'pending',
        'isHook': false,
        'context': buildContext(data,config),
        'state': formatState(data.state),
        'err': formatError(data.error),
    }

    return test
} 

function formatState (state){
    switch (state) {
        case 'pass':
            return 'passed'
            break;
        case 'fail':
            return 'failed'
            break;
        default:
            break;
    }
}

function formatError (error){
    let err = {}

    if (error) {
        err.name = error.type
        err.message = error.message
        err.estack = error.stack
        err.stack = error.stack
        if (error.actual && error.expected) {
            err.showDiff = true
            err.actual = error.actual
            err.expected = error.expected
        }
    }

    return err
}

function buildContext(data,config){
    let testContext = []

    //context can be specified in a Mocha test if there is any add it first
    if(data.context){
        testContext.push(JSON.stringify(data.context))
    }

    if (config.mochawesomeOpts && config.mochawesomeOpts.includeScreenshots) {
        /**
         * output is a log of all the wdio commands issued for a test
         * we can filter this for any screenshot commands and include them in the context array
         */
        let screenshotCommands = data.output.filter(function (cmd) {
            return cmd.type === 'screenshot'
        })
        if (screenshotCommands.length > 0) {
            const screenshotPath = config.screenshotPath.replace('//$/', '')
            // https://github.com/adamgruber/mochawesome#example
            screenshotCommands.forEach(cmd => {
                // if the payload file name does not contain a path, then add the path given in the config file
                if (cmd.payload.filename.indexOf(path.sep) === -1) {
                    testContext.push({
                        title: `Screenshot: ${cmd.payload.filename}`, 
                        value: path.resolve(path.join(screenshotPath, cmd.payload.filename))
                    })
                } else {
                    testContext.push({
                        title: `Screenshot: ${cmd.payload.filename}`, 
                        value: path.resolve(cmd.payload.filename)
                    })
                }
            })
        }
    }
    if(!testContext || testContext.length===0){
        return
    } else {
        return JSON.stringify(testContext)
    }
}

module.exports = BuildTestResult