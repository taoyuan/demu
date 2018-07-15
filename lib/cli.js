"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const program = require("caporal");
const commands_1 = require("./commands");
const pkg = require("../package.json");
function cli() {
    program
        .version(pkg.version);
    program.command('run', 'Launch the docker image (into an emulated session if image specified)')
        .option('--image, -i', 'The raspbian image or empty to run docker')
        .option('--command, -c', 'The command run in raspbian emulator')
        .option('--vmnt, -v', 'The directory bind to emulator /vmnt')
        .action(commands_1.run);
    program.command('setup', 'Run setup script in docker emulated session')
        .option('--image, -i <image>', 'The raspbian image or empty to run docker')
        .action(commands_1.setup);
    program.parse(process.argv);
}
exports.cli = cli;
//# sourceMappingURL=cli.js.map