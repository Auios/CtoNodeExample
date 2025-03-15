import { load, DataType, open, close } from 'ffi-rs';
import { libName } from './utils';

open({
  library: 'math',
  path: libName('math')
});

async function callAddFunction(a: number, b: number): Promise<number> {
  const result = await load({
    library: 'math',
    funcName: 'add',
    retType: DataType.I32,
    paramsType: [DataType.I32, DataType.I32],
    paramsValue: [a, b]
  });

  return result as number;
}

async function main() {
  console.log('Starting FFI method');
  const a = 5;
  const b = 10;

  console.log(`Calling C function add(${a}, ${b})`);
  const result = await callAddFunction(a, b);
  console.log(`Result: ${result}`);

  close('math');
}

main().catch(console.error);
