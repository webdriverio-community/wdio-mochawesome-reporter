const stripAnsi = require('strip-ansi')
const { v4: uuid } = require('uuid')

module.exports = class {
    constructor (data, suiteUUID) {
        this.title = data.title
        this.fullTitle = data.title
        this.timedOut = false
        this.duration = 0
        this.state = 'pending'
        this.speed = 'fast'
        this.pass = false
        this.fail = false
        this.pending = false
        this.code = ''
        this.err = {}
        this.uuid = uuid()
        this.parentUUID = suiteUUID
        this.skipped = false
        this.context = addTestContext(data) // see below
        this.isHook = false
    }

    updateResult (result) {
        this.state = result.state
        switch (result.state.toLowerCase()) {
        case 'passed':
            this.pass = true
            break
        case 'failed':
            this.fail = true
            break
        case 'skipped':
            this.skipped = true
            this.pending = true
            break
        default:
            break
        }

        /**
         * Jest Matchers returns error strings with ansi color information
         * https://github.com/jest-community/vscode-jest/issues/279
         *
         * stripAnsi will remove those colors.
         * Tested with Jest Matchers AND Chai (which does not include the ansi characters)
         */
        if (result.error) {
            this.err.name = result.error.type
            this.err.message = stripAnsi(result.error.message)
            this.err.estack = stripAnsi(result.error.stack)
            this.err.stack = stripAnsi(result.error.stack)
            if (result.error.actual && result.error.expected) {
                this.err.showDiff = true
                this.err.actual = result.error.actual
                this.err.expected = result.error.expected
            }
        }
    }

    addSessionContext (sessionId) {
        this.context.push({
            title: 'Session Id',
            value: sessionId
        })
    }

    addScreenshotContext (value) {
        this.context.push({
            title: 'Screenshot',
            value: `data:image/jpeg;base64,${value}`
        })
    }
}

/**
* Mochawesome has a utility that allows for adding a context key
* directly to a mocha test object.  If those exist this will add them
* https://github.com/adamgruber/mochawesome#example
*
* putting this outside the class b/c it shouldn't be called directly
*/
function addTestContext (data) {
    const testContext = []
    if (data.context) {
        if (Array.isArray(data.context)) {
            data.context.forEach((ctx) => {
                testContext.push(ctx)
            })
        } else {
            testContext.push(data.context)
        }
    }
    return testContext
}
