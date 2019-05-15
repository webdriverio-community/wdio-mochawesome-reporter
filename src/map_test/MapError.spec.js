const MapError = require('./MapError')

describe('MapError Unit Tests', function () {
    it('Should return error object without actual and expected', function () {
        const error = {
            type: 'Timeout Error',
            message: 'Timed out waiting for visibility of element #foo',
            stack: 'At line 12 of blah.js'
        }

        let err = MapError(error)

        expect(err.name).toBe(error.type)
        expect(err.message).toBe(error.message)
        expect(err.estack).toBe(error.stack)
        expect(err.stack).toBe(error.stack)
    })
    it('Should return error object with actual and expected', function () {
        const error = {
            type: 'Assertion Error',
            message: 'Assertion Failed expected "1" to be "2"',
            stack: 'At line 12 of blah.js',
            actual: '1',
            expected: '2'
        }

        let err = MapError(error)

        expect(err.name).toBe(error.type)
        expect(err.message).toBe(error.message)
        expect(err.estack).toBe(error.stack)
        expect(err.stack).toBe(error.stack)
        expect(err.actual).toBe(error.actual)
        expect(err.expected).toBe(error.expected)
        expect(err.showDiff).toBe(true)
    })
})
