import { describe, it } from 'node:test';
import Getargv from "../dist/binding.js";
import process from "process";
import assert from 'node:assert/strict';

const [major, _minor, _patch] = process.versions.node.split('.').map(Number);

const removePrefix = (value, prefix) => value.startsWith(prefix) ? value.slice(prefix.length) : value;

function fixupPerNodeVersion(input) {
    if (major && major <= 20) return input;
    return removePrefix(input, process.cwd()+"/");
}

function expected_args() {
    const enc = new TextEncoder();
    return [process.argv0, ...process.execArgv, ...process.argv.slice(1)].map(a =>
        enc.encode(fixupPerNodeVersion(a) + "\0").buffer
    );
};

describe("Testing constants", _ => {

    it('Exports something', _ =>
        assert(Getargv, "The export is undefined")
    );

    it('Exports PID_MAX constant', _ =>
        assert('PID_MAX' in Getargv)
    );

    it('PID_MAX constant is correct', _ =>
        assert.equal(Getargv.PID_MAX, 99999)
    );

    it('exports ARG_MAX constant', _ =>
        assert('ARG_MAX' in Getargv)
    );

    it('ARG_MAX is correct', _ =>
        assert.equal(Getargv.ARG_MAX, 1024 * 1024)
    );

});

describe("Getargv.as_string errors", _ => {

    it('Requires the "pid" argument be specified', _ =>
        assert.throws(Getargv.as_string, {
            name: 'TypeError',
            message: 'The "pid" argument must be specified',
        })
    );

    it('Requires the "encoding" argument be specified', _ =>
        assert.throws(_ => Getargv.as_string(process.pid), {
            name: 'TypeError',
            message: 'The "encoding" argument must be specified',
        })
    );

    it('Requires the "pid" argument be a number', _ =>
        assert.throws(_ => Getargv.as_string('a', 'utf-8'), {
            name: 'TypeError',
            message: 'The "pid" argument must be a number',
        })
    );

    it('Requires the "encoding" argument be valid', _ =>
        assert.throws(_ => Getargv.as_string(process.pid, 'a'), {
            name: 'RangeError',
            message: 'The "a" encoding is not supported',
        })
    );

    it('Throws if the arguments cannot be encoded as requested', _ =>
        assert.throws(_ => Getargv.as_string(process.pid, "utf-16", undefined, undefined, { fatal: true }), {
            name: 'TypeError',
            message: "The encoded data was not valid for encoding utf-16le",
        })
    );

});

describe("Getargv.as_array errors", _ => {
    it('Requires the "pid" argument be specified', _ =>
        assert.throws(Getargv.as_array, {
            name: 'TypeError',
            message: 'The "pid" argument must be specified',
        })
    );

    it('Requires the "encoding" argument be specified', _ =>
        assert.throws(_ => Getargv.as_array(process.pid), {
            name: 'TypeError',
            message: 'The "encoding" argument must be specified',
        })
    );

    it('Requires the "pid" argument be a number', _ =>
        assert.throws(_ => Getargv.as_array('a', 'utf-8'), {
            name: 'TypeError',
            message: 'The "pid" argument must be a number',
        })
    );

    it('Requires the "encoding" argument be valid', _ =>
        assert.throws(_ => Getargv.as_array(process.pid, 'a'), {
            name: 'RangeError',
            message: 'The "a" encoding is not supported',
        })
    );

    it('Throws if the arguments cannot be encoded as requested', _ =>
        assert.throws(_ => Getargv.as_array(process.pid, "utf-16", { fatal: true }), {
            name: 'TypeError',
            message: "The encoded data was not valid for encoding utf-16le",
        })
    );

});

