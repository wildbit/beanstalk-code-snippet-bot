import crc from 'easy-crc32'
import axios from 'axios'

const NAME = 'Beanstalk Code Snippet Bot'

export function getSanitizedPath(path) {
    return path
        .replace(/^\//, '')
        .replace(/\/$/, '')
}
export function getLocCrc(filepath, line) {
    return crc.calculate(getSanitizedPath(filepath)) + crc.calculate(`${ line }`)
}

export function parseUrl(url) {
    const re = new RegExp(/([\w-_]+)\.beanstalkapp\.com\/([\w-_]+)\/browse\/git\/([\w-_/.]+)(\?ref=c-(\w+))?(#L(\d+))?/g) // eslint-disable-line
    const matches = re.exec(url)
    if (matches) {
        const [, accountName, repositoryName, filepath, ...rest] = matches
        const [, rev, , locHash] = rest
        return {
            accountName,
            repositoryName,
            filepath,
            locHash,
            rev
        }
    }
    return null
}

export function getContentWithAttachements(response) {
    const { path, name, contents, revision, repository } = response.data
    return {
        username: NAME,
        attachments: [{
            fallback: path,
            title: name,
            text: `\`\`\`${ contents }\n\`\`\``,
            fields: [{
                title: 'Repository',
                value: repository.title,
                short: true
            }, {
                title: 'Revision',
                value: revision,
                short: true
            }],
            mrkdwn_in: ['text']
        }]
    }
}

export function getFileContents(url, options, cb) {
    const { username, token } = options
    if (!username || !token) {
        throw new Error('Beanstalk username and token are required')
    }
    const { accountName, repositoryName, filepath } = parseUrl(url)
    const apiUrl = `https://${ accountName }.beanstalkapp.com/api`
    const authStr = `${ username }:${ token }`
    const encodedAuthStr = new Buffer(authStr).toString('base64')
    axios
        .get(`${ apiUrl }/repositories/${ repositoryName }/node.json?path=${ filepath }`, {
            params: {
                contents: true
            },
            headers: {
                Authorization: `Basic ${ encodedAuthStr }`
            }
        })
        .then(res => cb(null, getContentWithAttachements(res)))
        .catch(err => cb(err, null))
}
