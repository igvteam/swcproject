class PointCloudConverter {

    constructor () {}

    convert({ path, chr, genome, name, string }) {

        let raw = string.split(/\r?\n/);

        // discard blank lines
        let lines = raw.filter(line => "" !== line);

        // discard initial on-liner
        lines.shift();

        console.time(`convertion of point-cloud file ${ path } with ${ lines.length } points`);

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
        output.push(`##format=sw1 name=${ name } genome=${ genome }`);

        let column_headings = [];
        column_headings.push('chromosome');
        column_headings.push('start');
        column_headings.push('end');
        column_headings.push('x');
        column_headings.push('y');
        column_headings.push('z');

        output.push(column_headings.join('\t'));

        let keys = Object.keys(hash);
        for (let key of keys) {

            output.push(`trace ${ keys.indexOf(key)}`);
            const trace = hash[ key ];

            for (let row of trace) {
                const { startBP, endBP, x, y, z } = row;
                output.push(`${ chr } ${ startBP } ${ endBP } ${ x } ${ y } ${ z }`)
            }

        }

        console.timeEnd(`convertion of point-cloud file ${ path } with ${ lines.length } points`);

        return output.join('\n');

    }

}

export default PointCloudConverter;
