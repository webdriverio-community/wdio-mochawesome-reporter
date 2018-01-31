const addContext = require('mochawesome/addContext')
const expect = require('chai').expect
const fs = require('fs')

suite('A WDIO suite with context', function () {
    test('can add a string', function () {
        addContext(this, 'content provided to addContext')
        expect(1).to.be.equal(1);
    })
})

