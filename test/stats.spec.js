const Stats = require('../src/stats')

describe('Stats Class tests',()=>{
    it('Should successfully increment the Suite Count',()=>{
        const stats = new Stats()
        stats.incrementSuites(0)

        expect(stats.suites).toBe(1)
    })

    it('Should successfully increment a Passing Test',()=>{
        const stats = new Stats()
        stats.incrementTests({ pass: true })

        expect(stats.tests).toBe(1)
        expect(stats.testsRegistered).toBe(1)
        expect(stats.passes).toBe(1)
        expect(stats.passPercent).toBe(100)
    })

    it('Should successfully increment a Failing Test',()=>{
        const stats = new Stats()
        stats.incrementTests({ fail: true })

        expect(stats.tests).toBe(1)
        expect(stats.testsRegistered).toBe(1)
        expect(stats.failures).toBe(1)
        expect(stats.passPercent).toBe(0)
    })

    it('Should successfully increment a Pending Test',()=>{
        const stats = new Stats()
        stats.incrementTests({ pending: true })

        expect(stats.tests).toBe(1)
        expect(stats.testsRegistered).toBe(1)
        expect(stats.pending).toBe(1)
        expect(stats.pendingPercent).toBe(100)
        expect(stats.hasSkipped).toBe(true)
    })

    it('Should successfully calculate a less than 100 percent PASS rate', () => {
        const stats = new Stats()
        stats.incrementTests({ pass: true})
        stats.incrementTests({ pass: true})
        stats.incrementTests({ fail: true})

        expect(stats.passPercent).toBe(67)
    })

    it('Should successfully calculate a less than 100 percent PENDING rate', () => {
        const stats = new Stats()
        stats.incrementTests({ pass: true})
        stats.incrementTests({ pass: true})
        stats.incrementTests({ pending: true})

        expect(stats.pendingPercent).toBe(33)
    })
})