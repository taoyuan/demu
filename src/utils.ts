import * as _ from "lodash";
import * as arrify from "arrify";
import * as inflection from "inflection";
import * as child from "child-process-promise";
import chalk from "chalk";

export function argumentize(args: { [key: string]: string | boolean | any[] }, sign?: boolean) {
	const answer: string[] = [];
	_.forEach(args, (value: string | string[] | boolean, key: string) => {
		if (!key) return;
		if (value === false) return;
		answer.push(...argify(key, value, sign));
	});
	return answer;
}

function argify(key: string, value: string | boolean | any[], sign?: boolean): string[] {
	const answer: string[] = [];

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

export async function spawn(command: string, options?: {[name: string]: any});
export async function spawn(command: string, args?: any[], options?: {[name: string]: any});
export async function spawn(command: string, args?: any[] | {[name: string]: any}, options?: {[name: string]: any}) {
	if (!Array.isArray(args)) {
		options = args;
		args = [];
	}
	args = args || [];
	options = Object.assign({shell: true}, options);

	const {silent, capture} = options;
	if (capture) {
		options.capture = ['stdout', 'stderr'];
	}

	if (!silent) {
		console.log(chalk.magenta.bold('==>'), chalk.green([command, ...<any[]>args].join(' ')));
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

