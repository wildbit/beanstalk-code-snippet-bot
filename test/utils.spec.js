/* eslint no-unused-expressions: 0 */

import expect from 'expect'
import { getSanitizedPath, getLocCrc } from '../src/utils'

describe('utils', () => {
    describe('getSanitizedPath', () => {
        it('should be defined', () => {
            expect(getSanitizedPath).toNotBe.undefined
        })

        it('should remove leading and trailing slashed from the path', () => {
            expect(getSanitizedPath('test')).toEqual('test')
            expect(getSanitizedPath('/test')).toEqual('test')
            expect(getSanitizedPath('test/')).toEqual('test')
            expect(getSanitizedPath('/test/')).toEqual('test')
            expect(getSanitizedPath('/test/test2')).toEqual('test/test2')
            expect(getSanitizedPath('/test/test2/')).toEqual('test/test2')
            expect(getSanitizedPath('test/test2')).toEqual('test/test2')
        })
    })
    describe('getLocCrc', () => {
        it('should be defined', () => {
            expect(getLocCrc).toNotBe.undefined
        })
    })
})
