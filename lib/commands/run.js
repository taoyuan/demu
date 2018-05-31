"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const _ = require("lodash");
const docker = require('../docker');
const DOCKER_IMAGE = 'taoyuan/demu';
const DEFAULTS = {
    interactive: true,
    tty: true,
    rm: true,
    privileged: true,
    workdir: '/usr/rpi'
};
function run(args, options, logger) {
    return __awaiter(this, void 0, void 0, function* () {
        const { image } = args || {};
        const { command, vmnt } = options || {};
        const cmd = ['/bin/bash'];
        const volume = [];
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
        const argo = _.merge({}, DEFAULTS, { volume });
        const dir = path.resolve(__dirname, '..', '..', 'docker');
        yield docker.ensureImage(DOCKER_IMAGE, dir, { t: DOCKER_IMAGE });
        yield docker.run(DOCKER_IMAGE, cmd, argo, { stdio: 'inherit' });
    });
}
exports.run = run;
//# sourceMappingURL=run.js.map