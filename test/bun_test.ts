import { describe, test as it, expect } from 'bun:test';
import Getargv from "../dist/binding";
import { makeChild, expectedArgs, pid, toBuffer, fromBuffer, expectedString, expectedArray, appendBuffers } from "./helper.js";

describe("Testing constants", () => {

  it('Exports something', () =>
    expect(Getargv).toBeDefined()
  );

  it('Exports PID_MAX constant', () =>
    expect(Getargv).toHaveProperty('PID_MAX')
  );

  it('PID_MAX constant is correct', () =>
    expect(Getargv.PID_MAX).toBe(99999)
  );

  it('exports ARG_MAX constant', () =>
    expect(Getargv).toHaveProperty('ARG_MAX')
  );

  it('ARG_MAX is correct', () =>
    expect(Getargv.ARG_MAX).toBe(1024 * 1024)
  );

});

describe("Getargv.as_string errors", () => {

  it('Requires the "pid" argument be specified', () =>
    expect(Getargv.as_string).toThrow({
      name: 'TypeError',
      message: 'The "pid" argument must be specified',
    })
  );

  it('Requires the "encoding" argument be specified', () =>
    expect(() => Getargv.as_string(pid)).toThrow({
      name: 'TypeError',
      message: 'The "encoding" argument must be specified',
    })
  );

  it('Requires the "pid" argument be a number', () =>
    expect(() => Getargv.as_string('a', 'utf-8')).toThrow({
      name: 'TypeError',
      message: 'The "pid" argument must be a number',
    })
  );

  it('Requires the "encoding" argument be valid', () =>
    expect(() => Getargv.as_string(pid, 'a')).toThrow({
      name: 'RangeError',
      message: 'Unsupported encoding label "a"',
    })
  );

  it('Throws if the arguments cannot be encoded as requested', () => {
    const child = makeChild('Getargv.as_string errors > Throws if the arguments cannot be encoded as requested');
    try {
      expect(() => Getargv.as_string(child.pid!, "utf-16", undefined, undefined, { fatal: true })).toThrow({
        name: 'TypeError',
        message: "The encoded data was not valid UTF-16LE data",
      });
    } finally {
      child.kill();
    }
  });

});

describe("Getargv.as_array errors", () => {
  it('Requires the "pid" argument be specified', () =>
    expect(Getargv.as_array).toThrow({
      name: 'TypeError',
      message: 'The "pid" argument must be specified',
    })
  );

  it('Requires the "encoding" argument be specified', () =>
    expect(() => Getargv.as_array(pid)).toThrow({
      name: 'TypeError',
      message: 'The "encoding" argument must be specified',
    })
  );

  it('Requires the "pid" argument be a number', () =>
    expect(() => Getargv.as_array('a', 'utf-8')).toThrow({
      name: 'TypeError',
      message: 'The "pid" argument must be a number',
    })
  );

  it('Requires the "encoding" argument be valid', () =>
    expect(() => Getargv.as_array(pid, 'a')).toThrow({
      name: 'RangeError',
      message: 'Unsupported encoding label "a"',
    })
  );

  it('Throws if the arguments cannot be encoded as requested', () => {
    const child = makeChild('Getargv.as_array errors > Throws if the arguments cannot be encoded as requested');
    try {
      expect(() => Getargv.as_array(child.pid!, "utf-16", { fatal: true })).toThrow({
        name: 'TypeError',
        message: "The encoded data was not valid UTF-16LE data",
      });
    } finally {
      child.kill();
    }
  });

});

