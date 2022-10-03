class PointCloudConverter {

    constructor () {}

    convert({ path, chr, genome, name, string }) {

        let raw = string.split(/\r?\n/)

        // discard blank lines
        let lines = raw.filter(line => "" !== line)

        // discard initial on-liner
        lines.shift()

        console.time(`convertion of point-cloud file ${ path } with ${ lines.length } points`)

        const output = []
        output.push(`##format=sw1 name=${ name } genome=${ genome }`)

        const column_headings = []
        column_headings.push('chromosome', 'start', 'end', 'x', 'y', 'z')
        output.push(column_headings.join('\t'))

        // Assume the file is a single pointcloud trace
        // TODO: How to handle ensemble of pointcloud traces
        output.push(`trace 0`)

        for (const line of lines) {
            const [ startBP, endBP, sizeKB, x, y, z ] = line.split(',')
            output.push(`${ chr } ${ startBP } ${ endBP } ${ x } ${ y } ${ z }`)
        }

        console.timeEnd(`convertion of point-cloud file ${ path } with ${ lines.length } points`)

        return output.join('\n')

    }

}

export default PointCloudConverter;
