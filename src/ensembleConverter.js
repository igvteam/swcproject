import { numberFormatter } from "./utils.js";
class EnsembleConverter {

    constructor () {}

    convert({ path, chromosome, genome, sample, string }){

        const stepSize = 3e4;
        const { cell, chr, genomicStart, genomicEnd } = parsePathEncodedGenomicLocation(path);

        let raw = string.split(/\r?\n/);

        // discard blurb
        raw.shift();

        // discard column titles
        raw.shift();

        // discard blank lines
        const lines = raw.filter(rawLine => "" !== rawLine);
        raw = null;

        console.time(`convert ensemble with ${ lines.length } traces`);

        // build scratch dictionary
        let dictionary = {};
        let startBP;
        let endBP;
        for (let line of lines) {

            const tokens = line.split(',');

            // chr-index (1-based) | segment-index (1-based) | Z | X | Y
            let [ chromosomeID, segmentIDString, z, x, y ] = [ tokens[ 0 ], tokens[ 1 ], tokens[ 2 ], tokens[ 3 ], tokens[ 4 ] ];

            // The chromosome id is 1-based. We use it for a key but make it 0-based.
            let number = parseInt(chromosomeID, 10) - 1;
            let key = number.toString();

            if (undefined === dictionary[ key ]) {
                dictionary[ key ] = [];
                startBP = genomicStart;
            }

            endBP = startBP + stepSize;

            if ('nan' === x || 'nan' === y || 'nan' === z) {
                dictionary[ key ].push({ startBP, endBP, x: 'nan', y: 'nan', z: 'nan' })
            } else {
                dictionary[ key ].push({ startBP, endBP, x, y, z })
            }

            startBP = endBP;
        }

        let output = [];
        output.push(`# Conversion of ensemble file ${ path }`);
        output.push(`${ sample }`);
        output.push(`${ genome }`);
        output.push(`bed ${ chromosome }`);

        let keys = Object.keys(dictionary);
        for (let key of keys) {

            output.push(`trace ${ keys.indexOf(key)}`);
            const trace = dictionary[ key ];

            for (let row of trace) {
                const { startBP, endBP, x, y, z } = row;
                output.push(`${ startBP } ${ endBP } ${ x } ${ y } ${ z }`)
            }

        }

        console.timeEnd(`convert ensemble with ${ lines.length } traces`);

        return output.join('\n');
    }

}

const parsePathEncodedGenomicLocation = path => {

    // Example. path = HCT116_chr21-34-37Mb_auxin_cellDiv.csv


    let filename = path.split('/').pop();
    let dev_null;

    // HCT116 | chr21-34-37Mb | auxin | cellDiv.csv
    let parts = filename.split('_');
    if (parts.length < 2) {
        throw new Error(`Invalid ensemble file ${ path }`);
    }

    // HCT116
    const cell = parts.shift();

    // HCT116 | chr21-34-37Mb | auxin | cellDiv.csv
    let locus = parts[ 0 ];

    let locusParts = locus.split('-');

    if (locusParts.length !== 3) {
        throw new Error(`Invalid ensemble file ${ path }`);
    }

    // chr21 34 37Mb
    let [ chr, start, end ] = locusParts;

    if (undefined === chr || undefined === start || undefined === end) {
        throw new Error(`Invalid ensemble file ${ path }`);
    }

    // 3 0 M b
    dev_null = end.split('');

    // 3 0 M
    dev_null.pop();

    // 3 0
    dev_null.pop();

    // 30
    end = dev_null.join('');

    return { cell, chr, genomicStart: 1e6 * parseInt(start), genomicEnd: 1e6 * parseInt(end) };
};

export default EnsembleConverter;
