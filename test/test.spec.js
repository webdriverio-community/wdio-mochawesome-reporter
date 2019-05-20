const Test = require('../src/test')

describe('Test Class Tests',() => {
    it('Should successfully instantiate a TEST object without context',()=>{
        const sampleTest = { title: 'This is a test' }

        const test = new Test(sampleTest,'1234')

        expect(test.title).toBe(sampleTest.title)
        expect(test.fullTitle).toBe(sampleTest.title)
        expect(test.parentUUID).toBe('1234')
        expect(test.context).toStrictEqual([])
    })

    it('Should successfully instantiate a TEST object with context',()=>{
        const sampleTest = { title: 'This is a test', context: "this is a test" }
        const test = new Test(sampleTest,'1234')

        expect(test.title).toBe(sampleTest.title)
        expect(test.fullTitle).toBe(sampleTest.title)
        expect(test.parentUUID).toBe('1234')
        expect(test.context).toStrictEqual(["this is a test"])
    })

    it('Should successfully update a PASSING test result',()=>{
        const sampleTest = { title: 'This is a test', context: "this is a test" }
        const test = new Test(sampleTest,'1234')
        const result = { state: 'passed' }
        
        test.updateResult(result)
        expect(test.state).toBe(result.state)
        expect(test.pass).toBe(true)
    })

    it('Should successfully update a PENDING test result',()=>{
        const sampleTest = { title: 'This is a test', context: "this is a test" }
        const test = new Test(sampleTest,'1234')
        const result = { state: 'skipped' }
        
        test.updateResult(result)
        expect(test.state).toBe(result.state)
        expect(test.pending).toBe(true)
        expect(test.skipped).toBe(true)
    })

    it('Should successfully update a FAILED test result',()=>{
        const sampleTest = { title: 'This is a test', context: "this is a test" }
        const test = new Test(sampleTest,'1234')
        const result = { state: 'failed', error: { type: 'sample error', message: 'this is an error', stack: 'blah blah blah'} }
        
        test.updateResult(result)
        expect(test.state).toBe(result.state)
        expect(test.fail).toBe(true)
        expect(test.err).toBeDefined
        expect(test.err.name).toBe(result.error.type)
        expect(test.err.message).toBe(result.error.message)
        expect(test.err.stack).toBe(result.error.stack)
        expect(test.err.estack).toBe(result.error.stack)
    })

    it('Should successfully add Session ID Context',()=>{
        const sampleTest = { title: 'This is a test' }
        const test = new Test(sampleTest,'1234')
       
        test.addSessionContext('123456')
        expect(test.context).toStrictEqual([{ title: 'Session Id', value: '123456' }])
    })

    it('Should successfully add Screenshot Context',()=>{
        const sampleTest = { title: 'This is a test' }
        const test = new Test(sampleTest,'1234')
       
        test.addScreenshotContext('abcdefg')
        expect(test.context).toStrictEqual([{ title: 'Screenshot', value: 'data:image/jpeg;base64,abcdefg' }])
    })
})