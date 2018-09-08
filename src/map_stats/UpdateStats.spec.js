import UpdateStats from './UpdateStats'
import InitStats from './InitStats'
const expect = require('chai').expect

describe('UpdateStats Unit Tests', function () {
    it('', function () {
        let stats = InitStats({stats: { start: 1, end: 2, _duration: 3 }})
        stats = UpdateStats(stats, {totalTests: 6, totalPasses: 3, totalFailures: 2, totalPending: 1})

        expect(stats.tests).to.equal(6)
        expect(stats.testsRegistered).to.equal(6)
        expect(stats.passes).to.equal(3)
        expect(stats.failures).to.equal(2)
        expect(stats.pending).to.equal(1)
        expect(stats.suites).to.equal(1)
        expect(stats.hasSuites).to.be.true // eslint-disable-line no-unused-expressions
        expect(stats.passPercent).to.equal(50)
        expect(stats.pendingPercent).to.equal(17)
    })
})
