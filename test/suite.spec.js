const Suite = require('../src/suite')
const Test = require('../src/test')

describe('Suite Class Tests',()=>{
    it('Should successfully instantiate a ROOT suite',()=>{
        const suite = new Suite(true, {title: ''})

        expect(suite.root).toBe(true)
        expect(suite.rootEmpty).toBe(undefined)
    })

    it('Should successfully instantiate a NON-ROOT suite',()=>{
        const sampleSuite = { title: 'Sample Suite' }
        const sanitizedCaps = 'chrome.74_0_3729_157.macosx'
        const suite = new Suite(false,sampleSuite, sanitizedCaps)

        expect(suite.root).toBe(false)
        expect(suite.rootEmpty).toBe(undefined)
        expect(suite.title).toContain(sampleSuite.title)
        expect(suite.title).toContain(sanitizedCaps)
    })

    it('Should successfully add a suite to the ROOT suite',()=>{
        const rootSuite = new Suite(true, {title: ''})
        const sampleSuite = { title: 'Sample Suite' }
        const sanitizedCaps = 'chrome.74_0_3729_157.macosx'

        const suite = new Suite(true,rootSuite)
        suite.addSuite(false,sampleSuite,sanitizedCaps)

        expect(suite.suites).toHaveLength(1)
    })

    it('Should successfully add a test to a NON-ROOT suite',()=>{
        const sampleSuite = { title: 'Sample Suite' }
        const sanitizedCaps = 'chrome.74_0_3729_157.macosx'
        const sampleTest = { title: 'This is a test' }
        const suite = new Suite(false,sampleSuite, sanitizedCaps)
        const test = new Test(sampleTest,sampleSuite.uuid)
        test.updateResult({state: 'passed'})

        suite.addTest(test)
        expect(suite.tests.length).toBe(1)
        expect(suite.passes.length).toBe(1)
        expect(suite.passes).toContain(test.uuid)
        expect(suite.tests[0].uuid).toBe(test.uuid)
    })
})