/* eslint no-unused-expressions: 0 */

import expect from 'expect'
import {
    parseUrl,
    getContentWithAttachements,
    getSanitizedPath,
    getLocCrc,
    withLineNumbers
} from '../src/utils'

describe('utils', () => {
    describe('getSanitizedPath', () => {
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
        it('should return proper hashes', () => {
            expect(getLocCrc('/config.ru', 4)).toEqual(7082412740)
            expect(getLocCrc('app/schemas/v1/multi_release_schema.rb', 11)).toEqual(3830012464)
        })
    })

    describe('parseUrl', () => {
        const url1 = '<https://wb.beanstalkapp.com/beanstalk/browse/git/app/schemas/v1/multi_release_schema.rb#L3830012464>'
        const url2 = 'http://test-complex123.beanstalkapp.com/testRepo/browse/git/index.js'
        const url3 = 'test-complex123.beanstalkapp.com/'
        const url4 = 'https://derekandrey.beanstalkapp.com/codesnippet-tets/browse/git/index.js?ref=c-397c63ede5221cfeef426a2b861132255e35a7bf#L3830012464'

        it('should return account name', () => {
            expect(parseUrl(url1).accountName).toEqual('wb')
            expect(parseUrl(url2).accountName).toEqual('test-complex123')
            expect(parseUrl(url3)).toEqual(null)
            expect(parseUrl(url4).accountName).toEqual('derekandrey')
        })
        it('should return repository name', () => {
            expect(parseUrl(url1).repositoryName).toEqual('beanstalk')
            expect(parseUrl(url2).repositoryName).toEqual('testRepo')
            expect(parseUrl(url4).repositoryName).toEqual('codesnippet-tets')
        })

        it('should return filepath', () => {
            expect(parseUrl(url1).filepath).toEqual('app/schemas/v1/multi_release_schema.rb')
            expect(parseUrl(url2).filepath).toEqual('index.js')
            expect(parseUrl(url4).filepath).toEqual('index.js')
        })

        it('should return line hash', () => {
            expect(parseUrl(url1).locHash).toEqual('3830012464')
            expect(parseUrl(url2).locHash).toBe(undefined)
            expect(parseUrl(url4).locHash).toEqual('3830012464')
        })

        it('should return revision number', () => {
            expect(parseUrl(url1).revision).toBe(undefined)
            expect(parseUrl(url2).revision).toBe(undefined)
            expect(parseUrl(url4).revision).toEqual('397c63ede5221cfeef426a2b861132255e35a7bf')
        })

    })

    describe('withLineNumbers', () => {
        it('should return content with line numbers', () => {
            /* eslint-disable */
            const content =
`line 1
line 2

line 4
`
            const expected =
`1. line 1
2. line 2
3. 
4. line 4
5. `
            expect(withLineNumbers(content)).toEqual(expected)
        })

        it('should pad line numbers', () => {
            const content =
`line 1








line10
`
            const expected =
`01. line 1
02. 
03. 
04. 
05. 
06. 
07. 
08. 
09. 
10. line10
11. `
            /* eslint-enable */
            expect(withLineNumbers(content)).toEqual(expected)
        })
    })

    describe('getContentWithAttachements', () => {
        it('should return an object with attachement', () => {
            const response = {
                /* eslint-disable */
                "data": {
                    "repository": {
                        "id": 686137,
                        "account_id": 184458,
                        "name": "codesnippet-tets",
                        "created_at": "2016/04/12 21:16:42 +0000",
                        "updated_at": "2016/04/12 21:22:09 +0000",
                        "title": "codesnippet-tests",
                        "color_label": "white",
                        "storage_used_bytes": 52224,
                        "last_commit_at": "2016/04/12 21:22:07 +0000",
                        "type": "GitRepository",
                        "default_branch": "master",
                        "vcs": "git",
                        "repository_url": "git@derekandrey.git.beanstalkapp.com:/derekandrey/codesnippet-tets.git",
                        "repository_url_https": "https://derekandrey.git.beanstalkapp.com/codesnippet-tets.git",
                    },
                    "name": "index.js",
                    "path": "index.js",
                    "revision": "397c63ede5221cfeef426a2b861132255e35a7bf",
                    "directory": false,
                    "file": true,
                    "binary": false,
                    "mime_type": "application/javascript",
                    "language": "javascript",
                    "contents": 'test\n\nline 2'
                }
                /* eslint-enable */
            }
            const expected = {
                /* eslint-disable */
                "username": "Beanstalk Code Snippet Bot",
                "attachments": [
                    {
                        "fallback": "index.js",
                        "title": "index.js",
                        "text": `\`\`\`1. test
2. 
3. line 2
\`\`\``,
                        "fields": [
                            {
                                "title": "Repository",
                                "value": "codesnippet-tests",
                                "short": true
                            },
                            {
                                "title": "Revision",
                                "value": "397c63ede5221cfeef426a2b861132255e35a7bf",
                                "short": true
                            }
                        ],
                        "mrkdwn_in": ["text"]
                    }
                /* eslint-enable */
                ]
            }
            expect(getContentWithAttachements(response)).toEqual(expected)
        })
    })
})
