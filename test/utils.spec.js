/* eslint no-unused-expressions: 0 */

import expect from 'expect'
import { getLocCrc } from '../src/utils'

describe('utils', () => {
    describe('getLocCrc', () => {
        it('should be defined', () => {
            expect(getLocCrc).toNotBe.undefined
        })
    })
})
