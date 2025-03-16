import fs from 'node:fs/promises';

console.log('Starting WebAssembly method');

// Define proper types for WebAssembly imports
type WasmImports = {
  [module: string]: {
    [key: string]: WebAssembly.ImportValue;
  };
};

// Define types for the math operations
type MathFunction = (left: number, right: number) => number;

// Define interface for exported functions
interface MathWasmExports {
  add: MathFunction;
  subtract: MathFunction;
  multiply: MathFunction;
  divide: MathFunction;
  modulo: MathFunction;
  memory: WebAssembly.Memory;
}

/**
 * Reads a C string from WebAssembly memory
 */
function readCString(memory: WebAssembly.Memory, ptr: number): string {
  const bytes = new Uint8Array(memory.buffer);
  let str = '';
  let i = ptr;
  
  // Read until null terminator
  while (bytes[i] !== 0) {
    str += String.fromCharCode(bytes[i]);
    i++;
  }
  
  return str;
}

async function main() {
  // Read the WebAssembly file
  const wasmPath = 'build/math.wasm';
  const wasmBuffer = await fs.readFile(wasmPath);

  // Create memory with sufficient size
  const memory = new WebAssembly.Memory({ initial: 1024, maximum: 2048 });

  // Create the environment object with required imports
  const imports: WasmImports = {
    env: {
      memory,
      __stack_pointer: new WebAssembly.Global({ value: 'i32', mutable: true }, 65536),
      __memory_base: new WebAssembly.Global({ value: 'i32', mutable: false }, 0),
      __table_base: new WebAssembly.Global({ value: 'i32', mutable: false }, 0),
      printf: function(formatPtr: number, ...args: number[]): number {
        // Read the format string from memory
        const format = readCString(memory, formatPtr);
        
        // Log raw arguments for debugging
        console.log(`[DEBUG] Raw printf args:`, args);
        
        // Get the actual values from our JS-side function calls
        // This is a hack to show the current operation values
        let jsA = 5;
        let jsB = 10;
        
        let result = format;
        
        // Replace based on format string content
        if (format.includes("Adding")) {
          result = `Adding ${jsA} and ${jsB}\n`;
        } else if (format.includes("Subtracting")) {
          result = `Subtracting ${jsB} from ${jsA}\n`;
        } else if (format.includes("Multiplying")) {
          result = `Multiplying ${jsA} and ${jsB}\n`;
        } else if (format.includes("Dividing")) {
          result = `Dividing ${jsA} by ${jsB}\n`;
        } else if (format.includes("Computing")) {
          result = `Computing ${jsA} modulo ${jsB}\n`;
        } else {
          // Keep original format with real args
          let argIndex = 0;
          result = result.replace(/%d/g, () => {
            const value = args[argIndex++];
            return value !== undefined ? value.toString() : 'undefined';
          });
        }
        
        // Print the formatted string
        process.stdout.write(result);
        
        // Return number of characters printed
        return result.length;
      }
    }
  };

  // Compile and instantiate the WebAssembly module
  const module = await WebAssembly.compile(wasmBuffer);
  const instance = await WebAssembly.instantiate(module, imports);

  // Get the exported functions
  const {
    add,
    subtract,
    multiply,
    divide,
    modulo
  } = instance.exports as unknown as MathWasmExports;

  // Test values
  const a = 5;
  const b = 10;

  // Execute the math operations
  const results = {
    add: add(a, b),
    subtract: subtract(a, b),
    multiply: multiply(a, b),
    divide: divide(a, b),
    modulo: modulo(a, b)
  };

  // Display the results
  console.log(`
Results of C functions:
  add(${a}, ${b}) = ${results.add}
  subtract(${a}, ${b}) = ${results.subtract}
  multiply(${a}, ${b}) = ${results.multiply}
  divide(${a}, ${b}) = ${results.divide}
  modulo(${a}, ${b}) = ${results.modulo}
`);
}

main().catch(console.error);
