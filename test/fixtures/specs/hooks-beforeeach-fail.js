const expect = require('chai').expect

suite('Hooks suite', function() {
    setup('A failing hook', function() {
        browser.url('/index.html')
        browser.click('#thisdoesnotexist')
    })

    test('A test', function() {
        expect(true).to.be(true)
    })
})