describe("Getargv.get_argv_of_pid errors", _ => {
    it('Requires the "pid" argument be specified', _ =>
        assert.throws(Getargv.get_argv_of_pid, {
            name: 'TypeError',
            message: 'The "pid" argument must be specified',
        })
    );

    it('Requires the "pid" argument be a number', _ =>
        assert.throws(_ => Getargv.get_argv_of_pid('a'), {
            name: 'TypeError',
            message: 'Invalid number was passed as first argument',
        })
    );

    it('Requires the "pid" argument be a positive number', _ =>
        assert.throws(_ => Getargv.get_argv_of_pid(-1), {
            name: 'RangeError',
            message: 'Invalid PID was passed as first argument',
        })
    );

    it('Requires the "nulls" argument be a boolean', _ =>
        assert.throws(_ => Getargv.get_argv_of_pid(process.pid, 'a'), {
            name: 'TypeError',
            message: 'Invalid bool was passed as second argument',
        })
    );

    it('Requires the "skip" argument be a number', _ =>
        assert.throws(_ => Getargv.get_argv_of_pid(process.pid, false, 'a'), {
            name: 'TypeError',
            message: 'Invalid number was passed as third argument',
        })
    );

    it('Requires the "skip" argument be a positive number', _ =>
        assert.throws(_ => Getargv.get_argv_of_pid(process.pid, false, -1), {
            name: 'RangeError',
            message: 'Invalid number was passed as third argument, must be between 0 and (1024 * 1024)',
        })
    );

    it('Requires the "skip" argument be a number not greater than ARG_MAX', _ =>
        assert.throws(_ => Getargv.get_argv_of_pid(process.pid, false, Getargv.ARG_MAX + 1), {
            name: 'RangeError',
            message: 'Invalid number was passed as third argument, must be between 0 and (1024 * 1024)',
        })
    );
});

describe("Getargv.get_argv_and_argc_of_pid errors", _ => {
    it('Requires the "pid" argument be specified', _ =>
        assert.throws(Getargv.get_argv_and_argc_of_pid, {
            name: 'TypeError',
            message: 'The "pid" argument must be specified',
        })
    );

    it('Requires that extra arguments not be specified', _ =>
        assert.throws(_ => Getargv.get_argv_and_argc_of_pid(process.pid, 'a'), {
            name: 'TypeError',
            message: 'Too many arguments were provided, max: 1',
        })
    );

    it('Requires the "pid" argument be a positive number', _ =>
        assert.throws(_ => Getargv.get_argv_and_argc_of_pid(-1), {
            name: 'RangeError',
            message: 'Invalid PID was passed as first argument',
        })
    );

    it('Requires the "pid" argument be a number not greater than PID_MAX', _ =>
        assert.throws(_ => Getargv.get_argv_and_argc_of_pid(1 + Getargv.PID_MAX), {
            name: 'RangeError',
            message: 'Invalid PID was passed as first argument',
        })
    );
});

describe("Correct functionality", _ => {

    it('Getargv.get_argv_and_argc_of_pid returns correct output', _ => {
        const result = Getargv.get_argv_and_argc_of_pid(process.pid);
        const expected = expected_args();
        assert.deepStrictEqual(result, expected, "Unexpected value returned");
    });

    it('Getargv.get_argv_of_pid returns correct output', _ => {
        const enc = new TextEncoder();
        const dec = new TextDecoder();
        const result = Getargv.get_argv_of_pid(process.pid);
        const expected_string = expected_args().map(e => dec.decode(e)).join("");
        assert.strictEqual(dec.decode(result), expected_string, "Unexpected string value returned");
        assert.deepStrictEqual(result, enc.encode(expected_string).buffer, "Unexpected ArrayBuffer value returned");//deep b/c it's an arraybuffer
    });

    it('Getargv.as_string returns correct utf8 output', _ => {
        const dec = new TextDecoder();
        const result = Getargv.as_string(process.pid, "utf-8");
        const expected = expected_args().map(e => dec.decode(e)).join("");
        assert.equal(result, expected, "Unexpected value returned");
    });

    it('Getargv.as_array returns correct utf8 output', _ => {
        const dec = new TextDecoder();
        const result = Getargv.as_array(process.pid, "utf-8");
        const expected = expected_args().map(e => dec.decode(e));
        assert.deepEqual(result, expected, "Unexpected value returned");
    });

    it('Getargv.as_string returns correct utf16 output', _ => {
        const dec = new TextDecoder();
        const result = Getargv.as_string(process.pid, "utf-16");
        const expected = expected_args().map(e => dec.decode(e)).join("");
        assert.notEqual(result, expected, "Unexpected value returned");
    });

    it('Getargv.as_array returns correct utf16 output', _ => {
        const dec = new TextDecoder();
        const result = Getargv.as_array(process.pid, "utf-16");
        const expected = expected_args().map(e => dec.decode(e));
        assert.notDeepEqual(result, expected, "Unexpected value returned");
    });

});
