const MapSuiteResult = require('./MapSuiteResult')

describe('MapSuiteResult Unit Tests', function () {
    it('Should return a vaild Test Suite', function () {
        const data = {
            title: 'Sample Suite',
            '_duration': 500
        }
        var suiteResult = MapSuiteResult(false, data, 'phantomjs')
        expect(suiteResult.title).toBe('Sample Suite (phantomjs)')
        expect(suiteResult.duration).toBe(500)
        expect(suiteResult.root).toBe(false)
        expect(suiteResult.uuid).toMatch(/\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/)
    })
})
