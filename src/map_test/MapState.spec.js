const { MapState, DidFail, DidPass, DidSkip } = require('./MapState')

describe('MapState Unit Tests', function () {
    it('Should return passed', function () {
        expect(MapState('pass')).toBe('passed')
    })

    it('Should return failed', function () {
        expect(MapState('fail')).toBe('failed')
    })

    it('Should return true when calling DidPass with a state of pass', function () {
        expect(DidPass('pass')).toBe(true)
    })

    it('Should return true when calling DidPass with a state of passed', function () {
        expect(DidPass('passed')).toBe(true)
    })

    it('Should return false when calling DidPass with a state of fail', function () {
        expect(DidPass('fail')).toBe(false)
    })

    it('Should return true when calling DidFail with a state of fail', function () {
        expect(DidFail('fail')).toBe(true)
    })

    it('Should return true when calling DidFail with a state of failed', function () {
        expect(DidFail('failed')).toBe(true)
    })

    it('Should return false when calling DidFail with a state of pass', function () {
        expect(DidFail('pass')).toBe(false)
    })

    it('Should return true when calling DidSkip with a state of skipped', function () {
        expect(DidSkip('skipped')).toBe(true)
    })

    it('Should return true when calling DidSkip with a state of pending', function () {
        expect(DidSkip('pending')).toBe(true)
    })

    it('Should return false when calling DidSkip with a state of pass', function () {
        expect(DidSkip('pass')).toBe(false)
    })

    it('Should return undefined for unknown values', function () {
        expect(MapState('pending')).toBe(undefined)
    })
})
