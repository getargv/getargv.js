import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { makeChild, expectedArgs, pid, toBuffer, fromBuffer, expectedString, expectedArray, appendBuffers } from "./helper.js";
import Getargv from "../dist/binding.js";

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
        assert.throws(_ => Getargv.as_string(pid), {
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
        assert.throws(_ => Getargv.as_string(pid, 'a'), {
            name: 'RangeError',
            message: 'The "a" encoding is not supported',
        })
    );

    it('Throws if the arguments cannot be encoded as requested', c => {
        const child = makeChild(c.fullName);
        try {
            assert.throws(_ => Getargv.as_string(child.pid, "utf-16", undefined, undefined, { fatal: true }), {
                name: 'TypeError',
                message: "The encoded data was not valid for encoding utf-16le",
            });
        } finally {
            child.kill();
        }
    });

});

describe("Getargv.as_array errors", _ => {
    it('Requires the "pid" argument be specified', _ =>
        assert.throws(Getargv.as_array, {
            name: 'TypeError',
            message: 'The "pid" argument must be specified',
        })
    );

    it('Requires the "encoding" argument be specified', _ =>
        assert.throws(_ => Getargv.as_array(pid), {
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
        assert.throws(_ => Getargv.as_array(pid, 'a'), {
            name: 'RangeError',
            message: 'The "a" encoding is not supported',
        })
    );

    it('Throws if the arguments cannot be encoded as requested', c => {
        const child = makeChild(c.fullName);
        try {
            assert.throws(_ => Getargv.as_array(child.pid, "utf-16", { fatal: true }), {
                name: 'TypeError',
                message: "The encoded data was not valid for encoding utf-16le",
            });
        } finally {
            child.kill();
        }
    });

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
        assert.throws(_ => Getargv.get_argv_of_pid(pid, 'a'), {
            name: 'TypeError',
            message: 'Invalid bool was passed as second argument',
        })
    );

    it('Requires the "skip" argument be a number', _ =>
        assert.throws(_ => Getargv.get_argv_of_pid(pid, false, 'a'), {
            name: 'TypeError',
            message: 'Invalid number was passed as third argument',
        })
    );

    it('Requires the "skip" argument be a positive number', _ =>
        assert.throws(_ => Getargv.get_argv_of_pid(pid, false, -1), {
            name: 'RangeError',
            message: 'Invalid number was passed as third argument, must be between 0 and (1024 * 1024)',
        })
    );

    it('Requires the "skip" argument be a number not greater than ARG_MAX', _ =>
        assert.throws(_ => Getargv.get_argv_of_pid(pid, false, Getargv.ARG_MAX + 1), {
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
        assert.throws(_ => Getargv.get_argv_and_argc_of_pid(pid, 'a'), {
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
        const result = Getargv.get_argv_and_argc_of_pid(pid);
        const expected = expectedArgs();
        assert.deepStrictEqual(result, expected, "Unexpected value returned");
    });

    it('Getargv.get_argv_of_pid returns correct output', _ => {
        const result = Getargv.get_argv_of_pid(pid);
        const expected_string = expectedString();
        assert.strictEqual(fromBuffer(result), expected_string, "Unexpected string value returned");
        assert.deepStrictEqual(result, toBuffer(expected_string), "Unexpected ArrayBuffer value returned");//deep b/c it's an arraybuffer
    });

    it('Getargv.as_string returns correct utf8 output', _ => {
        const result = Getargv.as_string(pid, "utf-8");
        const expected = expectedString("utf-8");
        assert.equal(result, expected, "Unexpected value returned");
    });

    it('Getargv.as_array returns correct utf8 output', _ => {
        const result = Getargv.as_array(pid, "utf-8");
        const expected = expectedArray("utf-8");
        assert.deepEqual(result, expected, "Unexpected value returned");
    });

    it('Getargv.as_string returns correct utf16 output', c => {
        const child = makeChild(c.fullName, false);
        try {
            const result = Getargv.as_string(child.pid, "utf-16");
            const expected = fromBuffer(child.spawnargs.map(toBuffer).reduce(appendBuffers), "utf-16");
            assert.equal(result, expected, "Unexpected value returned");
        } finally {
            child.kill();
        }
    });

    it('Getargv.as_array returns correct utf16 output', _ => {
        const result = Getargv.as_array(pid, "utf-16");
        const expected = expectedArray("utf-16");
        assert.deepEqual(result, expected, "Unexpected value returned");
    });

});
