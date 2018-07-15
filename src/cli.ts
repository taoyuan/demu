/**
 * Created by taoyuan on 2017/6/30.
 */

import * as program from "caporal";
import {run, setup} from "./commands";

const pkg = require("../package.json");

export function cli() {
	program
		.version(pkg.version);


	program.command('run', 'Launch the docker image (into an emulated session if image specified)')
		.option('--image, -i', 'The raspbian image or empty to run docker')
		.option('--command, -c', 'The command run in raspbian emulator')
		.option('--vmnt, -v', 'The directory bind to emulator /vmnt')
		.action(run);

	program.command('setup', 'Run setup script in docker emulated session')
		.option('--image, -i <image>', 'The raspbian image or empty to run docker')
		.action(setup);

	program.parse(process.argv);

}

