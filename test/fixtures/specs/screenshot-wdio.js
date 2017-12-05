const expect = require('chai').expect
const fs = require('fs')

suite('A Screenshot suite', () => {
    test('A Screenshot test', () => {
        browser.url('https://www.google.com')
        browser.click('#thisdoesnotexist')
    })
})
