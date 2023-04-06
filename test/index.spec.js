const WdioMochawesomeReporter = require('../src/index').default

describe('Reporter Tests',()=>{
    const runner = {
        sanitizedCapabilities: 'chrome',
        sessionId: '123456'
    }
    let reporter

    beforeEach(()=>{
        reporter = new WdioMochawesomeReporter({logFile: "log.txt"})
        reporter.onRunnerStart(runner)
    })

    it('onRunnerStart',()=>{
        expect(reporter.results).toMatchObject({
            stats: expect.anything(),
            results: expect.anything()
        })
        expect(reporter.sanitizedCaps).toBe(runner.sanitizedCapabilities)
        expect(reporter.sessionId).toBe(runner.sessionId)
    })

    it('onSuiteStart',()=>{
        const suite = {title: 'sample suite'}

        reporter.onSuiteStart(suite)
        expect(reporter.results.stats.suites).toBe(1)
        expect(reporter.currSuite.title).toBe(`${suite.title} (${runner.sanitizedCapabilities})`)
    })

    it('onTestStart',()=>{
        const suite = {title: 'sample suite',uuid: '1234'}
        const test = {title: 'this is a test',uuid: '9876'}

        reporter.onSuiteStart(suite)
        reporter.onTestStart(test)
        expect(reporter.currTest.title).toBe(test.title)
        expect(reporter.currTest.context[0]).toMatchObject({ title: 'Session Id', value: runner.sessionId })
    })

    it('onTestSkipped',()=>{
        const suite = {title: 'sample suite',uuid: '1234'}
        const test = {title: 'this is a test',uuid: '9876'}

        reporter.onSuiteStart(suite)
        reporter.onTestStart(test)
        expect(reporter.currTest.title).toBe(test.title)
        expect(reporter.currTest.context[0]).toMatchObject({ title: 'Session Id', value: runner.sessionId })
    })

    it('onAfterCommand',()=>{
        const suite = {title: 'sample suite',uuid: '1234'}
        const test = {title: 'this is a test',uuid: '9876'}
        const command = {endpoint: '/session/123456/screenshot/',result: { value: 'abcdefg' }}
        reporter.onSuiteStart(suite)
        reporter.onTestStart(test)

        reporter.onAfterCommand(command)
        expect(reporter.currTest.context[0]).toMatchObject({ title: 'Session Id', value: runner.sessionId })
        expect(reporter.currTest.context[1]).toMatchObject({ title: 'Screenshot', value: 'data:image/jpeg;base64,abcdefg' })
    })

    it('onTestEnd',()=>{
        const suite = {title: 'sample suite',uuid: '1234'}
        const test = {title: 'this is a test',uuid: '9876', _duration: '123', state: 'passed'}
        reporter.onSuiteStart(suite)
        reporter.onTestStart(test)

        reporter.onTestEnd(test)
        expect(reporter.currTest.duration).toBe(test._duration)
        expect(reporter.currTest.pass).toBe(true)
        expect(reporter.currSuite.tests.length).toBe(1)
        expect(reporter.results.stats.tests).toBe(1)
    })

    it('onTestEnd - skipped',()=>{
        const suite = {title: 'sample suite',uuid: '1234'}
        const test = {title: 'this is a test',uuid: '9876', _duration: '123', state: 'skipped'}
        reporter.onSuiteStart(suite)
        reporter.onTestStart(test)

        reporter.onTestEnd(test)
        expect(reporter.currTest.duration).toBe(test._duration)
        expect(reporter.currTest.pending).toBe(true)
        expect(reporter.currSuite.tests.length).toBe(1)
        expect(reporter.results.stats.tests).toBe(1)
    })

    it('onSuiteEnd',()=>{
        const suite = {title: 'sample suite',uuid: '1234', duration: '897'}
        const test = {title: 'this is a test',uuid: '9876', _duration: '123', state: 'passed'}
        reporter.onSuiteStart(suite)
        reporter.onTestStart(test)
        reporter.onTestEnd(test)

        reporter.onSuiteEnd(suite)

        expect(reporter.currSuite.duration).toBe(suite.duration)
        expect(reporter.results.stats.suites).toBe(1)
        expect(reporter.results.results[0].suites.length).toBe(1)
    })

    it('onRunnerEnd', () =>{
        reporter.write = jest.fn()
        runner.end = '1234567890'
        runner.duration = '9987'

        reporter.onRunnerEnd(runner)
        expect(reporter.results.stats.end).toBe(runner.end)
        expect(reporter.results.stats.duration).toBe(runner.duration)
    })
})
