import * as path from "path";
const docker = require('../docker');

const DOCKER_IMAGE = 'taoyuan/demu';

export interface SetupOptions {
	image: string;
}

export async function setup(args, options: SetupOptions, logger) {
	const {image} = options;

	const cmd: string[] = ['/bin/bash'];
	const volume: string[] = [];
	const imageFile = path.resolve(image);
	const imageName = path.basename(imageFile);
	const imageDir = path.dirname(imageFile);
	let subcmd = ['./run.sh', `images/${imageName}`, `'/bin/bash /vmnt/setup.sh'`];

	cmd.push(...['-c', `"${subcmd.join(' ')}"`]);
	volume.push(`${imageDir}:/usr/rpi/images`);
	volume.push(`${path.resolve(__dirname, '../../scripts')}:/vmnt`);

	const argo = Object.assign({}, docker.DEFAULTS, {volume});

	const dir = path.resolve(__dirname, '..', '..', 'docker');
	await docker.ensureImage(DOCKER_IMAGE, dir, {t: DOCKER_IMAGE});
	await docker.run(DOCKER_IMAGE, cmd, argo, {stdio: 'inherit'});
}
