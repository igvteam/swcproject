import chalk from 'chalk';

const describeError = e => {
    const { name, message } = e;
    const str = `${ name } : ${ message }`;
    console.error('%s', chalk.red.bold(str));
};

const describeErrorAndBail = e => {
    const { name, message } = e;
    const str = `${ name } : ${ message }`;
    console.error('%s', chalk.red.bold(str));
    process.exit(1);
};

let numberFormatter = (rawNumber) => {

    const [ dec, sep, decsep ] = [ String(rawNumber).split(/[.,]/), ',', '.' ];

    return dec[ 0 ]
        .split('')
        .reverse()
        .reduce((accumulator, value, index) => {
            return 0 === index % 3 ? accumulator + sep + value : accumulator + value;
        })
        .split('')
        .reverse()
        .join('') + (dec[1] ? decsep + dec[1] : '');
};

export { numberFormatter, describeError, describeErrorAndBail };
