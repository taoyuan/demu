const {argumentize, spawn} = require('./utils');

async function inspect(image) {
	const data = await spawn('docker', ['inspect', image], {silent: true, capture: true});
	return JSON.parse(data);
}

async function build(dir, options) {
	await spawn('docker', ['build', ...argumentize(options), '.'], {cwd: dir});
}

async function pull(image) {
	await spawn('docker', ['pull', image]);
}

async function ensureImage(image, path, options) {
	path = path || process.cwd();
	options = options || {};
	try {
		await inspect(image);
	} catch (e) {
		if (!options.pull) {
			return await build(path, options);
		}
		try {
			await pull(image);
		} catch (e) {
			return await build(path, options);
		}
	}
}

async function run(image, cmd, argo, opts) {
	if (Array.isArray(cmd)) {
		cmd = cmd.join(' ');
	}

	return await spawn('docker', ['run', ...argumentize(argo), image, cmd], opts);
}

module.exports = {
	inspect,
	build,
	pull,
	ensureImage,
	run,
};
