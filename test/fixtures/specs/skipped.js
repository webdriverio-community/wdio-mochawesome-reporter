const expect = require('chai').expect

suite('A skipped suite', () => {
    test.skip('A skipped test', () => {
        browser.url('/index.html')
        browser.waitForExist('#clickable')
        browser.click('#clickable')
        var value = browser.getValue('#result')
        expect(value).to.be.equal('1')
    })
})
