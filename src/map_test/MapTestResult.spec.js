import MapTestResult from './MapTestResult'
import uuidV4 from 'uuid'
const expect = require('chai').expect

describe('MapTestResult Unit Tests', function () {
    it('Should return a vaild passing test', function () {
        const suiteId = uuidV4()
        const data = {
            title: 'My Sample Test',
            '_duration': 1200,
            state: 'pass'
        }
        let result = MapTestResult(data, suiteId, {}, 'abc123')
        expect(result.title).to.equal(data.title)
        expect(result.fullTitle).to.equal(data.title)
        expect(result.context).to.equal('[{"title":"Session Id","value":"abc123"}]')
        expect(result.duration).to.equal(1200)
        expect(result.state).to.equal('passed')
        expect(result.pass).to.equal(true)
        expect(result.fail).to.equal(false)
        expect(result.pending).to.equal(false)
        expect(result.parentUUID).to.equal(suiteId)
        expect(result.err).to.be.empty // eslint-disable-line no-unused-expressions
    })

    it('Should return a vaild failing test', function () {
        const suiteId = uuidV4()
        const data = {
            title: 'My Sample Test',
            '_duration': 1200,
            state: 'fail',
            error: {
                type: 'Assertion Error',
                message: 'Assertion Failed expected "1" to be "2"',
                stack: 'At line 12 of blah.js',
                actual: '1',
                expected: '2'
            }
        }
        let result = MapTestResult(data, suiteId, {}, 'abc123')
        expect(result.title).to.equal(data.title)
        expect(result.fullTitle).to.equal(data.title)
        expect(result.context).to.equal('[{"title":"Session Id","value":"abc123"}]')
        expect(result.duration).to.equal(1200)
        expect(result.state).to.equal('failed')
        expect(result.pass).to.equal(false)
        expect(result.fail).to.equal(true)
        expect(result.pending).to.equal(false)
        expect(result.parentUUID).to.equal(suiteId)
        expect(result.err.name).to.equal(data.error.type)
        expect(result.err.message).to.equal(data.error.message)
        expect(result.err.estack).to.equal(data.error.stack)
        expect(result.err.stack).to.equal(data.error.stack)
        expect(result.err.actual).to.equal(data.error.actual)
        expect(result.err.expected).to.equal(data.error.expected)
        expect(result.err.showDiff).to.equal(true)
    })

    it('Should return a vaild skipped test', function () {
        const suiteId = uuidV4()
        const data = {
            title: 'My Sample Test',
            '_duration': 0,
            state: 'pending'
        }
        let result = MapTestResult(data, suiteId, {}, 'abc123')
        expect(result.title).to.equal(data.title)
        expect(result.fullTitle).to.equal(data.title)
        expect(result.context).to.equal('[{"title":"Session Id","value":"abc123"}]')
        expect(result.duration).to.equal(data._duration)
        expect(result.state).to.be.undefined // eslint-disable-line no-unused-expressions
        expect(result.pass).to.be.false // eslint-disable-line no-unused-expressions
        expect(result.fail).to.be.false // eslint-disable-line no-unused-expressions
        expect(result.pending).to.be.true // eslint-disable-line no-unused-expressions
        expect(result.parentUUID).to.equal(suiteId)
        expect(result.err).to.be.empty // eslint-disable-line no-unused-expressions
    })
})
