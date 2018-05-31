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
const _ = require("lodash");
const arrify = require("arrify");
const inflection = require("inflection");
const child = require("child-process-promise");
const chalk_1 = require("chalk");
function argumentize(args, sign) {
    const answer = [];
    _.forEach(args, (value, key) => {
        if (!key)
            return;
        if (value === false)
            return;
        answer.push(...argify(key, value, sign));
    });
    return answer;
}
exports.argumentize = argumentize;
function argify(key, value, sign) {
    const answer = [];
    _.forEach(arrify(value), v => {
        let k;
        if (key.length === 1) {
            k = '-' + key;
        }
        else {
            k = '--' + inflection.dasherize(inflection.underscore(key));
        }
        if (v === true) {
            v = null;
        }
        else if (/[ ]/.test(v)) {
            v = `"${v}"`;
        }
        if (sign) {
            answer.push(k + (v ? sign + v : ''));
        }
        else {
            answer.push(k);
            if (v)
                answer.push(v);
        }
    });
    return answer;
}
function spawn(command, args, options) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!Array.isArray(args)) {
            options = args;
            args = [];
        }
        args = args || [];
        options = Object.assign({ shell: true }, options);
        const { silent, capture } = options;
        if (capture) {
            options.capture = ['stdout', 'stderr'];
        }
        if (!silent) {
            console.log(chalk_1.default.magenta.bold('==>'), chalk_1.default.green([command, ...args].join(' ')));
            console.log(chalk_1.default.gray(`> ${options.cwd || process.cwd()}`));
        }
        const promise = child.spawn(command, args, options);
        const cp = promise.childProcess;
        cp.stdout && cp.stdout.on('data', data => !silent && process.stdout.write(data));
        cp.stderr && cp.stderr.on('data', data => !silent && process.stdout.write(chalk_1.default.red(data)));
        if (capture) {
            return promise.then(result => result.stdout, result => {
                throw new Error(result.stderr);
            });
        }
        return promise;
    });
}
exports.spawn = spawn;
//# sourceMappingURL=utils.js.map