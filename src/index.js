const WDIOReporter = require('@wdio/reporter').default
const Suite = require('./suite')
const Stats = require('./stats')
const Test = require('./test')
const fs = require('fs')
const path = require('path')

class WdioMochawesomeReporter extends WDIOReporter {
    constructor (options) {
        options = Object.assign(options)
        super(options)
        this.pendingContext = []
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
            results: [new Suite(true, { title: '' })],
            meta: {
                mocha: {
                    version: '11.1.0'
                },
                mochawesome: {
                    options: {
                        quiet: false,
                        reportFilename: 'test-report',
                        saveHtml: true,
                        saveJson: true,
                        consoleReporter: 'spec',
                        useInlineDiffs: false,
                        code: false
                    },
                    version: '7.1.3'
                },
                marge: {
                    options: {
                        reportDir: 'mochawesome-report',
                        reportFilename: 'test-report',
                        reportTitle: 'WebdriverIO Tests',
                        charts: 'true',
                        overwrite: 'true',
                        timestamp: 'true',
                        code: 'false',
                        autoOpen: 'true'
                    },
                    version: '6.2.0'
                }
            }
        }
    }

    onSuiteStart (suite) {
        this.currSuite = new Suite(false, suite, this.sanitizedCaps)
        this.results.stats.incrementSuites()

        // Extract tests from spec file if available
        if (suite.file) {
            try {
                const tests = this.extractTestsFromSpecFile(suite.file)
                if (tests.length > 0) {
                    // Add the extracted tests to a global cache for external access
                    if (!WdioMochawesomeReporter.testCache) {
                        WdioMochawesomeReporter.testCache = {}
                    }

                    // Use normalized path as key
                    const normalizedPath = path.resolve(suite.file)
                    WdioMochawesomeReporter.testCache[normalizedPath] = tests
                }
            } catch (error) {
                console.error(`Error extracting tests from ${suite.file}:`, error.message)
            }
        }
    }

    // Extract tests from spec file
    extractTestsFromSpecFile (filePath) {
        try {
            // Make sure file exists
            if (!fs.existsSync(filePath)) {
                console.error(`Spec file not found: ${filePath}`)
                return []
            }

            // Read file content
            const content = fs.readFileSync(filePath, 'utf-8')

            // Use regex to find it blocks with different patterns
            // Supports:
            // - it('test name', function() {...})
            // - it("test name", () => {...})
            // - it(`test name`, async () => {...})
            // - test('test name', function() {...})
            const itBlockRegex = /(?:it|test)\s*\(\s*(['"`])(.+?)\1\s*,\s*(?:async\s*)?\(?(?:function\s*)?\(?[\w,\s]*\)?\s*(?:=>)?\s*{/g

            const tests = []
            let match

            // Extract all matches
            while ((match = itBlockRegex.exec(content)) !== null) {
                // Find surrounding describe blocks to add more context
                const surroundingCode = content.substring(0, match.index)
                const describeBlocks = this.getDescribeContext(surroundingCode)

                tests.push({
                    title: match[2],
                    line: this.getLineNumber(content, match.index),
                    context: '',
                    state: 'none',
                    fullTitle: [...describeBlocks, match[2]].join(' > ')
                })
            }

            return tests
        } catch (error) {
            console.error(`Error reading spec file ${filePath}:`, error.message)
            return []
        }
    }

    // Extract describe blocks surrounding a test for context
    getDescribeContext (codeUpToTest) {
        const describeRegex = /describe\s*\(\s*(['"`])(.+?)\1\s*,/g
        const describes = []
        let match

        while ((match = describeRegex.exec(codeUpToTest)) !== null) {
            describes.push(match[2])
        }

        return describes
    }

    // Helper to get line number from character index
    getLineNumber (content, index) {
        const lines = content.substring(0, index).split('\n')
        return lines.length
    }

    onTestStart (test) {
        this.currTest = new Test(test, this.currSuite.uuid)
        this.currTest.addSessionContext(this.sessionId)

        // Apply any pending context that was added before the test started
        if (this.pendingContext && this.pendingContext.length > 0) {
            this.pendingContext.forEach(context => {
                this.currTest.context.push(context)
            })
            this.pendingContext = []
        }
    }

    onTestSkip (test) {
        this.currTest = new Test(test, this.currSuite.uuid)
        this.currTest.addSessionContext(this.sessionId)

        // Apply any pending context that was added before the test started
        if (this.pendingContext && this.pendingContext.length > 0) {
            this.pendingContext.forEach(context => {
                this.currTest.context.push(context)
            })
            this.pendingContext = []
        }
    }

    onHookStart (hook) {
        // Create a test object for the hook
        this.currHook = new Test({
            title: hook.title,
            fullTitle: hook.title,
            type: 'hook'
        }, this.currSuite ? this.currSuite.uuid : null)

        // Add session context to hook
        if (this.sessionId) {
            this.currHook.addSessionContext(this.sessionId)
        }

        // Apply any pending context
        if (this.pendingContext && this.pendingContext.length > 0) {
            this.pendingContext.forEach(context => {
                this.currHook.context.push(context)
            })
            this.pendingContext = []
        }
    }

    onHookEnd (hook) {
        if (!this.currHook) return

        this.currHook.duration = hook._duration

        // Handle results
        if (hook.error) {
            this.currHook.state = 'failed'
            this.currHook.fail = true
            this.currHook.err = {
                message: hook.error.message,
                estack: hook.error.stack,
                diff: null
            }

            for (const test of WdioMochawesomeReporter.testCache[this.currSuite.file]) {
                if (test.state === 'none') {
                    const skippedTest = new Test(test, this.currSuite.uuid)
                    test.state = 'skipped'
                    skippedTest.updateResult(test)

                    // Stringify context only if it exists
                    if (skippedTest.context) {
                        skippedTest.context = JSON.stringify(skippedTest.context)
                    }
                    this.currSuite.addTest(skippedTest)
                    this.results.stats.incrementTests(skippedTest)
                }
            }
        } else {
            this.currHook.state = 'passed'
            this.currHook.pass = true
        }

        // Stringify context only if it exists
        if (this.currHook.context) {
            this.currHook.context = JSON.stringify(this.currHook.context)
        }

        // Add to appropriate hook collection
        if (this.currSuite) {
            if (hook.title.includes('before')) {
                this.currSuite.addBeforeHook(this.currHook)
            } else {
                this.currSuite.addAfterHook(this.currHook)
            }
        }

        this.currHook = null
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

        // Initialize testCache for the current file if not already done
        if (!WdioMochawesomeReporter.testCache || !WdioMochawesomeReporter.testCache[this.currSuite.file]) {
            if (!WdioMochawesomeReporter.testCache) {
                WdioMochawesomeReporter.testCache = {}
            }
            WdioMochawesomeReporter.testCache[this.currSuite.file] = []
        }

        for (const cachedTest of WdioMochawesomeReporter.testCache[this.currSuite.file]) {
            if (cachedTest.title === test.title) {
                cachedTest.state = test.state.toLowerCase()
            }
        }

        // Only stringify context if it exists
        if (this.currTest.context) {
            this.currTest.context = JSON.stringify(this.currTest.context)
        }

        this.currSuite.addTest(this.currTest)
        this.results.stats.incrementTests(this.currTest)
    }

    onSuiteEnd (suite) {
        this.currSuite.duration = suite.duration
        this.results.results[0].addSuite(this.currSuite)
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
        if (this.currTest && this.currTest.context) {
            this.currTest.context.push(object)
        } else {
            // Store context for tests that haven't started yet
            if (!this.pendingContext) {
                this.pendingContext = []
            }
            this.pendingContext.push(object)
        }
    }

    static addContext (context) {
        process.emit('wdio-mochawesome-reporter:addContext', context)
    }

    // Clear the test cache (useful for testing or when files change)
    static clearTestCache () {
        WdioMochawesomeReporter.testCache = {}
    }
}

exports.default = WdioMochawesomeReporter
