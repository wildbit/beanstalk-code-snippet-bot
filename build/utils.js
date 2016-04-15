'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.getSanitizedPath = getSanitizedPath;
exports.getLocCrc = getLocCrc;
exports.parseUrl = parseUrl;
exports.withLineNumbers = withLineNumbers;
exports.getContentWithAttachements = getContentWithAttachements;
exports.getFileContents = getFileContents;

var _easyCrc = require('easy-crc32');

var _easyCrc2 = _interopRequireDefault(_easyCrc);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

var NAME = 'Beanstalk Code Snippet Bot';

function getSanitizedPath(path) {
    return path.replace(/^\//, '').replace(/\/$/, '');
}
function getLocCrc(filepath, line) {
    return _easyCrc2.default.calculate(getSanitizedPath(filepath)) + _easyCrc2.default.calculate('' + line);
}

function parseUrl(url) {
    var re = new RegExp(/([\w-_]+)\.beanstalkapp\.com\/([\w-_]+)\/browse\/git\/([\w-_/.]+)(\?ref=c-(\w+))?(#L(\d+))?/g); // eslint-disable-line
    var matches = re.exec(url);
    if (matches) {
        var _matches = _toArray(matches);

        var accountName = _matches[1];
        var repositoryName = _matches[2];
        var filepath = _matches[3];

        var rest = _matches.slice(4);

        var _rest = _slicedToArray(rest, 4);

        var revision = _rest[1];
        var locHash = _rest[3];

        return {
            accountName: accountName,
            repositoryName: repositoryName,
            filepath: filepath,
            locHash: locHash,
            revision: revision
        };
    }
    return null;
}

function withLineNumbers(content) {
    var lines = content.split('\n');
    var padding = ('' + lines.length).length;
    return lines.map(function (line, idx) {
        return (0, _lodash.padStart)(idx + 1, padding, '0') + '. ' + line;
    }).join('\n');
}

function getContentWithAttachements(response) {
    var _response$data = response.data;
    var path = _response$data.path;
    var name = _response$data.name;
    var contents = _response$data.contents;
    var revision = _response$data.revision;
    var repository = _response$data.repository;

    return {
        username: NAME,
        attachments: [{
            fallback: path,
            title: name,
            text: '```' + withLineNumbers(contents) + '\n```',
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
    };
}

function getFileContents(url, options, cb) {
    var username = options.username;
    var token = options.token;

    if (!username || !token) {
        throw new Error('Beanstalk username and token are required');
    }

    var _parseUrl = parseUrl(url);

    var accountName = _parseUrl.accountName;
    var repositoryName = _parseUrl.repositoryName;
    var filepath = _parseUrl.filepath;
    var revision = _parseUrl.revision;

    var apiUrl = 'https://' + accountName + '.beanstalkapp.com/api';
    var authStr = username + ':' + token;
    var encodedAuthStr = new Buffer(authStr).toString('base64');
    _axios2.default.get(apiUrl + '/repositories/' + repositoryName + '/node.json', {
        params: {
            path: filepath,
            revision: revision,
            contents: true
        },
        headers: {
            Authorization: 'Basic ' + encodedAuthStr
        }
    }).then(function (res) {
        return cb(null, getContentWithAttachements(res));
    }).catch(function (err) {
        return cb(err, null);
    });
}