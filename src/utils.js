import crc from 'easy-crc32'

export function getSanitizedPath(path) {
    return path
        .replace(/^\//, '')
        .replace(/\/$/, '')
}
export function getLocCrc(filepath, line) {
    return crc.calculate(getSanitizedPath(filepath)) + crc.calculate(line)
}
