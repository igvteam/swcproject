import arg from 'arg';
import { ingestData } from "./main.js";
import { describeError, describeErrorAndBail } from './utils.js';

const parse = rawArgv => {

	const spec =
		{
			'--pointcloud': String,
			'--ensemble': String,
			'--output' : String,
			'--directory' : String,

			// Aliases
			'-p': '--pointcloud',
			'-e': '--ensemble',
			'-o': '--output',
			'-d': '--dir'
		};


	const argv = rawArgv.slice(2);
	const rawArgvSet = new Set(argv);

	// handle asking for help
	if (0 === argv.length || rawArgvSet.has('-h') || rawArgvSet.has('--help')) {
		usage();
	}

	let args;

	try {
		args = arg(spec, { argv });
	} catch (e) {
		describeError(e);
		usage();
	}

	const result =
		{
			pointCloud: args[ '--pointcloud' ] || false,
			ensemble: args[ '--ensemble'   ] || false,
			output: args[ '--output'      ] || false,
			directory: args[ '--dir'      ] || false
		};

	let { pointCloud, ensemble, output, directory } = result;

	result.directory = false === directory ? process.cwd() : directory;

	let error = undefined;

	if (false === output) {
		error = new Error('Output filename (foo.sw) is required.');
	} else if (pointCloud && ensemble) {
		error = new Error('Must specify point-cloud OR ensemble file. Not both.');
	} else if (pointCloud && false === ensemble) {
		// do nothing
	} else if (false === pointCloud && ensemble) {
		// do nothing
	}

	if (error) {
		throw error;
	}

	return result;

};

const cli = async args => {

	let result;

	try {
		result = parse(args);
	} catch (e) {
		describeError(e);
		usage();
	}

	try {
		await ingestData(result);
	} catch (e) {
		describeError(e);
		usage();
	}

};

const usage = () => {

	let usage_message = [];

	usage_message.push('Usage:');
	usage_message.push('');
	usage_message.push('Pointcloud File');
	usage_message.push('swc --pointcloud filename --output filename [--dir output-directory]');
	usage_message.push('or');
	usage_message.push('swc -p filename -o filename [-d output-directory]');
	usage_message.push('');
	usage_message.push('Ensemble File');
	usage_message.push('swc --ensemble filename --output filename [--dir output-directory]');
	usage_message.push('or');
	usage_message.push('swc -e filename -o filename [-d output-directory]');

	usage_message.push('');
	usage_message.push('Example Point Cloud File (https://www.dropbox.com/s/lt9fyrhry8lbdqi/2017-08-03-19-34-25_Location-01.csv?dl=0)');
	usage_message.push('snippet ...');
	usage_message.push('genome_start,genome_end,size_kb,x,y,z');
	usage_message.push('7400000,8680000,1280,11233.5,6388.48,682.982');
	usage_message.push('7400000,8680000,1280,10894.7,6438.6,735.657');
	usage_message.push('7400000,8680000,1280,11195.4,6304.68,836.743');
	usage_message.push('...');
	usage_message.push('');

	usage_message.push('Example Ensemble File (https://www.dropbox.com/s/ycbj30umsu0y809/IMR90_chr21-18-20Mb.csv?dl=0)');
	usage_message.push('snippet ...');
	usage_message.push('The center positions (in nm) in each chromosome of the 30kb segments comprising region chr21:34.6Mb-37.1Mb in HCT116 cells after cell division in auxin treatment (EdU+ and Geminin-)');
	usage_message.push('Chromosome index,Segment index,Z,X,Y');
	usage_message.push('1,1,7289,76301,99573');
	usage_message.push('1,2,6939,76531,99485');
	usage_message.push('1,3,7361,76513,99361');
	usage_message.push('...');
	usage_message.push('');

	console.log( usage_message.join('\n') );

	process.exit(0);
};

export { cli }