describe("Getargv.get_argv_of_pid errors", () => {
  it('Requires the "pid" argument be specified', () =>
    expect(Getargv.get_argv_of_pid).toThrow({
      name: 'TypeError',
      message: "Invalid number was passed as first argument",
    })
  );

  it('Requires the "pid" argument be a number', () =>
    expect(() => Getargv.get_argv_of_pid('a')).toThrow({
      name: 'TypeError',
      message: 'Invalid number was passed as first argument',
    })
  );

  it('Requires the "pid" argument be a positive number', () =>
    expect(() => Getargv.get_argv_of_pid(-1)).toThrow({
      name: 'RangeError',
      message: 'Invalid PID was passed as first argument',
    })
  );

  it('Requires the "nulls" argument be a boolean', () =>
    expect(() => Getargv.get_argv_of_pid(pid, 'a')).toThrow({
      name: 'TypeError',
      message: 'Invalid bool was passed as second argument',
    })
  );

  it('Requires the "skip" argument be a number', () =>
    expect(() => Getargv.get_argv_of_pid(pid, false, 'a')).toThrow({
      name: 'TypeError',
      message: 'Invalid number was passed as third argument',
    })
  );

  it('Requires the "skip" argument be a positive number', () =>
    expect(() => Getargv.get_argv_of_pid(pid, false, -1)).toThrow({
      name: 'RangeError',
      message: 'Invalid number was passed as third argument, must be between 0 and (1024 * 1024)',
    })
  );

  it('Requires the "skip" argument be a number not greater than ARG_MAX', () =>
    expect(() => Getargv.get_argv_of_pid(pid, false, Getargv.ARG_MAX + 1)).toThrow({
      name: 'RangeError',
      message: 'Invalid number was passed as third argument, must be between 0 and (1024 * 1024)',
    })
  );
});

describe("Getargv.get_argv_and_argc_of_pid errors", () => {
  it('Requires the "pid" argument be specified', () =>
    expect(Getargv.get_argv_and_argc_of_pid).toThrow({
      name: 'TypeError',
      message: 'The "pid" argument must be specified',
    })
  );

  it('Requires that extra arguments not be specified', () =>
    expect(() => Getargv.get_argv_and_argc_of_pid(pid, 'a')).toThrow({
      name: 'TypeError',
      message: 'Too many arguments were provided, max: 1',
    })
  );

  it('Requires the "pid" argument be a positive number', () =>
    expect(() => Getargv.get_argv_and_argc_of_pid(-1)).toThrow({
      name: 'RangeError',
      message: 'Invalid PID was passed as first argument',
    })
  );

  it('Requires the "pid" argument be a number not greater than PID_MAX', () =>
    expect(() => Getargv.get_argv_and_argc_of_pid(1 + Getargv.PID_MAX)).toThrow({
      name: 'RangeError',
      message: 'Invalid PID was passed as first argument',
    })
  );
});

describe("Correct functionality", () => {

  it('Getargv.get_argv_and_argc_of_pid returns correct output', () => {
    const result = Getargv.get_argv_and_argc_of_pid(pid);
    const expected = expectedArgs();
    expect(result).toStrictEqual(expected);
  });

  it('Getargv.get_argv_of_pid returns correct output', () => {
    const result = Getargv.get_argv_of_pid(pid);
    const expected_string = expectedString();
    expect(fromBuffer(result)).toStrictEqual(expected_string);
    expect(result).toStrictEqual(toBuffer(expected_string));
  });

  it('Getargv.as_string returns correct utf8 output', () => {
    const result = Getargv.as_string(pid, "utf-8");
    const expected = expectedString("utf-8");
    expect(result).toBe(expected);
  });

  it('Getargv.as_array returns correct utf8 output', () => {
    const result = Getargv.as_array(pid, "utf-8");
    const expected = expectedArray("utf-8");
    expect(result).toBe(expected);
  });

  it('Getargv.as_string returns correct utf16 output', () => {
    const child = makeChild('Correct functionality > Getargv.as_string returns correct utf16 output', false);
    try {
      const result = Getargv.as_string(child.pid!, "utf-16");
      const expected = fromBuffer(child.spawnargs.map(toBuffer).reduce(appendBuffers), "utf-16");
      expect(result).toBe(expected);
    } finally {
      child.kill();
    }
  });

  it('Getargv.as_array returns correct utf16 output', () => {
    const result = Getargv.as_array(pid, "utf-16");
    const expected = expectedArray("utf-16");
    expect(result).toStrictEqual(expected);
  });

});
