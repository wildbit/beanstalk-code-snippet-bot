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
        it('should return proper hashes', () => {
            expect(getLocCrc('/config.ru', 4)).toEqual(7082412740)
            expect(getLocCrc('app/schemas/v1/multi_release_schema.rb', 11)).toEqual(3830012464)
        })
    })
})
