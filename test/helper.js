import { spawn } from 'node:child_process';
import process from "node:process";
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const [major, _minor, _patch] = process.versions.node.split('.').map(Number);

export const pid = process.pid;

function removePrefix(str, prefix) {
    return str.startsWith(prefix) ? str.slice(prefix.length) : str;
}

function fixupPerNodeVersion(path) {
    if (major && major <= 20) return path;
    return removePrefix(path, process.cwd() + "/");
}

export function expectedArgs() {
    const enc = new TextEncoder();
    return [process.argv0, ...process.execArgv, ...process.argv.slice(1)].map(a =>
        enc.encode(fixupPerNodeVersion(a) + "\0").buffer
    );
}

export function expectedString(enc) {
    return argsToString(expectedArgs(), enc);
}

export function expectedArray(enc) {
    return expectedArgs().map(e => fromBuffer(e, enc));
}

export function makeChild(unique_name, broken_utf_16 = true) {
    const pathTo = rest => `/Library/Developer/CommandLineTools/Library/PrivateFrameworks/LLDB.framework/Versions/Current/Resources/${rest}`;
    return spawn(pathTo('darwin-debug'), [`--unix-socket=${join(tmpdir(), unique_name)}`, '--', pathTo('lldb-argdumper'), broken_utf_16 ? 'length-sensitive-arg' : 'len-sensitive-arg'], { argv0: "lldb-argdumper" });
}

export function toBuffer(str) {
    const enc = new TextEncoder();
    if (str instanceof ArrayBuffer) return str;
    return enc.encode(str).buffer;
}

export function fromBuffer(buf, enc = 'utf-8') {
    const dec = new TextDecoder(enc);
    return dec.decode(buf);
}

export function appendBuffers(buffer1, buffer2, index, array) {
    let nul_count = 0;
    const b1view = new Uint8Array(buffer1);
    const b2view = new Uint8Array(buffer2);
    const b1_nul_terminated = b1view.at(-1) == 0;
    const b2_nul_terminated = b2view.at(-1) == 0;
    const end_of_array = array.length == index + 1;
    const nul = new Uint8Array([0]);
    const b2_offset = buffer1.byteLength + (b1_nul_terminated? 0 : 1);

    if (!b1_nul_terminated) {
        nul_count++;
    }
    if (end_of_array && !b2_nul_terminated) {
        nul_count++;
    }
    const ret = new Uint8Array(buffer1.byteLength + buffer2.byteLength + nul_count);
    ret.set(b1view, 0);
    if (!b1_nul_terminated) ret.set(nul, buffer1.byteLength);
    ret.set(b2view, b2_offset);

    if (end_of_array && !b2_nul_terminated) {
        ret.set(nul, b2_offset + buffer2.byteLength);
    }

    return ret.buffer;
};

export function argsToString(args, enc){
    return fromBuffer(args.map(toBuffer).reduce(appendBuffers), enc);
}
