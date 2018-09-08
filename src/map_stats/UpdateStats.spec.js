import UpdateStats from './UpdateStats'
import InitStats from './InitStats'
const expect = require('chai').expect

describe('UpdateStats Unit Tests', function () {
    it('Should incremet pass', function () {
        let stats = InitStats({stats: { start: 1, end: 2, _duration: 3 }})
        stats = UpdateStats(stats, { pass: true })

        expect(stats.tests).to.equal(1)
        expect(stats.testsRegistered).to.equal(1)
        expect(stats.passes).to.equal(1)
        expect(stats.failures).to.equal(0)
        expect(stats.pending).to.equal(0)
        expect(stats.passPercent).to.equal(100)
        expect(stats.pendingPercent).to.equal(0)
    })

    it('Should incremet fail', function () {
        let stats = InitStats({stats: { start: 1, end: 2, _duration: 3 }})
        stats = UpdateStats(stats, { fail: true })

        expect(stats.tests).to.equal(1)
        expect(stats.testsRegistered).to.equal(1)
        expect(stats.passes).to.equal(0)
        expect(stats.failures).to.equal(1)
        expect(stats.pending).to.equal(0)
        expect(stats.passPercent).to.equal(0)
        expect(stats.pendingPercent).to.equal(0)
    })

    it('Should incremet pending', function () {
        let stats = InitStats({stats: { start: 1, end: 2, _duration: 3 }})
        stats = UpdateStats(stats, { pending: true })

        expect(stats.tests).to.equal(1)
        expect(stats.testsRegistered).to.equal(1)
        expect(stats.passes).to.equal(0)
        expect(stats.failures).to.equal(0)
        expect(stats.pending).to.equal(1)
        expect(stats.passPercent).to.equal(0)
        expect(stats.pendingPercent).to.equal(100)
    })

    it('Should retain values', function () {
        let stats = InitStats({stats: { start: 1, end: 2, _duration: 3 }})
        stats = UpdateStats(stats, { pass: true })
        stats = UpdateStats(stats, { pass: true })
        stats = UpdateStats(stats, { pass: true })
        stats = UpdateStats(stats, { fail: true })
        stats = UpdateStats(stats, { fail: true })
        stats = UpdateStats(stats, { pending: true })

        expect(stats.tests).to.equal(6)
        expect(stats.testsRegistered).to.equal(6)
        expect(stats.passes).to.equal(3)
        expect(stats.failures).to.equal(2)
        expect(stats.pending).to.equal(1)
        expect(stats.passPercent).to.equal(50)
        expect(stats.pendingPercent).to.equal(17)
    })
})
