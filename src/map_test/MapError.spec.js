import MapError from './MapError'
const expect = require('chai').expect

describe('MapError Unit Tests', function () {
    it('Should return error object without actual and expected', function () {
        const error = {
            type: 'Timeout Error',
            message: 'Timed out waiting for visibility of element #foo',
            stack: 'At line 12 of blah.js'
        }

        let err = MapError(error)

        expect(err.name).to.equal(error.type)
        expect(err.message).to.equal(error.message)
        expect(err.estack).to.equal(error.stack)
        expect(err.stack).to.equal(error.stack)
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

        expect(err.name).to.equal(error.type)
        expect(err.message).to.equal(error.message)
        expect(err.estack).to.equal(error.stack)
        expect(err.stack).to.equal(error.stack)
        expect(err.actual).to.equal(error.actual)
        expect(err.expected).to.equal(error.expected)
        expect(err.showDiff).to.be.true // eslint-disable-line no-unused-expressions
    })
})
