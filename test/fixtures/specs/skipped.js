const expect = require('chai').expect

suite('A skipped suite', () => {
    test.skip('A skipped test', () => {
        expect(value).to.be.equal('1')
    })
})
