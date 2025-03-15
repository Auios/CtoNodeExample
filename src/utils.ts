import { platform } from 'os';

export function libName(name: string): string {
    const dynamicLib = platform() === 'win32' ? `./build/${name}.dll` : `./build/lib${name}.so`;
    return dynamicLib;
}