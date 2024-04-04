import { useEffect } from 'react';
import { WASI } from '@wasmer/wasi';
import { lowerI64Imports } from '@wasmer/wasm-transformer';
import React from 'react';

const wasmFilePath = 'main.wasm';

const HelloComponent = () => {
	useEffect(() => {
		let wasi = new WASI({
			args: [],
			env: {},
		});

		const loadWasm = async () => {
			const response = await fetch(wasmFilePath);
			const wasmBinary = await response.arrayBuffer();
			const wasm_bytes = new Uint8Array(wasmBinary).buffer;
			const lowered_wasm = await lowerI64Imports(wasm_bytes);
			let module = await WebAssembly.compile(lowered_wasm);

			// console.log(wasi.getImports(module));
			const instance = await WebAssembly.instantiate(module, {
				...wasi.getImports(module),
			});
			console.log(instance.exports);
			wasi.memory = new WebAssembly.Memory({
				initial: 10,
				maximum: 100,
			});
			instance.exports._initialize();
			instance.exports.hs_init(0, 0);

			console.log(instance.exports.fib(10));
		};

		loadWasm();
	}, []);

	return (
		<div>
			<p>Open the browser console to see the result.</p>
		</div>
	);
};

export default HelloComponent;
