/* eslint no-unused-expressions: 0 */

const expect = require('expect')
const {
    parseUrl,
    getContentWithAttachements,
    getSanitizedPath,
    getLocCrc,
    linesHashMap,
    getLineNumberFromHash,
    linesAsArrayWithLineNumbers,
    getLinesAround,
    getFileContents
} = require('../src/utils')

describe('utils', () => {
    describe('getFileContents', () => {
        it('should be defined', () => {
            expect(getFileContents).toExist()
        })
    })

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
            expect(getLocCrc('index.js', 1)).toEqual(4259026361)
            expect(getLocCrc('index.js', 5)).toEqual(4272935344)
            expect(getLocCrc('index.js', 6)).toEqual(2545360918)
            expect(getLocCrc('app/schemas/v1/multi_release_schema.rb', 11)).toEqual(3830012464)
        })
    })

    describe('linesHashMap', () => {
        it('should return proper hashes', () => {
            const content =
`line 1
line 2
`
            expect(linesHashMap(content, 'index.js')).toBeAn('array')
            expect(linesHashMap(content, 'index.js').length).toEqual(3)
            expect(linesHashMap(content, 'index.js')).toEqual([4259026361, 2496947215, 3889247389])
        })
    })

    describe('getLineNumberFromHash', () => {
        it('should return proper hashes', () => {
            const content =
                `line 1
line 2

line 4
`
            expect(getLineNumberFromHash(4259026361, content, 'index.js')).toEqual(1)
            expect(getLineNumberFromHash(3889247389, content, 'index.js')).toEqual(3)
            expect(getLineNumberFromHash(4272935344, content, 'index.js')).toEqual(5)
        })
    })

    describe('parseUrl', () => {
        const url1 = '<https://wb.beanstalkapp.com/beanstalk/browse/git/app/schemas/v1/multi_release_schema.rb#L3830012464>'
        const url2 = 'http://test-complex123.beanstalkapp.com/testRepo/browse/git/index.js'
        const url3 = 'test-complex123.beanstalkapp.com/'
        const url4 = 'https://derekandrey.beanstalkapp.com/codesnippet-tets/browse/git/index.js?ref=c-397c63ede5221cfeef426a2b861132255e35a7bf#L3830012464'
        const url5 = 'https://myaccount.beanstalkapp.com/myrepo/browse/trunk/path/file.ext?ref=c-12345#L54321'

        it('should return an empty object for no mathces', () => {
            expect(parseUrl(undefined)).toEqual({})
            expect(parseUrl(null)).toEqual({})
            expect(parseUrl('some random string')).toEqual({})
        })

        it('should return account name', () => {
            expect(parseUrl(url1).accountName).toEqual('wb')
            expect(parseUrl(url2).accountName).toEqual('test-complex123')
            expect(parseUrl(url3)).toEqual({})
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
            expect(parseUrl(url5).filepath).toEqual('trunk/path/file.ext')
        })

        it('should return line hash', () => {
            expect(parseUrl(url1).locHash).toEqual('3830012464')
            expect(parseUrl(url2).locHash).toBe(undefined)
            expect(parseUrl(url4).locHash).toEqual('3830012464')
            expect(parseUrl(url5).locHash).toEqual('54321')
        })

        it('should return revision number', () => {
            expect(parseUrl(url1).revision).toBe(undefined)
            expect(parseUrl(url2).revision).toBe(undefined)
            expect(parseUrl(url4).revision).toEqual('397c63ede5221cfeef426a2b861132255e35a7bf')
            expect(parseUrl(url5).revision).toEqual('12345')
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
            expect(linesAsArrayWithLineNumbers(content).join('\n')).toEqual(expected)
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
            expect(linesAsArrayWithLineNumbers(content).join('\n')).toEqual(expected)
        })
    })
    describe('getLinesAround', () => {
        it('should return lines around the specified line +- offset', () => {
            const content =
`line 1
line 2
line 3
line 4
line 5
line 6
line 7
line 8
line 9
line 10
`
            const expected1 =
`01. line 1
02. line 2
03. line 3
...`

            const expected2 =
`...
03. line 3
04. line 4
05. line 5
06. line 6
07. line 7
...`

            const expected3 =
`...
08. line 8
09. line 9
10. line 10`
            /* eslint-enable */
            expect(getLinesAround(content, 1, 2).join('\n')).toEqual(expected1)
            expect(getLinesAround(content, 5, 2).join('\n')).toEqual(expected2)
            expect(getLinesAround(content, 10, 2).join('\n')).toEqual(expected3)
        })
    })

    describe('getContentWithAttachements', () => {
        const contents = `var Botkit = require('botkit')

// Expect a SLACK_TOKEN environment variable
var slackToken = process.env.SLACK_TOKEN
if (!slackToken) {
  console.error('SLACK_TOKEN is required!')
  process.exit(1)
}

`
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
                "contents": contents
            }
            /* eslint-enable */
        }
        it('should return an object with attachement', () => {
            const url = 'https://derekandrey.beanstalkapp.com/codesnippet-tets/browse/git/index.js?ref=c-397c63ede5221cfeef426a2b861132255e35a7bf'
            const expected = {
                /* eslint-disable */
                "username": "index.js",
                "text": `\`\`\`01. var Botkit = require('botkit')
02. 
03. // Expect a SLACK_TOKEN environment variable
04. var slackToken = process.env.SLACK_TOKEN
05. if (!slackToken) {
06.   console.error('SLACK_TOKEN is required!')
07.   process.exit(1)
08. }
09. 
10. 
\`\`\``,
                "attachments": [
                    {
                        "fallback": "index.js",
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
                        ]
                    }
                    /* eslint-enable */
                ]
            }
            expect(getContentWithAttachements(response, url)).toEqual(expected)
        })

        it('should support LOC anchors', () => {
            const url = 'https://derekandrey.beanstalkapp.com/codesnippet-tets/browse/git/index.js?ref=c-397c63ede5221cfeef426a2b861132255e35a7bf#L4272935344'
            const expected = {
                /* eslint-disable */
                "username": "index.js",
                "text": `\`\`\`...
02. 
03. // Expect a SLACK_TOKEN environment variable
04. var slackToken = process.env.SLACK_TOKEN
05. if (!slackToken) {
06.   console.error('SLACK_TOKEN is required!')
07.   process.exit(1)
08. }
...
\`\`\``,
                "attachments": [
                    {
                        "fallback": "index.js",
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
                        ]
                    }
                    /* eslint-enable */
                ]
            }
            expect(getContentWithAttachements(response, url)).toEqual(expected)
        })
    })
})
