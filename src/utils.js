import crc from 'easy-crc32'
import axios from 'axios'

export function getSanitizedPath(path) {
    return path
        .replace(/^\//, '')
        .replace(/\/$/, '')
}
export function getLocCrc(filepath, line) {
    return crc.calculate(getSanitizedPath(filepath)) + crc.calculate(`${ line }`)
}

export function getAccountName(url) {
    return url
        .replace(/<?https?:\/\//, '')
        .replace(/\.beanstalkapp\.com(.+)/, '')
}

export function getRepositoryName(url) {
    const re = new RegExp(/beanstalkapp\.com\/([\w-_]+)\/browse\/git\/(.+)#L(\d+)/ig)
    return re.exec(url)[1]
}

export function getFilePath(url) {
    const re = new RegExp(/beanstalkapp\.com\/([\w-_]+)\/browse\/git\/(.+)#L(\d+)/ig)
    return re.exec(url)[2]
}

export function getContentWithAttachements(response) {
    const { path, name, contents, revision, repository } = response.data
    return {
        username: 'My bot',
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
            mrkdwn_in: ['text'],
            color: repository.color_label
        }]
    }
}

export function getFileContents(url, options, cb) {
    const { username, token } = options
    if (!username || !token) {
        throw new Error('Beanstalk username and token are required')
    }
    const accountName = getAccountName(url)
    const repositoryName = getRepositoryName(url)
    const filepath = getFilePath(url)
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
