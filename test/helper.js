import { spawn } from 'node:child_process';
import process from "node:process";
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { randomUUID } from 'node:crypto';
import { unlinkSync, existsSync } from "node:fs";

export const pid = process.pid;

function removePrefix(str, prefix) {
    return str.startsWith(prefix) ? str.slice(prefix.length) : str;
}

function fixupPerNodeVersion(path) {
    if (process.isBun) {
        path = removePrefix(path, dirname(process.execPath) + "/");
    }
    return removePrefix(path, process.cwd() + "/");
}

export function expectedArgs() {
    const enc = new TextEncoder();
    const unmapped = [
        process.argv0,
        ...process.execArgv,
        ...process.argv.slice(1),
    ];
    return unmapped.map(a =>
        enc.encode(fixupPerNodeVersion(a) + "\0").buffer
    );
}

export function expectedString(enc) {
    return argsToString(expectedArgs(), enc);
}

export function expectedArray(enc) {
    return expectedArgs().map(e => fromBuffer(e, enc));
}

export function cleanupChild(child) {
    child.kill();
    const path = child.spawnargs.filter(e => e.includes("--unix-socket=")).at(0)?.split("=").at(-1);
    unlinkSync(path);
}

function createSock() {
    const sock_path = join(tmpdir(), randomUUID());
    const nc = spawn("/usr/bin/nc", ["-lU", sock_path], { stdio: "ignore" });
    nc.unref();
    while (!existsSync(sock_path)) { }
    return sock_path;
}

export function makeChild(_, broken_utf_16 = true) {
    const pathTo = exe => `/Library/Developer/CommandLineTools/Library/PrivateFrameworks/LLDB.framework/Versions/Current/Resources/${exe}`;

    const sock_path = createSock();
    const child = spawn(pathTo('darwin-debug'), [`--unix-socket=${sock_path}`, '--', pathTo('lldb-argdumper'), broken_utf_16 ? String.fromCharCode(0xD800) : 'valid-utf16'], { argv0: "lldb-argdumper" });

    while (!child.pid) { }

    return child;
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
    const b2_offset = buffer1.byteLength + (b1_nul_terminated ? 0 : 1);

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

export function argsToString(args, enc) {
    return fromBuffer(args.map(toBuffer).reduce(appendBuffers), enc);
}
