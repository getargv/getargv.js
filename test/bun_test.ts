import { describe, test, expect } from 'bun:test';
import Getargv from "../dist/binding";
import process from "process";

const [major, _minor, _patch] = process.versions.node.split('.').map(Number);

const removePrefix = (value: string, prefix: string) => value.startsWith(prefix) ? value.slice(prefix.length) : value;

function fixupPerNodeVersion(input: string) {
  if (major && major <= 20) return input;
  return removePrefix(input, process.cwd() + "/");
}

function expected_args() {
  const enc = new TextEncoder();
  return [process.argv0, ...process.execArgv, ...process.argv.slice(1)].map(a =>
    enc.encode(fixupPerNodeVersion(a) + "\0").buffer
  );
};

describe("Testing constants", () => {

  test('Exports something', () =>
    expect(Getargv).toBeDefined()
  );

  test('Exports PID_MAX constant', () =>
    expect(Getargv).toHaveProperty('PID_MAX')
  );

  test('PID_MAX constant is correct', () =>
    expect(Getargv.PID_MAX).toBe(99999)
  );

  test('exports ARG_MAX constant', () =>
    expect(Getargv).toHaveProperty('ARG_MAX')
  );

  test('ARG_MAX is correct', () =>
    expect(Getargv.ARG_MAX).toBe(1024 * 1024)
  );

});

describe("Getargv.as_string errors", () => {

  test('Requires the "pid" argument be specified', () =>
    expect(Getargv.as_string).toThrow({
      name: 'TypeError',
      message: 'The "pid" argument must be specified',
    })
  );

  test('Requires the "encoding" argument be specified', () =>
    expect(() => Getargv.as_string(process.pid)).toThrow({
      name: 'TypeError',
      message: 'The "encoding" argument must be specified',
    })
  );

  test('Requires the "pid" argument be a number', () =>
    expect(() => Getargv.as_string('a', 'utf-8')).toThrow({
      name: 'TypeError',
      message: 'The "pid" argument must be a number',
    })
  );

  test('Requires the "encoding" argument be valid', () =>
    expect(() => Getargv.as_string(process.pid, 'a')).toThrow({
      name: 'RangeError',
      message: 'Unsupported encoding label "a"',
    })
  );

  test('Throws if the arguments cannot be encoded as requested', () =>
    expect(() => Getargv.as_string(process.pid, "utf-16", undefined, undefined, { fatal: true })).toThrow({
      name: 'TypeError',
      message: "The encoded data was not valid UTF-16LE data",
    })
  );

});

describe("Getargv.as_array errors", () => {
  test('Requires the "pid" argument be specified', () =>
    expect(Getargv.as_array).toThrow({
      name: 'TypeError',
      message: 'The "pid" argument must be specified',
    })
  );

  test('Requires the "encoding" argument be specified', () =>
    expect(() => Getargv.as_array(process.pid)).toThrow({
      name: 'TypeError',
      message: 'The "encoding" argument must be specified',
    })
  );

  test('Requires the "pid" argument be a number', () =>
    expect(() => Getargv.as_array('a', 'utf-8')).toThrow({
      name: 'TypeError',
      message: 'The "pid" argument must be a number',
    })
  );

  test('Requires the "encoding" argument be valid', () =>
    expect(() => Getargv.as_array(process.pid, 'a')).toThrow({
      name: 'RangeError',
      message: 'Unsupported encoding label "a"',
    })
  );

  test('Throws if the arguments cannot be encoded as requested', () =>
    expect(() => Getargv.as_array(process.pid, "utf-16", { fatal: true })).toThrow({
      name: 'TypeError',
      message: "The encoded data was not valid UTF-16LE data",
    })
  );

});

