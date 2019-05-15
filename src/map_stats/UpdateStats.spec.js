const UpdateStats = require('./UpdateStats')
const InitStats = require('./InitStats')

describe('UpdateStats Unit Tests', function () {
    it('Should incremet pass', function () {
        let stats = InitStats({stats: { start: 1, end: 2, _duration: 3 }})
        stats = UpdateStats(stats, { pass: true })

        expect(stats.tests).toBe(1)
        expect(stats.testsRegistered).toBe(1)
        expect(stats.passes).toBe(1)
        expect(stats.failures).toBe(0)
        expect(stats.pending).toBe(0)
        expect(stats.passPercent).toBe(100)
        expect(stats.pendingPercent).toBe(0)
    })

    it('Should incremet fail', function () {
        let stats = InitStats({stats: { start: 1, end: 2, _duration: 3 }})
        stats = UpdateStats(stats, { fail: true })

        expect(stats.tests).toBe(1)
        expect(stats.testsRegistered).toBe(1)
        expect(stats.passes).toBe(0)
        expect(stats.failures).toBe(1)
        expect(stats.pending).toBe(0)
        expect(stats.passPercent).toBe(0)
        expect(stats.pendingPercent).toBe(0)
    })

    it('Should incremet pending', function () {
        let stats = InitStats({stats: { start: 1, end: 2, _duration: 3 }})
        stats = UpdateStats(stats, { pending: true })

        expect(stats.tests).toBe(1)
        expect(stats.testsRegistered).toBe(1)
        expect(stats.passes).toBe(0)
        expect(stats.failures).toBe(0)
        expect(stats.pending).toBe(1)
        expect(stats.passPercent).toBe(0)
        expect(stats.pendingPercent).toBe(100)
    })

    it('Should retain values', function () {
        let stats = InitStats({stats: { start: 1, end: 2, _duration: 3 }})
        stats = UpdateStats(stats, { pass: true })
        stats = UpdateStats(stats, { pass: true })
        stats = UpdateStats(stats, { pass: true })
        stats = UpdateStats(stats, { fail: true })
        stats = UpdateStats(stats, { fail: true })
        stats = UpdateStats(stats, { pending: true })

        expect(stats.tests).toBe(6)
        expect(stats.testsRegistered).toBe(6)
        expect(stats.passes).toBe(3)
        expect(stats.failures).toBe(2)
        expect(stats.pending).toBe(1)
        expect(stats.passPercent).toBe(50)
        expect(stats.pendingPercent).toBe(17)
    })
})
