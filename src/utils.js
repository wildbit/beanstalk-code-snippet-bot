import crc from 'easy-crc32'

export function getLocCrc(filepath, line) {
    var sanitazedPath = filepath.replace(/\/(.+)\/$/, '$1')
    return crc.calculate(sanitazedPath) + crc.calculate(line)
}
