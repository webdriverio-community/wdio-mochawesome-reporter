import { MapState, DidFail, DidPass, DidSkip } from './MapState'
const expect = require('chai').expect

describe('MapState Unit Tests', function () {
    it('Should return passed', function () {
        expect(MapState('pass')).to.equal('passed')
    })

    it('Should return failed', function () {
        expect(MapState('fail')).to.equal('failed')
    })

    it('Should return true when calling DidPass with a state of pass', function () {
        expect(DidPass('pass')).to.equal(true)
    })

    it('Should return true when calling DidPass with a state of passed', function () {
        expect(DidPass('passed')).to.equal(true)
    })

    it('Should return false when calling DidPass with a state of fail', function () {
        expect(DidPass('fail')).to.equal(false)
    })

    it('Should return true when calling DidFail with a state of fail', function () {
        expect(DidFail('fail')).to.equal(true)
    })

    it('Should return true when calling DidFail with a state of failed', function () {
        expect(DidFail('failed')).to.equal(true)
    })

    it('Should return false when calling DidFail with a state of pass', function () {
        expect(DidFail('pass')).to.equal(false)
    })

    it('Should return true when calling DidSkip with a state of skipped', function () {
        expect(DidSkip('skipped')).to.equal(true)
    })

    it('Should return true when calling DidSkip with a state of pending', function () {
        expect(DidSkip('pending')).to.equal(true)
    })

    it('Should return false when calling DidSkip with a state of pass', function () {
        expect(DidSkip('pass')).to.equal(false)
    })

    it('Should return original state for unknown values', function () {
        expect(MapState('pending')).to.equal('pending')
    })
})
