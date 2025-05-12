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
};

export function expectedString(enc) {
    return expectedArgs().map(e => fromBuffer(e, enc)).join("");
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
    return enc.encode(str).buffer;
}

export function fromBuffer(buf, enc) {
    const dec = new TextDecoder(enc);
    return dec.decode(buf);
}

export function appendBuffers(buffer1, buffer2, index, array) {
    let nul_count = 1;
    if (array.length == index + 1) {
        nul_count++;
    }
    const ret = new Uint8Array(buffer1.byteLength + buffer2.byteLength + nul_count);
    ret.set(new Uint8Array(buffer1), 0);
    ret.set(new Uint8Array([0]), buffer1.byteLength);
    ret.set(new Uint8Array(buffer2), buffer1.byteLength + 1);

    if (array.length == index + 1) {
        ret.set(new Uint8Array([0]), buffer1.byteLength + buffer2.byteLength + 1);
    }

    return ret.buffer;
};
