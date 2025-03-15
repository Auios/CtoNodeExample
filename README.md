# C to Node Example

The mainstream Node FFI packages like `ffi` and `ffi-napi` are trash and broken. I wasted a few hours of my life that I'll never get back before finding two packages that actually work with Node v23. So here's a small example showing the bare minimum to call a C function from NodeJS without losing your sanity. You're welcome.

- [ffi-rs](https://www.npmjs.com/package/ffi-rs)
- [koffi](https://www.npmjs.com/package/koffi)

## Example Output

### ffi-rs

`npm run ffi`

```
> c_to_node@1.0.0 ffi
> npx tsx src/ffi_method.ts

Starting FFI method
Adding 5 and 10
Result: 15
```

### koffi

`npm run koffi`

```
> c_to_node@1.0.0 koffi
> npx tsx src/koffi_method.ts

Starting Koffi method
Adding 5 and 10
Result: 15
```