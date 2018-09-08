import InitStats from './InitStats'
const expect = require('chai').expect

describe('InitStats Unit Tests', function () {
    it('Should return a valid stats object', function () {
        let stats = InitStats({stats: { start: 1, end: 2, _duration: 3 }})
        expect(stats.start).to.equal(1)
        expect(stats.end).to.equal(2)
        expect(stats.duration).to.equal(3)
    })
})
