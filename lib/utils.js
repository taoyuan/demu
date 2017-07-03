const _ = require('lodash');
const arrify = require('arrify');
const chalk = require('chalk');
const inflection = require('inflection');
const child = require('child-process-promise');

function argumentize(args, sign) {
	const answer = [];
	_.forEach(args, (value, key) => {
		if (!key) return;
		if (value !== false) {
			answer.push(...argify(key, value, sign));
		}
	});
	return answer;
}

function argify(key, value, sign) {
	const answer = [];
	_.forEach(arrify(value), v => {
		let k;
		if (key.length === 1) {
			k = '-' + key;
		} else {
			k = '--' + inflection.dasherize(inflection.underscore(key));
		}
		if (v === true) { // this is an option. do not need a value.
			v = null;
		} else if (/[ ]/.test(v)) {
			v = `"${v}"`;
		}

		if (sign) {
			answer.push(k + (v ? sign + v : ''));
		} else {
			answer.push(k);
			if (v) answer.push(v);
		}
	});

	return answer;
}


// function exec(command, options) {
// 	command = Array.isArray(command) ? command.join(' ') : command;
// 	options = options || {};
//
// 	console.log(chalk.magenta.bold('==>'), chalk.green(command));
// 	console.log(chalk.gray(`> ${options.cwd || process.cwd()}`));
//
// 	options = Object.assign({}, options, {async: true});
// 	let child = null;
// 	const promise = new Promise((resolve, reject) => {
// 		child = sh.exec(command, options, (code, stdout, stderr) => code ? reject(new Error(stderr)) : resolve(stdout));
// 	});
// 	child.then = function (onFulfilled, onRejected) {
// 		return promise.then(...arguments);
// 	};
// 	child.catch = function (onRejected) {
// 		return promise.catch(...arguments);
// 	};
// 	return child;
// }

// async function exec(command, args, options) {
// 	if (!Array.isArray(args)) {
// 		options = args;
// 		args = null;
// 	}
// 	args = args || [];
// 	options = options || {};
//
// 	const {silent} = options;
//
// 	if (!silent) {
// 		console.log(chalk.magenta.bold('==>'), chalk.green([command, ...args].join(' ')));
// 		console.log(chalk.gray(`> ${options.cwd || process.cwd()}`));
// 	}
//
// 	return await child.exec([command, ...args].join(' '), options).then(result => result.stdout, result => {
// 		throw new Error(result.stderr);
// 	});
// }
//

async function spawn(command, args, options) {
	if (!Array.isArray(args)) {
		options = args;
		args = null;
	}
	args = args || [];
	options = Object.assign({shell: true}, options);

	const {silent, capture} = options;
	if (capture) {
		options.capture = ['stdout', 'stderr'];
	}

	if (!silent) {
		console.log(chalk.magenta.bold('==>'), chalk.green([command, ...args].join(' ')));
		console.log(chalk.gray(`> ${options.cwd || process.cwd()}`));
	}

	const promise = child.spawn(command, args, options);
	const cp = promise.childProcess;
	cp.stdout && cp.stdout.on('data', data => !silent && process.stdout.write(data));
	cp.stderr && cp.stderr.on('data', data => !silent && process.stdout.write(chalk.red(data)));
	if (capture) {
		return promise.then(result => result.stdout, result => {
			throw new Error(result.stderr);
		})
	}
	return promise;
}


// function perform(command, options) {
// 	options = options || {};
// 	console.log(chalk.magenta.bold('==>'), chalk.green(Array.isArray(command) ? command.join(' ') : command));
// 	console.log(chalk.gray(`> ${options.cwd || process.cwd()}`));
//
// 	return sh.cmd(...command, options);
// }

module.exports = {
	argumentize,
	spawn
};
