const expect = require('chai').expect
const fs = require('fs')

suite('A WDIO Screenshot suite', () => {
    test('A WDIO Screenshot test', () => {
        browser.url('https://www.google.com')
        browser.click('#thisdoesnotexist')
    })
})
