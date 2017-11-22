const expect = require('chai').expect

suite('A failing suite', () => {
    test('A failing test', () => {
        browser.url('/index.html')
        browser.waitForExist('#clickable')
        browser.click('#clickable')
        var value = browser.getValue('#result')
        expect(value).to.be.equal('2')
    })
})
