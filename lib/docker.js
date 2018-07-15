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
const utils_1 = require("./utils");
exports.DEFAULTS = {
    interactive: true,
    tty: true,
    rm: true,
    privileged: true,
    workdir: '/usr/rpi'
};
function inspect(image) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield utils_1.spawn('docker', ['inspect', image], { silent: true, capture: true });
        return JSON.parse(data);
    });
}
exports.inspect = inspect;
function build(dir, options) {
    return __awaiter(this, void 0, void 0, function* () {
        yield utils_1.spawn('docker', ['build', ...utils_1.argumentize(options), '.'], { cwd: dir });
    });
}
exports.build = build;
function pull(image) {
    return __awaiter(this, void 0, void 0, function* () {
        yield utils_1.spawn('docker', ['pull', image]);
    });
}
exports.pull = pull;
function ensureImage(image, path, options) {
    return __awaiter(this, void 0, void 0, function* () {
        path = path || process.cwd();
        options = options || {};
        try {
            yield inspect(image);
        }
        catch (e) {
            if (!options.pull) {
                return yield build(path, options);
            }
            try {
                yield pull(image);
            }
            catch (e) {
                return yield build(path, options);
            }
        }
    });
}
exports.ensureImage = ensureImage;
function run(image, cmd, argo, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        if (Array.isArray(cmd)) {
            cmd = cmd.join(' ');
        }
        return yield utils_1.spawn('docker', ['run', ...utils_1.argumentize(argo), image, cmd], opts);
    });
}
exports.run = run;
//# sourceMappingURL=docker.js.map