describe("Getargv.get_argv_of_pid errors", () => {
  test('Requires the "pid" argument be specified', () =>
    expect(Getargv.get_argv_of_pid).toThrow({
      name: 'TypeError',
      message: 'The "pid" argument must be specified',
    })
  );

  test('Requires the "pid" argument be a number', () =>
    expect(() => Getargv.get_argv_of_pid('a')).toThrow({
      name: 'TypeError',
      message: 'Invalid number was passed as first argument',
    })
  );

  test('Requires the "pid" argument be a positive number', () =>
    expect(() => Getargv.get_argv_of_pid(-1)).toThrow({
      name: 'RangeError',
      message: 'Invalid PID was passed as first argument',
    })
  );

  test('Requires the "nulls" argument be a boolean', () =>
    expect(() => Getargv.get_argv_of_pid(process.pid, 'a')).toThrow({
      name: 'TypeError',
      message: 'Invalid bool was passed as second argument',
    })
  );

  test('Requires the "skip" argument be a number', () =>
    expect(() => Getargv.get_argv_of_pid(process.pid, false, 'a')).toThrow({
      name: 'TypeError',
      message: 'Invalid number was passed as third argument',
    })
  );

  test('Requires the "skip" argument be a positive number', () =>
    expect(() => Getargv.get_argv_of_pid(process.pid, false, -1)).toThrow({
      name: 'RangeError',
      message: 'Invalid number was passed as third argument, must be between 0 and (1024 * 1024)',
    })
  );

  test('Requires the "skip" argument be a number not greater than ARG_MAX', () =>
    expect(() => Getargv.get_argv_of_pid(process.pid, false, Getargv.ARG_MAX + 1)).toThrow({
      name: 'RangeError',
      message: 'Invalid number was passed as third argument, must be between 0 and (1024 * 1024)',
    })
  );
});

describe("Getargv.get_argv_and_argc_of_pid errors", () => {
  test('Requires the "pid" argument be specified', () =>
    expect(Getargv.get_argv_and_argc_of_pid).toThrow({
      name: 'TypeError',
      message: 'The "pid" argument must be specified',
    })
  );

  test('Requires that extra arguments not be specified', () =>
    expect(() => Getargv.get_argv_and_argc_of_pid(process.pid, 'a')).toThrow({
      name: 'TypeError',
      message: 'Too many arguments were provided, max: 1',
    })
  );

  test('Requires the "pid" argument be a positive number', () =>
    expect(() => Getargv.get_argv_and_argc_of_pid(-1)).toThrow({
      name: 'RangeError',
      message: 'Invalid PID was passed as first argument',
    })
  );

  test('Requires the "pid" argument be a number not greater than PID_MAX', () =>
    expect(() => Getargv.get_argv_and_argc_of_pid(1 + Getargv.PID_MAX)).toThrow({
      name: 'RangeError',
      message: 'Invalid PID was passed as first argument',
    })
  );
});

describe("Correct functionality", () => {

  test('Getargv.get_argv_and_argc_of_pid returns correct output', () => {
    const result = Getargv.get_argv_and_argc_of_pid(process.pid);
    const expected = expected_args();
    expect(result).toStrictEqual(expected);
  });

  test('Getargv.get_argv_of_pid returns correct output', () => {
    const enc = new TextEncoder();
    const dec = new TextDecoder();
    const result = Getargv.get_argv_of_pid(process.pid);
    const expected_string = expected_args().map(e => dec.decode(e)).join("");
    expect(dec.decode(result)).toStrictEqual(expected_string);
    expect(result).toStrictEqual(enc.encode(expected_string).buffer);
  });

  test('Getargv.as_string returns correct utf8 output', () => {
    const dec = new TextDecoder();
    const result = Getargv.as_string(process.pid, "utf-8");
    const expected = expected_args().map(e => dec.decode(e)).join("");
    expect(result).toBe(expected);
  });

  test('Getargv.as_array returns correct utf8 output', () => {
    const dec = new TextDecoder();
    const result = Getargv.as_array(process.pid, "utf-8");
    const expected = expected_args().map(e => dec.decode(e));
    expect(result).toBe(expected);
  });

  test('Getargv.as_string returns correct utf16 output', () => {
    const dec = new TextDecoder();
    const result = Getargv.as_string(process.pid, "utf-16");
    const expected = expected_args().map(e => dec.decode(e)).join("");
    expect(result).not.toBe(expected);
  });

  test('Getargv.as_array returns correct utf16 output', () => {
    const dec = new TextDecoder();
    const result = Getargv.as_array(process.pid, "utf-16");
    const expected = expected_args().map(e => dec.decode(e));
    expect(result).not.toBe(expected);
  });

});
