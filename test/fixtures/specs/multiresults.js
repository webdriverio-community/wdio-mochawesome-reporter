const expect = require('chai').expect

suite('A suite', () => {
    test('first passing test', () => {
        expect(1).to.be.equal(1)
    })

    test('second passing test', () => {
        expect(1).to.be.equal(1)
    })

    test('third passing test', () => {
        expect(1).to.be.equal(1)
    })

    test('first failing test', () => {
        expect(1).to.be.equal(2)
    })

    test('second failing test', () => {
        expect(1).to.be.equal(2)
    })

    test.skip('first skipped test', () => {
    })
})
