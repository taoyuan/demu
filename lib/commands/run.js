/**
 * Created by taoyuan on 2017/7/1.
 */

const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const docker = require('../docker');

const DOCKER_IMAGE = 'taoyuan/demu';

const DEFAULTS = {
	interactive: true,
	tty: true,
	rm: true,
	privileged: true,
	workdir: '/usr/rpi'
};

module.exports = async (args, options, logger) => {
	const {image} = args || {};
	const {command, vmnt} = options || {};

	const imageFile = path.resolve(image);
	const imageDir = path.dirname(imageFile);

	const cmd = ['/bin/bash'];
	if (image) {
		let childCmd = ['./run.sh', `images/${image}`];
		if (command) {
			childCmd.push(`'${command}'`);
		}
		cmd.push(...['-c', `"${childCmd.join(' ')}"`]);
	}

	const volume = [`${imageDir}:/usr/rpi/images`];
	if (vmnt && fs.existsSync(vmnt)) {
		volume.push(`${vmnt}:/vmnt`);
	}

	const argo = _.merge({}, DEFAULTS, {volume});

	const dir = path.resolve(__dirname, '..', '..', 'docker');
	await docker.ensureImage(DOCKER_IMAGE, dir, {t: DOCKER_IMAGE});
	await docker.run(DOCKER_IMAGE, cmd, argo, {stdio: 'inherit'});
};
