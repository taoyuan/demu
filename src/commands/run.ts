/**
 * Created by taoyuan on 2017/7/1.
 */

import * as path from "path";
import * as fs from "fs";
const docker = require('../docker');

const DOCKER_IMAGE = 'taoyuan/demu';

export interface RunOptions {
	image: string;
	command: string;
	vmnt: string;
}

export async function run(args, options: RunOptions, logger?) {
	const {command, vmnt, image} = options || <RunOptions>{};

	const cmd: string[] = ['/bin/bash'];
	const volume: string[] = [];
	if (image) {
		const imageFile = path.resolve(image);
		const imageName = path.basename(imageFile);
		const imageDir = path.dirname(imageFile);
		let childCmd = ['./run.sh', `images/${imageName}`];
		if (command) {
			childCmd.push(`'${command}'`);
		}
		cmd.push(...['-c', `"${childCmd.join(' ')}"`]);
		volume.push(`${imageDir}:/usr/rpi/images`);
	}

	if (vmnt && fs.existsSync(vmnt)) {
		volume.push(`${path.resolve(vmnt)}:/vmnt`);
	}

	const argo = Object.assign({}, docker.DEFAULTS, {volume});

	const dir = path.resolve(__dirname, '..', '..', 'docker');
	await docker.ensureImage(DOCKER_IMAGE, dir, {t: DOCKER_IMAGE});
	await docker.run(DOCKER_IMAGE, cmd, argo, {stdio: 'inherit'});
}
