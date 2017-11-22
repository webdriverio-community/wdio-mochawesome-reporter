const expect = require('chai').expect

suite('A passing suite', () => {
    test('A passing test', () => {
        browser.url('/index.html')
        browser.waitForExist('#clickable')
        browser.click('#clickable')
        var value = browser.getValue('#result')
        expect(value).to.be.equal('1')
        expect(1).to.be.equal(1)
    })
})
