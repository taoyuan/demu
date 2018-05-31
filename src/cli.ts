/**
 * Created by taoyuan on 2017/6/30.
 */

import * as prog from "caporal";
import {run} from "./commands";

const pkg = require("../package.json");

export function cli() {
	prog
		.version(pkg.version)
		.command('run', 'Launch the docker image (into an emulated session if image specified)')
		.argument('[image]', 'The raspbian image or empty to run docker')
		.option('--command, -c', 'The command run in raspbian emulator')
		.option('--vmnt, -v', 'The directory bind to emulator /vmnt')
		.action(run);

	prog.parse(process.argv);

}

