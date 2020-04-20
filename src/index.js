const WDIOReporter = require('@wdio/reporter').default
const Suite = require('./suite')
const Stats = require('./stats')
const Test = require('./test')

class WdioMochawesomeReporter extends WDIOReporter {
    constructor (options) {
        options = Object.assign(options)
        super(options)
        this.registerListeners()
    }

    onRunnerStart (runner) {
        this.config = runner.config
        this.sanitizedCaps = runner.sanitizedCapabilities
        // Set sessionId
        if (runner.isMultiremote) {
            this.sessionId = {}
            for (const name in runner.capabilities) {
                this.sessionId[name] = runner.capabilities[name].sessionId
            }
        } else {
            this.sessionId = runner.sessionId
        }
        // mochawesome requires this root suite for HTML report generation to work properly
        this.results = {
            stats: new Stats(runner.start),
            suites: new Suite(true, {'title': ''}),
            copyrightYear: new Date().getFullYear()
        }
    }

    onSuiteStart (suite) {
        this.currSuite = new Suite(false, suite, this.sanitizedCaps)
        this.results.stats.incrementSuites()
    }

    onTestStart (test) {
        this.currTest = new Test(test, this.currSuite.uuid)
        this.currTest.addSessionContext(this.sessionId)
    }

    onTestSkip (test) {
        this.currTest = new Test(test, this.currSuite.uuid)
        this.currTest.addSessionContext(this.sessionId)
    }

    onAfterCommand (cmd) {
        const isScreenshotEndpoint = /\/session\/[^/]*\/screenshot/
        if (isScreenshotEndpoint.test(cmd.endpoint) && cmd.result.value) {
            this.currTest.addScreenshotContext(cmd.result.value)
        }
    }

    onTestEnd (test) {
        this.currTest.duration = test._duration
        this.currTest.updateResult(test)
        this.currTest.context = JSON.stringify(this.currTest.context)
        this.currSuite.addTest(this.currTest)
        this.results.stats.incrementTests(this.currTest)
    }

    onSuiteEnd (suite) {
        this.currSuite.duration = suite.duration
        this.results.suites.addSuite(this.currSuite)
    }

    onRunnerEnd (runner) {
        this.results.stats.end = runner.end
        this.results.stats.duration = runner.duration
        this.write(JSON.stringify(this.results))
    }

    // addContext functionality
    registerListeners () {
        process.on('wdio-mochawesome-reporter:addContext', this.addSomeContext.bind(this))
    }

    addSomeContext (object) {
        this.currTest.context.push(object)
    }

    static addContext (context) {
        process.emit('wdio-mochawesome-reporter:addContext', context)
    }
}

exports.default = WdioMochawesomeReporter
