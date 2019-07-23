class PointCloudConverter {

    constructor (filename) {
        this.filename = filename;
    }

    convert(string) {

        let raw = string.split(/\r?\n/);

        // discard blank lines
        let lines = raw.filter(line => "" !== line);

        // discard initial on-liner
        lines.shift();

        console.time(`convert point-cloud file with ${ lines.length } points`);

        let segments = {};

        let trace;
        let hash = {};
        for (let line of lines) {

            const tokens = line.split(',');
            const [ startBP, endBP, sizeKB, x, y, z ] = [ tokens[ 0 ], tokens[ 1 ], tokens[ 2 ], tokens[ 3 ], tokens[ 4 ], tokens[ 5 ] ];

            const key = `${ startBP }%${ endBP }%${ sizeKB }`;
            if (undefined === hash[ key ]) {
                hash[ key ] = [];
            }

            hash[ key ].push({ startBP, endBP, x, y, z });

        }

        let output = [];
        output.push(`# Conversion of point cloud file ${ this.filename }`);
        output.push('cell line');
        output.push('genome assembly');
        output.push(`bed chr19`);

        let keys = Object.keys(hash);
        for (let key of keys) {

            output.push(`trace ${ keys.indexOf(key)}`);
            const trace = hash[ key ];

            for (let row of trace) {
                const { startBP, endBP, x, y, z } = row;
                output.push(`${ startBP } ${ endBP } ${ x } ${ y } ${ z }`)
            }

        }

        console.timeEnd(`convert point-cloud file with ${ lines.length } points`);

        return output.join('\n');

    }

}

export default PointCloudConverter;
