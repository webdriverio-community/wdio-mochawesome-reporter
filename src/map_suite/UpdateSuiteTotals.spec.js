import UpdateSuiteTotals from './UpdateSuiteTotals'
const expect = require('chai').expect

describe('UpdateSuiteTotals Unit Tests', function () {
    it('Should Update Test Totals Successfully', function () {
        let suiteResult = UpdateSuiteTotals({ tests: [{}, {}], passes: [], failures: [], pending: [] })

        expect(suiteResult.totalTests).to.be.equal(2)
        expect(suiteResult.hasTests).to.be.equal(true)
        expect(suiteResult.totalPasses).to.be.equal(0)
        expect(suiteResult.hasPasses).to.be.equal(false)
        expect(suiteResult.totalFailures).to.be.equal(0)
        expect(suiteResult.hasFailures).to.be.equal(false)
        expect(suiteResult.totalPending).to.be.equal(0)
        expect(suiteResult.hasPending).to.be.equal(false)
    })

    it('Should Update Passes Totals Successfully', function () {
        let suiteResult = UpdateSuiteTotals({ tests: [], passes: [{}, {}], failures: [], pending: [] })

        expect(suiteResult.totalTests).to.be.equal(0)
        expect(suiteResult.hasTests).to.be.equal(false)
        expect(suiteResult.totalPasses).to.be.equal(2)
        expect(suiteResult.hasPasses).to.be.equal(true)
        expect(suiteResult.totalFailures).to.be.equal(0)
        expect(suiteResult.hasFailures).to.be.equal(false)
        expect(suiteResult.totalPending).to.be.equal(0)
        expect(suiteResult.hasPending).to.be.equal(false)
    })

    it('Should Update Failure Totals Successfully', function () {
        let suiteResult = UpdateSuiteTotals({ tests: [], passes: [], failures: [{}, {}], pending: [] })

        expect(suiteResult.totalTests).to.be.equal(0)
        expect(suiteResult.hasTests).to.be.equal(false)
        expect(suiteResult.totalPasses).to.be.equal(0)
        expect(suiteResult.hasPasses).to.be.equal(false)
        expect(suiteResult.totalFailures).to.be.equal(2)
        expect(suiteResult.hasFailures).to.be.equal(true)
        expect(suiteResult.totalPending).to.be.equal(0)
        expect(suiteResult.hasPending).to.be.equal(false)
    })

    it('Should Update Pending Totals Successfully', function () {
        let suiteResult = UpdateSuiteTotals({ tests: [], passes: [], failures: [], pending: [{}, {}] })

        expect(suiteResult.totalTests).to.be.equal(0)
        expect(suiteResult.hasTests).to.be.equal(false)
        expect(suiteResult.totalPasses).to.be.equal(0)
        expect(suiteResult.hasPasses).to.be.equal(false)
        expect(suiteResult.totalFailures).to.be.equal(0)
        expect(suiteResult.hasFailures).to.be.equal(false)
        expect(suiteResult.totalPending).to.be.equal(2)
        expect(suiteResult.hasPending).to.be.equal(true)
    })
})
