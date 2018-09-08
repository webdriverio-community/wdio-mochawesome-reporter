import MapSuiteResult from './MapSuiteResult'
const expect = require('chai').expect

describe('MapSuiteResult Unit Tests', function () {
    it('Should return a vaild Test Suite', function () {
        const data = {
            title: 'Sample Suite',
            '_duration': 500
        }
        var suiteResult = MapSuiteResult(false, data, 'phantomjs')
        expect(suiteResult.title).to.equal('Sample Suite (phantomjs)')
        expect(suiteResult.duration).to.equal(500)
        expect(suiteResult.root).to.be.false // eslint-disable-line no-unused-expressions
        expect(suiteResult.uuid).to.be.not.empty // eslint-disable-line no-unused-expressions
    })
})
