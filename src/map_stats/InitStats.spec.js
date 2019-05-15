const InitStats = require('./InitStats')

describe('InitStats Unit Tests', function () {
    it('Should return a valid stats object', function () {
        let stats = InitStats({ start: 1, end: 2, _duration: 3 })
        expect(stats.start).toBe(1)
        expect(stats.end).toBe(2)
        expect(stats.duration).toBe(3)
    })
})
