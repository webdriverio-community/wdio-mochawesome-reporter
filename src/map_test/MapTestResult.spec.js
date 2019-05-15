const MapTestResult = require('./MapTestResult')
const uuidV4 = require('uuid')

describe('MapTestResult Unit Tests', function () {
    it('Should return a vaild passing test', function () {
        const suiteId = uuidV4()
        const data = {
            title: 'My Sample Test',
            '_duration': 1200,
            state: 'pass'
        }
        let result = MapTestResult(data, suiteId, {}, 'abc123')
        expect(result.title).toBe(data.title)
        expect(result.fullTitle).toBe(data.title)
        expect(result.context).toBe('[{"title":"Session Id","value":"abc123"}]')
        expect(result.duration).toBe(1200)
        expect(result.state).toBe('passed')
        expect(result.pass).toBe(true)
        expect(result.fail).toBe(false)
        expect(result.pending).toBe(false)
        expect(result.parentUUID).toBe(suiteId)
        expect(result.err).toMatchObject({}) // eslint-disable-line no-unused-expressions
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
        expect(result.title).toBe(data.title)
        expect(result.fullTitle).toBe(data.title)
        expect(result.context).toBe('[{"title":"Session Id","value":"abc123"}]')
        expect(result.duration).toBe(1200)
        expect(result.state).toBe('failed')
        expect(result.pass).toBe(false)
        expect(result.fail).toBe(true)
        expect(result.pending).toBe(false)
        expect(result.parentUUID).toBe(suiteId)
        expect(result.err.name).toBe(data.error.type)
        expect(result.err.message).toBe(data.error.message)
        expect(result.err.estack).toBe(data.error.stack)
        expect(result.err.stack).toBe(data.error.stack)
        expect(result.err.actual).toBe(data.error.actual)
        expect(result.err.expected).toBe(data.error.expected)
        expect(result.err.showDiff).toBe(true)
    })

    it('Should return a vaild skipped test', function () {
        const suiteId = uuidV4()
        const data = {
            title: 'My Sample Test',
            '_duration': 0,
            state: 'pending'
        }
        let result = MapTestResult(data, suiteId, {}, 'abc123')
        expect(result.title).toBe(data.title)
        expect(result.fullTitle).toBe(data.title)
        expect(result.context).toBe('[{"title":"Session Id","value":"abc123"}]')
        expect(result.duration).toBe(data._duration)
        expect(result.state).toBe(undefined)
        expect(result.pass).toBe(false)
        expect(result.fail).toBe(false)
        expect(result.pending).toBe(true)
        expect(result.parentUUID).toBe(suiteId)
        expect(result.err).toMatchObject({})
    })
})
