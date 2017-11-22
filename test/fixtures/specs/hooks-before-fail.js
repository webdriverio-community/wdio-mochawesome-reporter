const expect = require('chai').expect

suite('Hooks suite', function() {
    suiteSetup('A failing hook', function() {
        browser.url('/index.html')
        browser.click('#thisdoesnotexisst')
    })

    test('A test', function() {
        expect(true).to.be(true)
    })
})
