import type { TextEncoding, TextDecoderOptions, GetArgv } from './types';

// Node 23+ can experimentally import native .node modules with NODE_OPTIONS=--experimental-addon-modules
// import native_addon from '../build/Release/getargv_native.node';
// const addon: GetArgv = native_addon;

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const addon: GetArgv = require('../build/Release/getargv_native.node');

type ArgKinds = Parameters<GetArgv['as_string']> | Parameters<GetArgv['as_array']>;

function validate_args<This, Args extends ArgKinds, Return>(target: (this: This, ...args: Args) => Return) {
  return function(this: This, ...args: Args): Return {
    if (arguments.length == 0) throw new TypeError('The "pid" argument must be specified');
    if (arguments.length == 1) throw new TypeError('The "encoding" argument must be specified');
    const [ pid, encoding ] = arguments;
    if (typeof pid !== "number") { throw new TypeError('The "pid" argument must be a number') }
    if (typeof encoding !== "string") { throw new TypeError(`The "encoding" argument must be a string, is a: ${typeof encoding}`) }
    return target.apply(this, args);
  }
}

addon.as_string = validate_args(function (pid: number, encoding: TextEncoding, nuls: boolean = false, skip: number = 0, options?: TextDecoderOptions): string {
  const decoder = new TextDecoder(encoding, options);
  const array = addon.get_argv_of_pid(pid, nuls, skip);
  return decoder.decode(array);
});

addon.as_array = validate_args(function (pid: number, encoding: TextEncoding, options?: TextDecoderOptions): Array<string> {
  const decoder = new TextDecoder(encoding, options);
  const array = addon.get_argv_and_argc_of_pid(pid);
  return array.map(b => decoder.decode(b));
});

export const PID_MAX = addon.PID_MAX;
export const ARG_MAX = addon.ARG_MAX;
export const get_argv_of_pid = addon.get_argv_of_pid;
export const as_string = addon.as_string;
export const get_argv_and_argc_of_pid = addon.get_argv_and_argc_of_pid;
export const as_array = addon.as_array;

export default addon;
