import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

import PointCloudConverter from './pointCloudConverter.js';
import EnsembleConverter from './ensembleConverter.js';
import { describeErrorAndBail } from './utils.js';

const read = promisify(fs.readFile);
const write = promisify(fs.writeFile);

const ingestData =  async options => {

    const { output, pointCloud, ensemble, directory } = options;

    let string = '';
    if (pointCloud) {

        try {
            string = await read(pointCloud, 'utf8');

        } catch (e) {
            describeErrorAndBail(e);
        }

    } else if (ensemble) {

        try {
            string = await read(ensemble, 'utf8');
        } catch (e) {
            describeErrorAndBail(e);
        }

    }

    let converter;
    let result;
    if (pointCloud) {
        converter = new PointCloudConverter(pointCloud);
        try {
            result = converter.convert(string);
        } catch (e) {
            describeErrorAndBail(e);
        }

    } else {
        converter = new EnsembleConverter(ensemble);
        try {
            result = converter.convert({ path: ensemble, string });
        } catch (e) {
            describeErrorAndBail(e);
        }
    }

    // let targetDirectory = process.cwd();
    const targetPath = path.join(directory, output);

    try {
        await write(targetPath, result);
    } catch (e) {
        describeErrorAndBail(e);
    }

    const filename = false === pointCloud ? ensemble : pointCloud ;
    const str = `${ filename } successfully converted to ${ targetPath }`;
    console.log('%s', chalk.green.bold(str));

    return true;
};

export { ingestData }
