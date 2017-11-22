const expect = require('chai').expect

suite('A suite', () => {
    test('first passing test', () => {
        browser.url('/index.html')
        browser.waitForExist('#clickable')
        browser.click('#clickable')
        var value = browser.getValue('#result')
        expect(value).to.be.equal('1')
    })

    test('second passing test', () => {
        browser.url('/index.html')
        browser.waitForExist('#clickable')
        browser.click('#clickable')
        var value = browser.getValue('#result')
        expect(value).to.be.equal('1')
    })

    test('third passing test', () => {
        browser.url('/index.html')
        browser.waitForExist('#clickable')
        browser.click('#clickable')
        var value = browser.getValue('#result')
        expect(value).to.be.equal('1')
    })

    test('first failing test', () => {
        browser.url('/index.html')
        browser.waitForExist('#clickable')
        browser.click('#clickable')
        var value = browser.getValue('#result')
        expect(value).to.be.equal('2')
    })

    test('second failing test', () => {
        browser.url('/index.html')
        browser.waitForExist('#clickable')
        browser.click('#clickable')
        var value = browser.getValue('#result')
        expect(value).to.be.equal('2')
    })
})
