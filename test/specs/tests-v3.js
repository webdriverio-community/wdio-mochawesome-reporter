/* eslint no-unused-expressions: 0 */
const expect = require('chai').expect
const clean = require('../helper').clean
const run = require('../helper').run

suite('wdio-v3 Mochawesome Tests', () => {
    setup(clean)

    test('Detailed validation of a passing test', () => {
        return run(['passing'], 'wdio-v3').then((results) => {
            console.log('evaluating results')
            expect(results).to.have.lengthOf(1)
            let result = results[0]

            // validate stats
            expect(result.stats.suites, 'stats.suites is not correct').to.be.equal(1)
            expect(result.stats.tests, 'stats.tests is not correct').to.be.equal(1)
            expect(result.stats.testsRegistered, 'stats.testsRegistered is not correct').to.be.equal(1)
            expect(result.stats.passes, 'stats.passes is not correct').to.be.equal(1)
            expect(result.stats.pending, 'stats.pending is not correct').to.be.equal(0)
            expect(result.stats.failures, 'stats.failures is not correct').to.be.equal(0)
            expect(result.stats.duration, 'stats.duration is not correct').to.be.greaterThan(0)
            expect(result.stats.passPercent, 'stats.passPercent is not correct').to.be.equal(100)
            expect(result.stats.pendingPercent, 'stats.pendingPercent is not correct').to.be.equal(0)

            // validate suite
            expect(result.suites.suites.length, 'suites.suites was not populated').to.be.equal(1)
            expect(result.suites.suites[0].title, 'suites.suites[0].title is not correct').to.contain('A passing suite')
            expect(result.suites.suites[0].duration, 'suites.suites[0].duration is not correct').to.be.greaterThan(0)
            expect(result.suites.suites[0].uuid, 'suites.suites[0].uuid is not correct').to.not.be.empty
            expect(result.suites.suites[0].tests.length, 'suites.suites[0].tests is not populated').to.be.equal(1)
            expect(result.suites.suites[0].passes.length, 'suites.suites[0].passes is not populated').to.be.equal(1)
            expect(result.suites.suites[0].failures.length, 'suites.suites[0].failures is not populated').to.be.equal(0)
            expect(result.suites.suites[0].skipped.length, 'suites.suites[0].skipped is not populated').to.be.equal(0)
            expect(result.suites.suites[0].pending.length, 'suites.suites[0].pending is not populated').to.be.equal(0)

            // validate tests
            expect(result.suites.suites[0].tests[0].title, 'suites.suites[0].tests[0].title is not correct').to.equal('A passing test')
            expect(result.suites.suites[0].tests[0].fullTitle, 'suites.suites[0].tests[0].fullTitle is not correct').to.equal('A passing test')
            // sometimes duration is actually 0
            // expect(result.suites.suites[0].tests[0].duration, 'suites.suites[0].tests[0].duration is not correct').to.be.greaterThan(0)
            expect(result.suites.suites[0].tests[0].pass, 'suites.suites[0].tests[0].pass is not correct').to.be.true
            expect(result.suites.suites[0].tests[0].fail, 'suites.suites[0].tests[0].fail is not correct').to.be.false
            expect(result.suites.suites[0].tests[0].pending, 'suites.suites[0].tests[0].pending is not correct').to.be.false
            expect(result.suites.suites[0].tests[0].skipped, 'suites.suites[0].tests[0].skipped is not correct').to.be.false
            expect(result.suites.suites[0].tests[0].uuid, 'suites.suites[0].tests[0].uuid is not correct').to.not.be.empty
            expect(result.suites.suites[0].tests[0].parentUUID, 'suites.suites[0].tests[0].parentUUID is not correct').to.equal(result.suites.suites[0].uuid)
            expect(result.suites.suites[0].tests[0].state, 'suites.suites[0].tests[0].state is not correct').to.equal('passed')
            expect(result.suites.suites[0].tests[0].context, 'result.suites.suites[0].tests[0].context is not empty').to.be.empty
        })
    })

    test('Detailed validation of a failing test', () => {
        return run(['failing'], 'wdio-v3').then((results) => {
            expect(results).to.have.lengthOf(1)
            let result = results[0]

            // validate stats
            expect(result.stats.suites, 'stats.suites is not correct').to.be.equal(1)
            expect(result.stats.tests, 'stats.tests is not correct').to.be.equal(1)
            expect(result.stats.testsRegistered, 'stats.testsRegistered is not correct').to.be.equal(1)
            expect(result.stats.passes, 'stats.passes is not correct').to.be.equal(0)
            expect(result.stats.pending, 'stats.pending is not correct').to.be.equal(0)
            expect(result.stats.failures, 'stats.failures is not correct').to.be.equal(1)
            expect(result.stats.duration, 'stats.duration is not correct').to.be.greaterThan(0)
            expect(result.stats.passPercent, 'stats.passPercent is not correct').to.be.equal(0)
            expect(result.stats.pendingPercent, 'stats.pendingPercent is not correct').to.be.equal(0)

            // validate suite
            expect(result.suites.suites.length, 'suites.suites was not populated').to.be.equal(1)
            expect(result.suites.suites[0].title, 'suites.suites[0].title is not correct').to.contain('A failing suite')
            expect(result.suites.suites[0].duration, 'suites.suites[0].duration is not correct').to.be.greaterThan(0)
            expect(result.suites.suites[0].uuid, 'suites.suites[0].uuid is not correct').to.not.be.empty
            expect(result.suites.suites[0].tests.length, 'suites.suites[0].tests is not populated').to.be.equal(1)
            expect(result.suites.suites[0].passes.length, 'suites.suites[0].passes is not populated').to.be.equal(0)
            expect(result.suites.suites[0].failures.length, 'suites.suites[0].failures populated').to.be.equal(1)
            expect(result.suites.suites[0].skipped.length, 'suites.suites[0].skipped is not populated').to.be.equal(0)
            expect(result.suites.suites[0].pending.length, 'suites.suites[0].pending is not populated').to.be.equal(0)

            // validate tests
            expect(result.suites.suites[0].tests[0].title, 'suites.suites[0].tests[0].title is not correct').to.equal('A failing test')
            expect(result.suites.suites[0].tests[0].fullTitle, 'suites.suites[0].tests[0].fullTitle is not correct').to.equal('A failing test')
            // sometimes duration is actually 0
            // expect(result.suites.suites[0].tests[0].duration, 'suites.suites[0].tests[0].duration is not correct').to.be.greaterThan(0)
            expect(result.suites.suites[0].tests[0].pass, 'suites.suites[0].tests[0].pass is not correct').to.be.false
            expect(result.suites.suites[0].tests[0].fail, 'suites.suites[0].tests[0].fail is not correct').to.be.true
            expect(result.suites.suites[0].tests[0].pending, 'suites.suites[0].tests[0].pending is not correct').to.be.false
            expect(result.suites.suites[0].tests[0].skipped, 'suites.suites[0].tests[0].skipped is not correct').to.be.false
            expect(result.suites.suites[0].tests[0].uuid, 'suites.suites[0].tests[0].uuid is not correct').to.not.be.empty
            expect(result.suites.suites[0].tests[0].parentUUID, 'suites.suites[0].tests[0].parentUUID is not correct').to.equal(result.suites.suites[0].uuid)
            expect(result.suites.suites[0].tests[0].state, 'suites.suites[0].tests[0].state is not correct').to.equal('failed')
            expect(result.suites.suites[0].tests[0].err.name, 'suites.suites[0].tests[0].err.name is not correct').to.equal('AssertionError')
            expect(result.suites.suites[0].tests[0].err.message, 'suites.suites[0].tests[0].err.message is not correct').to.equal('expected 1 to equal 2')
            expect(result.suites.suites[0].tests[0].err.estack, 'suites.suites[0].tests[0].err.estack is empry').to.not.be.empty
            expect(result.suites.suites[0].tests[0].err.stack, 'suites.suites[0].tests[0].err.stack is empry').to.not.be.empty
            expect(result.suites.suites[0].tests[0].err.showDiff, 'suites.suites[0].tests[0].err.showDiff is not correct').to.be.true
            expect(result.suites.suites[0].tests[0].err.actual, 'suites.suites[0].tests[0].err.actual is not correct').to.be.equal(1)
            expect(result.suites.suites[0].tests[0].err.expected, 'suites.suites[0].tests[0].err.expected is not correct').to.be.equal(2)
            expect(result.suites.suites[0].tests[0].context, 'result.suites.suites[0].tests[0].context is not empty').to.be.empty
        })
    })

    test('Detailed validation of a skipped test', () => {
        return run(['skipped'], 'wdio-v3').then((results) => {
            expect(results).to.have.lengthOf(1)
            let result = results[0]

            // validate stats
            expect(result.stats.suites, 'stats.suites is not correct').to.be.equal(1)
            expect(result.stats.tests, 'stats.tests is not correct').to.be.equal(1)
            expect(result.stats.testsRegistered, 'stats.testsRegistered is not correct').to.be.equal(1)
            expect(result.stats.passes, 'stats.passes is not correct').to.be.equal(0)
            expect(result.stats.pending, 'stats.pending is not correct').to.be.equal(1)
            expect(result.stats.failures, 'stats.failures is not correct').to.be.equal(0)
            expect(result.stats.duration, 'stats.duration is not correct').to.be.greaterThan(0)
            expect(result.stats.passPercent, 'stats.passPercent is not correct').to.be.equal(0)
            expect(result.stats.pendingPercent, 'stats.pendingPercent is not correct').to.be.equal(100)

            // validate suite
            expect(result.suites.suites.length, 'suites.suites was not populated').to.be.equal(1)
            expect(result.suites.suites[0].title, 'suites.suites[0].title is not correct').to.contain('A skipped suite')
            expect(result.suites.suites[0].uuid, 'suites.suites[0].uuid is not correct').to.not.be.empty
            expect(result.suites.suites[0].tests.length, 'suites.suites[0].tests is not populated').to.be.equal(1)
            expect(result.suites.suites[0].passes.length, 'suites.suites[0].passes is not populated').to.be.equal(0)
            expect(result.suites.suites[0].failures.length, 'suites.suites[0].failures is not populated').to.be.equal(0)
            expect(result.suites.suites[0].skipped.length, 'suites.suites[0].skipped is not populated').to.be.equal(0)
            expect(result.suites.suites[0].pending.length, 'suites.suites[0].pending is not populated').to.be.equal(1)

            // validate tests
            expect(result.suites.suites[0].tests[0].title, 'suites.suites[0].tests[0].title is not correct').to.equal('A skipped test')
            expect(result.suites.suites[0].tests[0].fullTitle, 'suites.suites[0].tests[0].fullTitle is not correct').to.equal('A skipped test')
            expect(result.suites.suites[0].tests[0].pass, 'suites.suites[0].tests[0].pass is not correct').to.be.false
            expect(result.suites.suites[0].tests[0].fail, 'suites.suites[0].tests[0].fail is not correct').to.be.false
            expect(result.suites.suites[0].tests[0].pending, 'suites.suites[0].tests[0].pending is not correct').to.be.true
            expect(result.suites.suites[0].tests[0].skipped, 'suites.suites[0].tests[0].skipped is not correct').to.be.false
            expect(result.suites.suites[0].tests[0].uuid, 'suites.suites[0].tests[0].uuid is not correct').to.not.be.empty
            expect(result.suites.suites[0].tests[0].parentUUID, 'suites.suites[0].tests[0].parentUUID is not correct').to.equal(result.suites.suites[0].uuid)
            expect(result.suites.suites[0].tests[0].state, 'suites.suites[0].tests[0].state is not correct').to.be.undefined
            expect(result.suites.suites[0].tests[0].context, 'result.suites.suites[0].tests[0].context is not empty').to.be.empty
        })
    })

    test('Should handle parallel suites', () => {
        return run(['passing', 'failing'], 'wdio-v3').then((results) => {
            expect(results).to.have.lengthOf(1)
            let result = results[0]

            // validate stats
            expect(result.stats.suites, 'stats.suites is not correct').to.be.equal(2)
            expect(result.stats.tests, 'stats.tests is not correct').to.be.equal(2)
            expect(result.stats.testsRegistered, 'stats.testsRegistered is not correct').to.be.equal(2)
            expect(result.stats.passes, 'stats.passes is not correct').to.be.equal(1)
            expect(result.stats.pending, 'stats.pending is not correct').to.be.equal(0)
            expect(result.stats.failures, 'stats.failures is not correct').to.be.equal(1)
            expect(result.stats.duration, 'stats.duration is not correct').to.be.greaterThan(0)
            expect(result.stats.passPercent, 'stats.passPercent is not correct').to.be.equal(50)
            expect(result.stats.pendingPercent, 'stats.pendingPercent is not correct').to.be.equal(0)
            expect(result.suites.suites.length, 'suites.suites is not correct').to.be.equal(2)
            expect(result.suites.suites[0].title, 'suites.suites might be duplicated').to.not.be.equal(result.suites.suites[1].title)
        })
    })

    test('Should handle multiple results', () => {
        return run(['multiresults'], 'wdio-v3').then((results) => {
            expect(results).to.have.lengthOf(1)
            let result = results[0]

            // validate stats
            expect(result.stats.suites, 'stats.suites is not correct').to.be.equal(1)
            expect(result.stats.tests, 'stats.tests is not correct').to.be.equal(6)
            expect(result.stats.testsRegistered, 'stats.testsRegistered is not correct').to.be.equal(6)
            expect(result.stats.passes, 'stats.passes is not correct').to.be.equal(3)
            expect(result.stats.pending, 'stats.pending is not correct').to.be.equal(1)
            expect(result.stats.failures, 'stats.failures is not correct').to.be.equal(2)
            expect(result.stats.duration, 'stats.duration is not correct').to.be.greaterThan(0)
            expect(result.stats.passPercent, 'stats.passPercent is not correct').to.be.equal(50)
            expect(result.stats.pendingPercent, 'stats.pendingPercent is not correct').to.be.equal(17)

            // validate suites
            expect(result.suites.suites.length, 'suites.suites is not correct').to.be.equal(1)
            expect(result.suites.suites[0].tests.length, 'suites.suites.tests is not correct').to.be.equal(6)
            expect(result.suites.suites[0].passes.length, 'suites.suites.passes is not correct').to.be.equal(3)
            expect(result.suites.suites[0].failures.length, 'suites.suites.failures is not correct').to.be.equal(2)
            expect(result.suites.suites[0].pending.length, 'suites.suites.pendings is not correct').to.be.equal(1)
        })
    })

    test('Should include manual screenshots as part of context', function () {
        return run(['screenshot-manual'], 'wdio-ma-v3').then((results) => {
            expect(results).to.have.lengthOf(1)
            let result = results[0]
            expect(result.suites.suites[0].tests[0].context, 'suites.suites[0].tests[0].context was empty').to.not.be.empty

            let contextData = JSON.parse(result.suites.suites[0].tests[0].context)
            expect(contextData).to.have.lengthOf(1)
            expect(contextData[0].title).to.equal('Screenshot: sample.png')
            expect(contextData[0].value).to.equal('screenshots/sample.png')
        })
    })

    test('Should include wdio-v3 command failure screenshots as part of context', function () {
        return run(['screenshot-wdio'], 'wdio-ma-v3').then((results) => {
            expect(results).to.have.lengthOf(1)
            let result = results[0]
            expect(result.suites.suites[0].tests[0].context, 'suites.suites[0].tests[0].context was empty').to.not.be.empty

            let contextData = JSON.parse(result.suites.suites[0].tests[0].context)
            expect(contextData).to.have.lengthOf(1)
            expect(contextData[0].title).to.contain('ERROR_phantomjs')
            expect(contextData[0].value).to.contain('screenshots/ERROR_phantomjs')
        })
    })

    test('Should include sanitized capabilities with suite name', function () {
        return run(['passing'], 'wdio-v3').then((results) => {
            expect(results).to.have.lengthOf(1)
            let result = results[0]

            expect(result.suites.suites[0].title, 'suites.suites[0].title does not contain the sanitized caps').to.contain('phantomjs')
        })
    })
})
