"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prog = require("caporal");
const commands_1 = require("./commands");
const pkg = require("../package.json");
function cli() {
    prog
        .version(pkg.version)
        .command('run', 'Launch the docker image (into an emulated session if image specified)')
        .argument('[image]', 'The raspbian image or empty to run docker')
        .option('--command, -c', 'The command run in raspbian emulator')
        .option('--vmnt, -v', 'The directory bind to emulator /vmnt')
        .action(commands_1.run);
    prog.parse(process.argv);
}
exports.cli = cli;
//# sourceMappingURL=cli.js.map