import koffi from 'koffi';
import { libName } from './utils';

console.log('Starting Koffi method');

const lib = koffi.load(libName('math'));

const add = lib.func('int add(int, int)');

const result = add(5, 10);
console.log(`Result: ${result}`);
