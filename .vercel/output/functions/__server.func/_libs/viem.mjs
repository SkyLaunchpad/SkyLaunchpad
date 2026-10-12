import { t as formatAbiItem$1 } from "./abitype.mjs";
import { t as keccak_256 } from "./noble__hashes.mjs";
//#region node_modules/viem/_esm/utils/abi/formatAbiItem.js
function formatAbiItem(abiItem, { includeName = false } = {}) {
	if (abiItem.type !== "function" && abiItem.type !== "event" && abiItem.type !== "error") throw new InvalidDefinitionTypeError(abiItem.type);
	return `${abiItem.name}(${formatAbiParams(abiItem.inputs, { includeName })})`;
}
function formatAbiParams(params, { includeName = false } = {}) {
	if (!params) return "";
	return params.map((param) => formatAbiParam(param, { includeName })).join(includeName ? ", " : ",");
}
function formatAbiParam(param, { includeName }) {
	if (param.type.startsWith("tuple")) return `(${formatAbiParams(param.components, { includeName })})${param.type.slice(5)}`;
	return param.type + (includeName && param.name ? ` ${param.name}` : "");
}
//#endregion
//#region node_modules/viem/_esm/utils/data/isHex.js
function isHex(value, { strict = true } = {}) {
	if (!value) return false;
	if (typeof value !== "string") return false;
	return strict ? /^0x[0-9a-fA-F]*$/.test(value) : value.startsWith("0x");
}
//#endregion
//#region node_modules/viem/_esm/utils/data/size.js
/**
* @description Retrieves the size of the value (in bytes).
*
* @param value The value (hex or byte array) to retrieve the size of.
* @returns The size of the value (in bytes).
*/
function size(value) {
	if (isHex(value, { strict: false })) return Math.ceil((value.length - 2) / 2);
	return value.length;
}
//#endregion
//#region node_modules/viem/_esm/errors/version.js
var version = "2.57.4";
//#endregion
//#region node_modules/viem/_esm/errors/base.js
var errorConfig = {
	getDocsUrl: ({ docsBaseUrl, docsPath = "", docsSlug }) => docsPath ? `${docsBaseUrl ?? "https://viem.sh"}${docsPath}${docsSlug ? `#${docsSlug}` : ""}` : void 0,
	version: `viem@${version}`
};
var BaseError = class BaseError extends Error {
	constructor(shortMessage, args = {}) {
		const details = (() => {
			if (args.cause instanceof BaseError) return args.cause.details;
			if (args.cause?.message) return args.cause.message;
			return args.details;
		})();
		const docsPath = (() => {
			if (args.cause instanceof BaseError) return args.cause.docsPath || args.docsPath;
			return args.docsPath;
		})();
		const docsUrl = errorConfig.getDocsUrl?.({
			...args,
			docsPath
		});
		const message = [
			shortMessage || "An error occurred.",
			"",
			...args.metaMessages ? [...args.metaMessages, ""] : [],
			...docsUrl ? [`Docs: ${docsUrl}`] : [],
			...details ? [`Details: ${details}`] : [],
			...errorConfig.version ? [`Version: ${errorConfig.version}`] : []
		].join("\n");
		super(message, args.cause ? { cause: args.cause } : void 0);
		Object.defineProperty(this, "details", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "docsPath", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "metaMessages", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "shortMessage", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "version", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "BaseError"
		});
		this.details = details;
		this.docsPath = docsPath;
		this.metaMessages = args.metaMessages;
		this.name = args.name ?? this.name;
		this.shortMessage = shortMessage;
		this.version = version;
	}
	walk(fn) {
		return walk(this, fn);
	}
};
function walk(err, fn) {
	if (fn?.(err)) return err;
	if (err && typeof err === "object" && "cause" in err && err.cause !== void 0) return walk(err.cause, fn);
	return fn ? null : err;
}
//#endregion
//#region node_modules/viem/_esm/errors/abi.js
var AbiConstructorNotFoundError = class extends BaseError {
	constructor({ docsPath }) {
		super(["A constructor was not found on the ABI.", "Make sure you are using the correct ABI and that the constructor exists on it."].join("\n"), {
			docsPath,
			name: "AbiConstructorNotFoundError"
		});
	}
};
var AbiConstructorParamsNotFoundError = class extends BaseError {
	constructor({ docsPath }) {
		super(["Constructor arguments were provided (`args`), but a constructor parameters (`inputs`) were not found on the ABI.", "Make sure you are using the correct ABI, and that the `inputs` attribute on the constructor exists."].join("\n"), {
			docsPath,
			name: "AbiConstructorParamsNotFoundError"
		});
	}
};
var AbiDecodingDataSizeTooSmallError = class extends BaseError {
	constructor({ data, params, size }) {
		super([`Data size of ${size} bytes is too small for given parameters.`].join("\n"), {
			metaMessages: [`Params: (${formatAbiParams(params, { includeName: true })})`, `Data:   ${data} (${size} bytes)`],
			name: "AbiDecodingDataSizeTooSmallError"
		});
		Object.defineProperty(this, "data", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "params", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "size", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		this.data = data;
		this.params = params;
		this.size = size;
	}
};
var AbiDecodingZeroDataError = class extends BaseError {
	constructor({ cause } = {}) {
		super("Cannot decode zero data (\"0x\") with ABI parameters.", {
			name: "AbiDecodingZeroDataError",
			cause
		});
	}
};
var AbiEncodingArrayLengthMismatchError = class extends BaseError {
	constructor({ expectedLength, givenLength, type }) {
		super([
			`ABI encoding array length mismatch for type ${type}.`,
			`Expected length: ${expectedLength}`,
			`Given length: ${givenLength}`
		].join("\n"), { name: "AbiEncodingArrayLengthMismatchError" });
	}
};
var AbiEncodingBytesSizeMismatchError = class extends BaseError {
	constructor({ expectedSize, value }) {
		super(`Size of bytes "${value}" (bytes${size(value)}) does not match expected size (bytes${expectedSize}).`, { name: "AbiEncodingBytesSizeMismatchError" });
	}
};
var AbiEncodingLengthMismatchError = class extends BaseError {
	constructor({ expectedLength, givenLength }) {
		super([
			"ABI encoding params/values length mismatch.",
			`Expected length (params): ${expectedLength}`,
			`Given length (values): ${givenLength}`
		].join("\n"), { name: "AbiEncodingLengthMismatchError" });
	}
};
var AbiEventSignatureEmptyTopicsError = class extends BaseError {
	constructor({ docsPath }) {
		super("Cannot extract event signature from empty topics.", {
			docsPath,
			name: "AbiEventSignatureEmptyTopicsError"
		});
	}
};
var AbiEventSignatureNotFoundError = class extends BaseError {
	constructor(signature, { docsPath }) {
		super([
			`Encoded event signature "${signature}" not found on ABI.`,
			"Make sure you are using the correct ABI and that the event exists on it.",
			`You can look up the signature here: https://4byte.sourcify.dev/?q=${signature}.`
		].join("\n"), {
			docsPath,
			name: "AbiEventSignatureNotFoundError"
		});
	}
};
var AbiFunctionNotFoundError = class extends BaseError {
	constructor(functionName, { docsPath } = {}) {
		super([`Function ${functionName ? `"${functionName}" ` : ""}not found on ABI.`, "Make sure you are using the correct ABI and that the function exists on it."].join("\n"), {
			docsPath,
			name: "AbiFunctionNotFoundError"
		});
	}
};
var AbiFunctionOutputsNotFoundError = class extends BaseError {
	constructor(functionName, { docsPath }) {
		super([
			`Function "${functionName}" does not contain any \`outputs\` on ABI.`,
			"Cannot decode function result without knowing what the parameter types are.",
			"Make sure you are using the correct ABI and that the function exists on it."
		].join("\n"), {
			docsPath,
			name: "AbiFunctionOutputsNotFoundError"
		});
	}
};
var AbiItemAmbiguityError = class extends BaseError {
	constructor(x, y) {
		super("Found ambiguous types in overloaded ABI items.", {
			metaMessages: [
				`\`${x.type}\` in \`${formatAbiItem(x.abiItem)}\`, and`,
				`\`${y.type}\` in \`${formatAbiItem(y.abiItem)}\``,
				"",
				"These types encode differently and cannot be distinguished at runtime.",
				"Remove one of the ambiguous items in the ABI."
			],
			name: "AbiItemAmbiguityError"
		});
	}
};
var DecodeLogDataMismatch = class extends BaseError {
	constructor({ abiItem, data, params, size }) {
		super([`Data size of ${size} bytes is too small for non-indexed event parameters.`].join("\n"), {
			metaMessages: [`Params: (${formatAbiParams(params, { includeName: true })})`, `Data:   ${data} (${size} bytes)`],
			name: "DecodeLogDataMismatch"
		});
		Object.defineProperty(this, "abiItem", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "data", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "params", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "size", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		this.abiItem = abiItem;
		this.data = data;
		this.params = params;
		this.size = size;
	}
};
var DecodeLogTopicsMismatch = class extends BaseError {
	constructor({ abiItem, param }) {
		super([`Expected a topic for indexed event parameter${param.name ? ` "${param.name}"` : ""} on event "${formatAbiItem(abiItem, { includeName: true })}".`].join("\n"), { name: "DecodeLogTopicsMismatch" });
		Object.defineProperty(this, "abiItem", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		this.abiItem = abiItem;
	}
};
var InvalidAbiEncodingTypeError = class extends BaseError {
	constructor(type, { docsPath }) {
		super([`Type "${type}" is not a valid encoding type.`, "Please provide a valid ABI type."].join("\n"), {
			docsPath,
			name: "InvalidAbiEncodingType"
		});
	}
};
var InvalidAbiDecodingTypeError = class extends BaseError {
	constructor(type, { docsPath }) {
		super([`Type "${type}" is not a valid decoding type.`, "Please provide a valid ABI type."].join("\n"), {
			docsPath,
			name: "InvalidAbiDecodingType"
		});
	}
};
var InvalidArrayError = class extends BaseError {
	constructor(value) {
		super([`Value "${value}" is not a valid array.`].join("\n"), { name: "InvalidArrayError" });
	}
};
var InvalidDefinitionTypeError = class extends BaseError {
	constructor(type) {
		super([`"${type}" is not a valid definition type.`, "Valid types: \"function\", \"event\", \"error\""].join("\n"), { name: "InvalidDefinitionTypeError" });
	}
};
//#endregion
//#region node_modules/viem/_esm/errors/data.js
var SliceOffsetOutOfBoundsError = class extends BaseError {
	constructor({ offset, position, size }) {
		super(`Slice ${position === "start" ? "starting" : "ending"} at offset "${offset}" is out-of-bounds (size: ${size}).`, { name: "SliceOffsetOutOfBoundsError" });
	}
};
var SizeExceedsPaddingSizeError = class extends BaseError {
	constructor({ size, targetSize, type }) {
		super(`${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()} size (${size}) exceeds padding size (${targetSize}).`, { name: "SizeExceedsPaddingSizeError" });
	}
};
//#endregion
//#region node_modules/viem/_esm/utils/data/pad.js
function pad(hexOrBytes, { dir, size = 32 } = {}) {
	if (typeof hexOrBytes === "string") return padHex(hexOrBytes, {
		dir,
		size
	});
	return padBytes(hexOrBytes, {
		dir,
		size
	});
}
function padHex(hex_, { dir, size = 32 } = {}) {
	if (size === null) return hex_;
	const hex = hex_.replace("0x", "");
	if (hex.length > size * 2) throw new SizeExceedsPaddingSizeError({
		size: Math.ceil(hex.length / 2),
		targetSize: size,
		type: "hex"
	});
	return `0x${hex[dir === "right" ? "padEnd" : "padStart"](size * 2, "0")}`;
}
function padBytes(bytes, { dir, size = 32 } = {}) {
	if (size === null) return bytes;
	if (bytes.length > size) throw new SizeExceedsPaddingSizeError({
		size: bytes.length,
		targetSize: size,
		type: "bytes"
	});
	const paddedBytes = new Uint8Array(size);
	for (let i = 0; i < size; i++) {
		const padEnd = dir === "right";
		paddedBytes[padEnd ? i : size - i - 1] = bytes[padEnd ? i : bytes.length - i - 1];
	}
	return paddedBytes;
}
//#endregion
//#region node_modules/viem/_esm/errors/encoding.js
var IntegerOutOfRangeError = class extends BaseError {
	constructor({ max, min, signed, size, value }) {
		super(`Number "${value}" is not in safe ${size ? `${size * 8}-bit ${signed ? "signed" : "unsigned"} ` : ""}integer range ${max ? `(${min} to ${max})` : `(above ${min})`}`, { name: "IntegerOutOfRangeError" });
	}
};
var InvalidBytesBooleanError = class extends BaseError {
	constructor(bytes) {
		super(`Bytes value "${bytes}" is not a valid boolean. The bytes array must contain a single byte of either a 0 or 1 value.`, { name: "InvalidBytesBooleanError" });
	}
};
var SizeOverflowError = class extends BaseError {
	constructor({ givenSize, maxSize }) {
		super(`Size cannot exceed ${maxSize} bytes. Given size: ${givenSize} bytes.`, { name: "SizeOverflowError" });
	}
};
//#endregion
//#region node_modules/viem/_esm/utils/data/trim.js
function trim(hexOrBytes, { dir = "left" } = {}) {
	let data = typeof hexOrBytes === "string" ? hexOrBytes.replace("0x", "") : hexOrBytes;
	let sliceLength = 0;
	for (let i = 0; i < data.length - 1; i++) if (data[dir === "left" ? i : data.length - i - 1].toString() === "0") sliceLength++;
	else break;
	data = dir === "left" ? data.slice(sliceLength) : data.slice(0, data.length - sliceLength);
	if (typeof hexOrBytes === "string") {
		if (data.length === 1 && dir === "right") data = `${data}0`;
		return `0x${data.length % 2 === 1 ? `0${data}` : data}`;
	}
	return data;
}
//#endregion
//#region node_modules/viem/_esm/utils/encoding/fromHex.js
function assertSize(hexOrBytes, { size: size$1 }) {
	if (size(hexOrBytes) > size$1) throw new SizeOverflowError({
		givenSize: size(hexOrBytes),
		maxSize: size$1
	});
}
/**
* Decodes a hex value into a bigint.
*
* - Docs: https://viem.sh/docs/utilities/fromHex#hextobigint
*
* @param hex Hex value to decode.
* @param opts Options.
* @returns BigInt value.
*
* @example
* import { hexToBigInt } from 'viem'
* const data = hexToBigInt('0x1a4', { signed: true })
* // 420n
*
* @example
* import { hexToBigInt } from 'viem'
* const data = hexToBigInt('0x00000000000000000000000000000000000000000000000000000000000001a4', { size: 32 })
* // 420n
*/
function hexToBigInt(hex, opts = {}) {
	const { signed } = opts;
	if (opts.size) assertSize(hex, { size: opts.size });
	const value = BigInt(hex);
	if (!signed) return value;
	const size = Math.ceil((hex.length - 2) / 2);
	if (value <= (1n << BigInt(size) * 8n - 1n) - 1n) return value;
	return value - BigInt(`0x${"f".padStart(size * 2, "f")}`) - 1n;
}
/**
* Decodes a hex string into a number.
*
* - Docs: https://viem.sh/docs/utilities/fromHex#hextonumber
*
* @param hex Hex value to decode.
* @param opts Options.
* @returns Number value.
*
* @example
* import { hexToNumber } from 'viem'
* const data = hexToNumber('0x1a4')
* // 420
*
* @example
* import { hexToNumber } from 'viem'
* const data = hexToNumber('0x00000000000000000000000000000000000000000000000000000000000001a4', { size: 32 })
* // 420
*/
function hexToNumber(hex, opts = {}) {
	const value = hexToBigInt(hex, opts);
	const number = Number(value);
	if (!Number.isSafeInteger(number)) throw new IntegerOutOfRangeError({
		max: `${Number.MAX_SAFE_INTEGER}`,
		min: `${Number.MIN_SAFE_INTEGER}`,
		signed: opts.signed,
		size: opts.size,
		value: `${value}n`
	});
	return number;
}
//#endregion
//#region node_modules/viem/_esm/utils/encoding/toHex.js
var hexes = /*#__PURE__*/ Array.from({ length: 256 }, (_v, i) => i.toString(16).padStart(2, "0"));
/**
* Encodes a string, number, bigint, or ByteArray into a hex string
*
* - Docs: https://viem.sh/docs/utilities/toHex
* - Example: https://viem.sh/docs/utilities/toHex#usage
*
* @param value Value to encode.
* @param opts Options.
* @returns Hex value.
*
* @example
* import { toHex } from 'viem'
* const data = toHex('Hello world')
* // '0x48656c6c6f20776f726c6421'
*
* @example
* import { toHex } from 'viem'
* const data = toHex(420)
* // '0x1a4'
*
* @example
* import { toHex } from 'viem'
* const data = toHex('Hello world', { size: 32 })
* // '0x48656c6c6f20776f726c64210000000000000000000000000000000000000000'
*/
function toHex(value, opts = {}) {
	if (typeof value === "number" || typeof value === "bigint") return numberToHex(value, opts);
	if (typeof value === "string") return stringToHex(value, opts);
	if (typeof value === "boolean") return boolToHex(value, opts);
	return bytesToHex(value, opts);
}
/**
* Encodes a boolean into a hex string
*
* - Docs: https://viem.sh/docs/utilities/toHex#booltohex
*
* @param value Value to encode.
* @param opts Options.
* @returns Hex value.
*
* @example
* import { boolToHex } from 'viem'
* const data = boolToHex(true)
* // '0x1'
*
* @example
* import { boolToHex } from 'viem'
* const data = boolToHex(false)
* // '0x0'
*
* @example
* import { boolToHex } from 'viem'
* const data = boolToHex(true, { size: 32 })
* // '0x0000000000000000000000000000000000000000000000000000000000000001'
*/
function boolToHex(value, opts = {}) {
	const hex = `0x${Number(value)}`;
	if (typeof opts.size === "number") {
		assertSize(hex, { size: opts.size });
		return pad(hex, { size: opts.size });
	}
	return hex;
}
/**
* Encodes a bytes array into a hex string
*
* - Docs: https://viem.sh/docs/utilities/toHex#bytestohex
*
* @param value Value to encode.
* @param opts Options.
* @returns Hex value.
*
* @example
* import { bytesToHex } from 'viem'
* const data = bytesToHex(Uint8Array.from([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33])
* // '0x48656c6c6f20576f726c6421'
*
* @example
* import { bytesToHex } from 'viem'
* const data = bytesToHex(Uint8Array.from([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33]), { size: 32 })
* // '0x48656c6c6f20576f726c64210000000000000000000000000000000000000000'
*/
function bytesToHex(value, opts = {}) {
	let string = "";
	for (let i = 0; i < value.length; i++) string += hexes[value[i]];
	const hex = `0x${string}`;
	if (typeof opts.size === "number") {
		assertSize(hex, { size: opts.size });
		return pad(hex, {
			dir: "right",
			size: opts.size
		});
	}
	return hex;
}
/**
* Encodes a number or bigint into a hex string
*
* - Docs: https://viem.sh/docs/utilities/toHex#numbertohex
*
* @param value Value to encode.
* @param opts Options.
* @returns Hex value.
*
* @example
* import { numberToHex } from 'viem'
* const data = numberToHex(420)
* // '0x1a4'
*
* @example
* import { numberToHex } from 'viem'
* const data = numberToHex(420, { size: 32 })
* // '0x00000000000000000000000000000000000000000000000000000000000001a4'
*/
function numberToHex(value_, opts = {}) {
	const { signed, size } = opts;
	const value = BigInt(value_);
	let maxValue;
	if (size) {
		if (signed) maxValue = (1n << BigInt(size) * 8n - 1n) - 1n;
		else maxValue = 2n ** (BigInt(size) * 8n) - 1n;
	} else if (typeof value_ === "number") maxValue = BigInt(Number.MAX_SAFE_INTEGER);
	const minValue = typeof maxValue === "bigint" && signed ? -maxValue - 1n : 0;
	if (maxValue && value > maxValue || value < minValue) {
		const suffix = typeof value_ === "bigint" ? "n" : "";
		throw new IntegerOutOfRangeError({
			max: maxValue ? `${maxValue}${suffix}` : void 0,
			min: `${minValue}${suffix}`,
			signed,
			size,
			value: `${value_}${suffix}`
		});
	}
	const hex = `0x${(signed && value < 0 ? (1n << BigInt(size * 8)) + BigInt(value) : value).toString(16)}`;
	if (size) return pad(hex, { size });
	return hex;
}
var encoder$1 = /*#__PURE__*/ new TextEncoder();
/**
* Encodes a UTF-8 string into a hex string
*
* - Docs: https://viem.sh/docs/utilities/toHex#stringtohex
*
* @param value Value to encode.
* @param opts Options.
* @returns Hex value.
*
* @example
* import { stringToHex } from 'viem'
* const data = stringToHex('Hello World!')
* // '0x48656c6c6f20576f726c6421'
*
* @example
* import { stringToHex } from 'viem'
* const data = stringToHex('Hello World!', { size: 32 })
* // '0x48656c6c6f20576f726c64210000000000000000000000000000000000000000'
*/
function stringToHex(value_, opts = {}) {
	return bytesToHex(encoder$1.encode(value_), opts);
}
//#endregion
//#region node_modules/viem/_esm/utils/encoding/toBytes.js
var encoder = /*#__PURE__*/ new TextEncoder();
/**
* Encodes a UTF-8 string, hex value, bigint, number or boolean to a byte array.
*
* - Docs: https://viem.sh/docs/utilities/toBytes
* - Example: https://viem.sh/docs/utilities/toBytes#usage
*
* @param value Value to encode.
* @param opts Options.
* @returns Byte array value.
*
* @example
* import { toBytes } from 'viem'
* const data = toBytes('Hello world')
* // Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33])
*
* @example
* import { toBytes } from 'viem'
* const data = toBytes(420)
* // Uint8Array([1, 164])
*
* @example
* import { toBytes } from 'viem'
* const data = toBytes(420, { size: 4 })
* // Uint8Array([0, 0, 1, 164])
*/
function toBytes(value, opts = {}) {
	if (typeof value === "number" || typeof value === "bigint") return numberToBytes(value, opts);
	if (typeof value === "boolean") return boolToBytes(value, opts);
	if (isHex(value)) return hexToBytes(value, opts);
	return stringToBytes(value, opts);
}
/**
* Encodes a boolean into a byte array.
*
* - Docs: https://viem.sh/docs/utilities/toBytes#booltobytes
*
* @param value Boolean value to encode.
* @param opts Options.
* @returns Byte array value.
*
* @example
* import { boolToBytes } from 'viem'
* const data = boolToBytes(true)
* // Uint8Array([1])
*
* @example
* import { boolToBytes } from 'viem'
* const data = boolToBytes(true, { size: 32 })
* // Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1])
*/
function boolToBytes(value, opts = {}) {
	const bytes = /* @__PURE__ */ new Uint8Array(1);
	bytes[0] = Number(value);
	if (typeof opts.size === "number") {
		assertSize(bytes, { size: opts.size });
		return pad(bytes, { size: opts.size });
	}
	return bytes;
}
var charCodeMap = {
	zero: 48,
	nine: 57,
	A: 65,
	F: 70,
	a: 97,
	f: 102
};
function charCodeToBase16(char) {
	if (char >= charCodeMap.zero && char <= charCodeMap.nine) return char - charCodeMap.zero;
	if (char >= charCodeMap.A && char <= charCodeMap.F) return char - (charCodeMap.A - 10);
	if (char >= charCodeMap.a && char <= charCodeMap.f) return char - (charCodeMap.a - 10);
}
/**
* Encodes a hex string into a byte array.
*
* - Docs: https://viem.sh/docs/utilities/toBytes#hextobytes
*
* @param hex Hex string to encode.
* @param opts Options.
* @returns Byte array value.
*
* @example
* import { hexToBytes } from 'viem'
* const data = hexToBytes('0x48656c6c6f20776f726c6421')
* // Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33])
*
* @example
* import { hexToBytes } from 'viem'
* const data = hexToBytes('0x48656c6c6f20776f726c6421', { size: 32 })
* // Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
*/
function hexToBytes(hex_, opts = {}) {
	let hex = hex_;
	if (opts.size) {
		assertSize(hex, { size: opts.size });
		hex = pad(hex, {
			dir: "right",
			size: opts.size
		});
	}
	let hexString = hex.slice(2);
	if (hexString.length % 2) hexString = `0${hexString}`;
	const length = hexString.length / 2;
	const bytes = new Uint8Array(length);
	for (let index = 0, j = 0; index < length; index++) {
		const nibbleLeft = charCodeToBase16(hexString.charCodeAt(j++));
		const nibbleRight = charCodeToBase16(hexString.charCodeAt(j++));
		if (nibbleLeft === void 0 || nibbleRight === void 0) throw new BaseError(`Invalid byte sequence ("${hexString[j - 2]}${hexString[j - 1]}" in "${hexString}").`);
		bytes[index] = nibbleLeft * 16 + nibbleRight;
	}
	return bytes;
}
/**
* Encodes a number into a byte array.
*
* - Docs: https://viem.sh/docs/utilities/toBytes#numbertobytes
*
* @param value Number to encode.
* @param opts Options.
* @returns Byte array value.
*
* @example
* import { numberToBytes } from 'viem'
* const data = numberToBytes(420)
* // Uint8Array([1, 164])
*
* @example
* import { numberToBytes } from 'viem'
* const data = numberToBytes(420, { size: 4 })
* // Uint8Array([0, 0, 1, 164])
*/
function numberToBytes(value, opts) {
	return hexToBytes(numberToHex(value, opts));
}
/**
* Encodes a UTF-8 string into a byte array.
*
* - Docs: https://viem.sh/docs/utilities/toBytes#stringtobytes
*
* @param value String to encode.
* @param opts Options.
* @returns Byte array value.
*
* @example
* import { stringToBytes } from 'viem'
* const data = stringToBytes('Hello world!')
* // Uint8Array([72, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100, 33])
*
* @example
* import { stringToBytes } from 'viem'
* const data = stringToBytes('Hello world!', { size: 32 })
* // Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
*/
function stringToBytes(value, opts = {}) {
	const bytes = encoder.encode(value);
	if (typeof opts.size === "number") {
		assertSize(bytes, { size: opts.size });
		return pad(bytes, {
			dir: "right",
			size: opts.size
		});
	}
	return bytes;
}
//#endregion
//#region node_modules/viem/_esm/utils/hash/keccak256.js
function keccak256(value, to_) {
	const to = to_ || "hex";
	const bytes = keccak_256(isHex(value, { strict: false }) ? toBytes(value) : value);
	if (to === "bytes") return bytes;
	return toHex(bytes);
}
//#endregion
//#region node_modules/viem/_esm/utils/hash/hashSignature.js
var hash = (value) => keccak256(toBytes(value));
function hashSignature(sig) {
	return hash(sig);
}
//#endregion
//#region node_modules/viem/_esm/utils/hash/normalizeSignature.js
function normalizeSignature(signature) {
	let active = true;
	let current = "";
	let level = 0;
	let result = "";
	let valid = false;
	for (let i = 0; i < signature.length; i++) {
		const char = signature[i];
		if ([
			"(",
			")",
			","
		].includes(char)) active = true;
		if (char === "(") level++;
		if (char === ")") level--;
		if (!active) continue;
		if (level === 0) {
			if (char === " " && [
				"event",
				"function",
				""
			].includes(result)) result = "";
			else {
				result += char;
				if (char === ")") {
					valid = true;
					break;
				}
			}
			continue;
		}
		if (char === " ") {
			if (signature[i - 1] !== "," && current !== "," && current !== ",(") {
				current = "";
				active = false;
			}
			continue;
		}
		result += char;
		current += char;
	}
	if (!valid) throw new BaseError("Unable to normalize signature.");
	return result;
}
//#endregion
//#region node_modules/viem/_esm/utils/hash/toSignature.js
/**
* Returns the signature for a given function or event definition.
*
* @example
* const signature = toSignature('function ownerOf(uint256 tokenId)')
* // 'ownerOf(uint256)'
*
* @example
* const signature_3 = toSignature({
*   name: 'ownerOf',
*   type: 'function',
*   inputs: [{ name: 'tokenId', type: 'uint256' }],
*   outputs: [],
*   stateMutability: 'view',
* })
* // 'ownerOf(uint256)'
*/
var toSignature = (def) => {
	return normalizeSignature((() => {
		if (typeof def === "string") return def;
		return formatAbiItem$1(def);
	})());
};
//#endregion
//#region node_modules/viem/_esm/utils/hash/toSignatureHash.js
/**
* Returns the hash (of the function/event signature) for a given event or function definition.
*/
function toSignatureHash(fn) {
	return hashSignature(toSignature(fn));
}
//#endregion
//#region node_modules/viem/_esm/utils/hash/toEventSelector.js
/**
* Returns the event selector for a given event definition.
*
* @example
* const selector = toEventSelector('Transfer(address indexed from, address indexed to, uint256 amount)')
* // 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef
*/
var toEventSelector = toSignatureHash;
//#endregion
//#region node_modules/viem/_esm/errors/address.js
var InvalidAddressError = class extends BaseError {
	constructor({ address }) {
		super(`Address "${address}" is invalid.`, {
			metaMessages: ["- Address must be a hex value of 20 bytes (40 hex characters).", "- Address must match its checksum counterpart."],
			name: "InvalidAddressError"
		});
	}
};
//#endregion
//#region node_modules/viem/_esm/utils/lru.js
/**
* Map with a LRU (Least recently used) policy.
*
* @link https://en.wikipedia.org/wiki/Cache_replacement_policies#LRU
*/
var LruMap = class extends Map {
	constructor(size) {
		super();
		Object.defineProperty(this, "maxSize", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		this.maxSize = size;
	}
	get(key) {
		const value = super.get(key);
		if (super.has(key)) {
			super.delete(key);
			super.set(key, value);
		}
		return value;
	}
	set(key, value) {
		if (super.has(key)) super.delete(key);
		super.set(key, value);
		if (this.maxSize && this.size > this.maxSize) {
			const firstKey = super.keys().next().value;
			if (firstKey !== void 0) super.delete(firstKey);
		}
		return this;
	}
};
//#endregion
//#region node_modules/viem/_esm/utils/address/getAddress.js
var checksumAddressCache = /*#__PURE__*/ new LruMap(8192);
function checksumAddress(address_, chainId) {
	if (checksumAddressCache.has(`${address_}.${chainId}`)) return checksumAddressCache.get(`${address_}.${chainId}`);
	const hexAddress = chainId ? `${chainId}${address_.toLowerCase()}` : address_.substring(2).toLowerCase();
	const hash = keccak256(stringToBytes(hexAddress), "bytes");
	const address = (chainId ? hexAddress.substring(`${chainId}0x`.length) : hexAddress).split("");
	for (let i = 0; i < 40; i += 2) {
		if (hash[i >> 1] >> 4 >= 8 && address[i]) address[i] = address[i].toUpperCase();
		if ((hash[i >> 1] & 15) >= 8 && address[i + 1]) address[i + 1] = address[i + 1].toUpperCase();
	}
	const result = `0x${address.join("")}`;
	checksumAddressCache.set(`${address_}.${chainId}`, result);
	return result;
}
//#endregion
//#region node_modules/viem/_esm/utils/address/isAddress.js
var addressRegex = /^0x[a-fA-F0-9]{40}$/;
/** @internal */
var isAddressCache = /*#__PURE__*/ new LruMap(8192);
function isAddress(address, options) {
	const { strict = true } = options ?? {};
	const cacheKey = `${address}.${strict}`;
	if (isAddressCache.has(cacheKey)) return isAddressCache.get(cacheKey);
	const result = (() => {
		if (!addressRegex.test(address)) return false;
		if (address.toLowerCase() === address) return true;
		if (strict) return checksumAddress(address) === address;
		return true;
	})();
	isAddressCache.set(cacheKey, result);
	return result;
}
//#endregion
//#region node_modules/viem/_esm/utils/data/concat.js
function concatHex(values) {
	return `0x${values.reduce((acc, x) => acc + x.replace("0x", ""), "")}`;
}
//#endregion
//#region node_modules/viem/_esm/utils/data/slice.js
/**
* @description Returns a section of the hex or byte array given a start/end bytes offset.
*
* @param value The hex or byte array to slice.
* @param start The start offset (in bytes).
* @param end The end offset (in bytes).
*/
function slice(value, start, end, { strict } = {}) {
	if (isHex(value, { strict: false })) return sliceHex(value, start, end, { strict });
	return sliceBytes(value, start, end, { strict });
}
function assertStartOffset(value, start) {
	if (typeof start === "number" && start > 0 && start > size(value) - 1) throw new SliceOffsetOutOfBoundsError({
		offset: start,
		position: "start",
		size: size(value)
	});
}
function assertEndOffset(value, start, end) {
	if (typeof start === "number" && typeof end === "number" && size(value) !== end - start) throw new SliceOffsetOutOfBoundsError({
		offset: end,
		position: "end",
		size: size(value)
	});
}
/**
* @description Returns a section of the byte array given a start/end bytes offset.
*
* @param value The byte array to slice.
* @param start The start offset (in bytes).
* @param end The end offset (in bytes).
*/
function sliceBytes(value_, start, end, { strict } = {}) {
	assertStartOffset(value_, start);
	const value = value_.slice(start, end);
	if (strict) assertEndOffset(value, start, end);
	return value;
}
/**
* @description Returns a section of the hex value given a start/end bytes offset.
*
* @param value The hex value to slice.
* @param start The start offset (in bytes).
* @param end The end offset (in bytes).
*/
function sliceHex(value_, start, end, { strict } = {}) {
	assertStartOffset(value_, start);
	const value = `0x${value_.replace("0x", "").slice((start ?? 0) * 2, (end ?? value_.length) * 2)}`;
	if (strict) assertEndOffset(value, start, end);
	return value;
}
//#endregion
//#region node_modules/viem/_esm/utils/regex.js
var integerRegex = /^(u?int)(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/;
//#endregion
//#region node_modules/viem/_esm/utils/abi/encodeAbiParameters.js
/**
* @description Encodes a list of primitive values into an ABI-encoded hex value.
*
* - Docs: https://viem.sh/docs/abi/encodeAbiParameters#encodeabiparameters
*
*   Generates ABI encoded data using the [ABI specification](https://docs.soliditylang.org/en/latest/abi-spec), given a set of ABI parameters (inputs/outputs) and their corresponding values.
*
* @param params - a set of ABI Parameters (params), that can be in the shape of the inputs or outputs attribute of an ABI Item.
* @param values - a set of values (values) that correspond to the given params.
* @example
* ```typescript
* import { encodeAbiParameters } from 'viem'
*
* const encodedData = encodeAbiParameters(
*   [
*     { name: 'x', type: 'string' },
*     { name: 'y', type: 'uint' },
*     { name: 'z', type: 'bool' }
*   ],
*   ['wagmi', 420n, true]
* )
* ```
*
* You can also pass in Human Readable parameters with the parseAbiParameters utility.
*
* @example
* ```typescript
* import { encodeAbiParameters, parseAbiParameters } from 'viem'
*
* const encodedData = encodeAbiParameters(
*   parseAbiParameters('string x, uint y, bool z'),
*   ['wagmi', 420n, true]
* )
* ```
*/
function encodeAbiParameters(params, values) {
	if (params.length !== values.length) throw new AbiEncodingLengthMismatchError({
		expectedLength: params.length,
		givenLength: values.length
	});
	return encodeParams(prepareParams({
		params,
		values
	}));
}
function prepareParams({ params, values }) {
	const preparedParams = [];
	for (let i = 0; i < params.length; i++) preparedParams.push(prepareParam({
		param: params[i],
		value: values[i]
	}));
	return preparedParams;
}
function prepareParam({ param, value }) {
	const arrayComponents = getArrayComponents(param.type);
	if (arrayComponents) {
		const [length, type] = arrayComponents;
		return encodeArray(value, {
			length,
			param: {
				...param,
				type
			}
		});
	}
	if (param.type === "tuple") return encodeTuple(value, { param });
	if (param.type === "address") return encodeAddress(value);
	if (param.type === "bool") return encodeBool(value);
	if (param.type.startsWith("uint") || param.type.startsWith("int")) {
		const signed = param.type.startsWith("int");
		const [, , size = "256"] = integerRegex.exec(param.type) ?? [];
		return encodeNumber(value, {
			signed,
			size: Number(size)
		});
	}
	if (param.type.startsWith("bytes")) return encodeBytes(value, { param });
	if (param.type === "string") return encodeString(value);
	throw new InvalidAbiEncodingTypeError(param.type, { docsPath: "/docs/contract/encodeAbiParameters" });
}
function encodeParams(preparedParams) {
	let staticSize = 0;
	for (let i = 0; i < preparedParams.length; i++) {
		const { dynamic, encoded } = preparedParams[i];
		if (dynamic) staticSize += 32;
		else staticSize += size(encoded);
	}
	const staticParams = [];
	const dynamicParams = [];
	let dynamicSize = 0;
	for (let i = 0; i < preparedParams.length; i++) {
		const { dynamic, encoded } = preparedParams[i];
		if (dynamic) {
			staticParams.push(numberToHex(staticSize + dynamicSize, { size: 32 }));
			dynamicParams.push(encoded);
			dynamicSize += size(encoded);
		} else staticParams.push(encoded);
	}
	return concatHex([...staticParams, ...dynamicParams]);
}
function encodeAddress(value) {
	if (!isAddress(value)) throw new InvalidAddressError({ address: value });
	return {
		dynamic: false,
		encoded: padHex(value.toLowerCase())
	};
}
function encodeArray(value, { length, param }) {
	const dynamic = length === null;
	if (!Array.isArray(value)) throw new InvalidArrayError(value);
	if (!dynamic && value.length !== length) throw new AbiEncodingArrayLengthMismatchError({
		expectedLength: length,
		givenLength: value.length,
		type: `${param.type}[${length}]`
	});
	let dynamicChild = value.length === 0 && isDynamicType(param);
	const preparedParams = [];
	for (let i = 0; i < value.length; i++) {
		const preparedParam = prepareParam({
			param,
			value: value[i]
		});
		if (preparedParam.dynamic) dynamicChild = true;
		preparedParams.push(preparedParam);
	}
	if (dynamic || dynamicChild) {
		const data = encodeParams(preparedParams);
		if (dynamic) return {
			dynamic: true,
			encoded: concatHex([numberToHex(preparedParams.length, { size: 32 }), data])
		};
		if (dynamicChild) return {
			dynamic: true,
			encoded: data
		};
	}
	return {
		dynamic: false,
		encoded: concatHex(preparedParams.map(({ encoded }) => encoded))
	};
}
function encodeBytes(value, { param }) {
	const [, paramSize] = param.type.split("bytes");
	const bytesSize = size(value);
	if (!paramSize) {
		let value_ = value;
		if (bytesSize % 32 !== 0) value_ = padHex(value_, {
			dir: "right",
			size: Math.ceil((value.length - 2) / 2 / 32) * 32
		});
		return {
			dynamic: true,
			encoded: concatHex([padHex(numberToHex(bytesSize, { size: 32 })), value_])
		};
	}
	if (bytesSize !== Number.parseInt(paramSize, 10)) throw new AbiEncodingBytesSizeMismatchError({
		expectedSize: Number.parseInt(paramSize, 10),
		value
	});
	return {
		dynamic: false,
		encoded: padHex(value, { dir: "right" })
	};
}
function encodeBool(value) {
	if (typeof value !== "boolean") throw new BaseError(`Invalid boolean value: "${value}" (type: ${typeof value}). Expected: \`true\` or \`false\`.`);
	return {
		dynamic: false,
		encoded: padHex(boolToHex(value))
	};
}
function encodeNumber(value, { signed, size = 256 }) {
	if (typeof size === "number") {
		const max = 2n ** (BigInt(size) - (signed ? 1n : 0n)) - 1n;
		const min = signed ? -max - 1n : 0n;
		if (value > max || value < min) throw new IntegerOutOfRangeError({
			max: max.toString(),
			min: min.toString(),
			signed,
			size: size / 8,
			value: value.toString()
		});
	}
	return {
		dynamic: false,
		encoded: numberToHex(value, {
			size: 32,
			signed
		})
	};
}
function encodeString(value) {
	const hexValue = stringToHex(value);
	const partsLength = Math.ceil(size(hexValue) / 32);
	const parts = [];
	for (let i = 0; i < partsLength; i++) parts.push(padHex(slice(hexValue, i * 32, (i + 1) * 32), { dir: "right" }));
	return {
		dynamic: true,
		encoded: concatHex([padHex(numberToHex(size(hexValue), { size: 32 })), ...parts])
	};
}
function encodeTuple(value, { param }) {
	let dynamic = false;
	const preparedParams = [];
	for (let i = 0; i < param.components.length; i++) {
		const param_ = param.components[i];
		const preparedParam = prepareParam({
			param: param_,
			value: value[Array.isArray(value) ? i : param_.name]
		});
		preparedParams.push(preparedParam);
		if (preparedParam.dynamic) dynamic = true;
	}
	return {
		dynamic,
		encoded: dynamic ? encodeParams(preparedParams) : concatHex(preparedParams.map(({ encoded }) => encoded))
	};
}
function getArrayComponents(type) {
	const matches = type.match(/^(.*)\[(\d+)?\]$/);
	return matches ? [matches[2] ? Number(matches[2]) : null, matches[1]] : void 0;
}
function isDynamicType(param) {
	const { type } = param;
	if (type === "string") return true;
	if (type === "bytes") return true;
	if (type.endsWith("[]")) return true;
	if (type === "tuple") return param.components.some(isDynamicType);
	const arrayComponents = getArrayComponents(type);
	if (arrayComponents) return isDynamicType({
		...param,
		type: arrayComponents[1]
	});
	return false;
}
//#endregion
//#region node_modules/viem/_esm/utils/hash/toFunctionSelector.js
/**
* Returns the function selector for a given function definition.
*
* @example
* const selector = toFunctionSelector('function ownerOf(uint256 tokenId)')
* // 0x6352211e
*/
var toFunctionSelector = (fn) => slice(toSignatureHash(fn), 0, 4);
//#endregion
//#region node_modules/viem/_esm/utils/abi/getAbiItem.js
function getAbiItem(parameters) {
	const { abi, args = [], name } = parameters;
	const isSelector = isHex(name, { strict: false });
	const abiItems = abi.filter((abiItem) => {
		if (isSelector) {
			if (abiItem.type === "function") return toFunctionSelector(abiItem) === name;
			if (abiItem.type === "event") return toEventSelector(abiItem) === name;
			return false;
		}
		return "name" in abiItem && abiItem.name === name;
	});
	if (abiItems.length === 0) return void 0;
	if (abiItems.length === 1) return abiItems[0];
	let matchedAbiItem;
	for (const abiItem of abiItems) {
		if (!("inputs" in abiItem)) continue;
		if (!args || args.length === 0) {
			if (!abiItem.inputs || abiItem.inputs.length === 0) return abiItem;
			continue;
		}
		if (!abiItem.inputs) continue;
		if (abiItem.inputs.length === 0) continue;
		if (abiItem.inputs.length !== args.length) continue;
		if (args.every((arg, index) => {
			const abiParameter = "inputs" in abiItem && abiItem.inputs[index];
			if (!abiParameter) return false;
			return isArgOfType(arg, abiParameter);
		})) {
			if (matchedAbiItem && "inputs" in matchedAbiItem && matchedAbiItem.inputs) {
				const ambiguousTypes = getAmbiguousTypes(abiItem.inputs, matchedAbiItem.inputs, args);
				if (ambiguousTypes) throw new AbiItemAmbiguityError({
					abiItem,
					type: ambiguousTypes[0]
				}, {
					abiItem: matchedAbiItem,
					type: ambiguousTypes[1]
				});
			}
			matchedAbiItem = abiItem;
		}
	}
	if (matchedAbiItem) return matchedAbiItem;
	return abiItems[0];
}
/** @internal */
function isArgOfType(arg, abiParameter) {
	const argType = typeof arg;
	const abiParameterType = abiParameter.type;
	switch (abiParameterType) {
		case "address": return isAddress(arg, { strict: false });
		case "bool": return argType === "boolean";
		case "function": return argType === "string";
		case "string": return argType === "string";
		default:
			if (abiParameterType === "tuple" && "components" in abiParameter) return Object.values(abiParameter.components).every((component, index) => {
				return argType === "object" && isArgOfType(Object.values(arg)[index], component);
			});
			if (/^u?int(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/.test(abiParameterType)) return argType === "number" || argType === "bigint";
			if (/^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/.test(abiParameterType)) return argType === "string" || arg instanceof Uint8Array;
			if (/[a-z]+[1-9]{0,3}(\[[0-9]{0,}\])+$/.test(abiParameterType)) return Array.isArray(arg) && arg.every((x) => isArgOfType(x, {
				...abiParameter,
				type: abiParameterType.replace(/(\[[0-9]{0,}\])$/, "")
			}));
			return false;
	}
}
/** @internal */
function getAmbiguousTypes(sourceParameters, targetParameters, args) {
	for (const parameterIndex in sourceParameters) {
		const sourceParameter = sourceParameters[parameterIndex];
		const targetParameter = targetParameters[parameterIndex];
		if (sourceParameter.type === "tuple" && targetParameter.type === "tuple" && "components" in sourceParameter && "components" in targetParameter) return getAmbiguousTypes(sourceParameter.components, targetParameter.components, args[parameterIndex]);
		const types = [sourceParameter.type, targetParameter.type];
		if ((() => {
			if (types.includes("address") && types.includes("bytes20")) return true;
			if (types.includes("address") && types.includes("string")) return isAddress(args[parameterIndex], { strict: false });
			if (types.includes("address") && types.includes("bytes")) return isAddress(args[parameterIndex], { strict: false });
			return false;
		})()) return types;
	}
}
//#endregion
//#region node_modules/viem/_esm/utils/abi/prepareEncodeFunctionData.js
var docsPath$3 = "/docs/contract/encodeFunctionData";
function prepareEncodeFunctionData(parameters) {
	const { abi, args, functionName } = parameters;
	let abiItem = abi[0];
	if (functionName) {
		const item = getAbiItem({
			abi,
			args,
			name: functionName
		});
		if (!item) throw new AbiFunctionNotFoundError(functionName, { docsPath: docsPath$3 });
		abiItem = item;
	}
	if (abiItem.type !== "function") throw new AbiFunctionNotFoundError(void 0, { docsPath: docsPath$3 });
	return {
		abi: [abiItem],
		functionName: toFunctionSelector(formatAbiItem(abiItem))
	};
}
//#endregion
//#region node_modules/viem/_esm/utils/abi/encodeFunctionData.js
function encodeFunctionData(parameters) {
	const { args } = parameters;
	const { abi, functionName } = (() => {
		if (parameters.abi.length === 1 && parameters.functionName?.startsWith("0x")) return parameters;
		return prepareEncodeFunctionData(parameters);
	})();
	const abiItem = abi[0];
	return concatHex([functionName, ("inputs" in abiItem && abiItem.inputs ? encodeAbiParameters(abiItem.inputs, args ?? []) : void 0) ?? "0x"]);
}
//#endregion
//#region node_modules/viem/_esm/errors/cursor.js
var NegativeOffsetError = class extends BaseError {
	constructor({ offset }) {
		super(`Offset \`${offset}\` cannot be negative.`, { name: "NegativeOffsetError" });
	}
};
var PositionOutOfBoundsError = class extends BaseError {
	constructor({ length, position }) {
		super(`Position \`${position}\` is out of bounds (\`0 < position < ${length}\`).`, { name: "PositionOutOfBoundsError" });
	}
};
var RecursiveReadLimitExceededError = class extends BaseError {
	constructor({ count, limit }) {
		super(`Recursive read limit of \`${limit}\` exceeded (recursive read count: \`${count}\`).`, { name: "RecursiveReadLimitExceededError" });
	}
};
//#endregion
//#region node_modules/viem/_esm/utils/cursor.js
var staticCursor = {
	bytes: /* @__PURE__ */ new Uint8Array(),
	dataView: /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(0)),
	position: 0,
	positionReadCount: /* @__PURE__ */ new Map(),
	recursiveReadCount: 0,
	recursiveReadLimit: Number.POSITIVE_INFINITY,
	assertReadLimit() {
		if (this.recursiveReadCount >= this.recursiveReadLimit) throw new RecursiveReadLimitExceededError({
			count: this.recursiveReadCount + 1,
			limit: this.recursiveReadLimit
		});
	},
	assertPosition(position) {
		if (position < 0 || position > this.bytes.length - 1) throw new PositionOutOfBoundsError({
			length: this.bytes.length,
			position
		});
	},
	decrementPosition(offset) {
		if (offset < 0) throw new NegativeOffsetError({ offset });
		const position = this.position - offset;
		this.assertPosition(position);
		this.position = position;
	},
	getReadCount(position) {
		return this.positionReadCount.get(position || this.position) || 0;
	},
	incrementPosition(offset) {
		if (offset < 0) throw new NegativeOffsetError({ offset });
		const position = this.position + offset;
		this.assertPosition(position);
		this.position = position;
	},
	inspectByte(position_) {
		const position = position_ ?? this.position;
		this.assertPosition(position);
		return this.bytes[position];
	},
	inspectBytes(length, position_) {
		const position = position_ ?? this.position;
		this.assertPosition(position + length - 1);
		return this.bytes.subarray(position, position + length);
	},
	inspectUint8(position_) {
		const position = position_ ?? this.position;
		this.assertPosition(position);
		return this.bytes[position];
	},
	inspectUint16(position_) {
		const position = position_ ?? this.position;
		this.assertPosition(position + 1);
		return this.dataView.getUint16(position);
	},
	inspectUint24(position_) {
		const position = position_ ?? this.position;
		this.assertPosition(position + 2);
		return (this.dataView.getUint16(position) << 8) + this.dataView.getUint8(position + 2);
	},
	inspectUint32(position_) {
		const position = position_ ?? this.position;
		this.assertPosition(position + 3);
		return this.dataView.getUint32(position);
	},
	pushByte(byte) {
		this.assertPosition(this.position);
		this.bytes[this.position] = byte;
		this.position++;
	},
	pushBytes(bytes) {
		this.assertPosition(this.position + bytes.length - 1);
		this.bytes.set(bytes, this.position);
		this.position += bytes.length;
	},
	pushUint8(value) {
		this.assertPosition(this.position);
		this.bytes[this.position] = value;
		this.position++;
	},
	pushUint16(value) {
		this.assertPosition(this.position + 1);
		this.dataView.setUint16(this.position, value);
		this.position += 2;
	},
	pushUint24(value) {
		this.assertPosition(this.position + 2);
		this.dataView.setUint16(this.position, value >> 8);
		this.dataView.setUint8(this.position + 2, value & 255);
		this.position += 3;
	},
	pushUint32(value) {
		this.assertPosition(this.position + 3);
		this.dataView.setUint32(this.position, value);
		this.position += 4;
	},
	readByte() {
		this.assertReadLimit();
		this._touch();
		const value = this.inspectByte();
		this.position++;
		return value;
	},
	readBytes(length, size) {
		this.assertReadLimit();
		this._touch();
		const value = this.inspectBytes(length);
		this.position += size ?? length;
		return value;
	},
	readUint8() {
		this.assertReadLimit();
		this._touch();
		const value = this.inspectUint8();
		this.position += 1;
		return value;
	},
	readUint16() {
		this.assertReadLimit();
		this._touch();
		const value = this.inspectUint16();
		this.position += 2;
		return value;
	},
	readUint24() {
		this.assertReadLimit();
		this._touch();
		const value = this.inspectUint24();
		this.position += 3;
		return value;
	},
	readUint32() {
		this.assertReadLimit();
		this._touch();
		const value = this.inspectUint32();
		this.position += 4;
		return value;
	},
	get remaining() {
		return this.bytes.length - this.position;
	},
	setPosition(position) {
		const oldPosition = this.position;
		this.assertPosition(position);
		this.position = position;
		return () => this.position = oldPosition;
	},
	_touch() {
		if (this.recursiveReadLimit === Number.POSITIVE_INFINITY) return;
		const count = this.getReadCount();
		this.positionReadCount.set(this.position, count + 1);
		if (count > 0) this.recursiveReadCount++;
	}
};
function createCursor(bytes, { recursiveReadLimit = 8192 } = {}) {
	const cursor = Object.create(staticCursor);
	cursor.bytes = bytes;
	cursor.dataView = new DataView(bytes.buffer ?? bytes, bytes.byteOffset, bytes.byteLength);
	cursor.positionReadCount = /* @__PURE__ */ new Map();
	cursor.recursiveReadLimit = recursiveReadLimit;
	return cursor;
}
//#endregion
//#region node_modules/viem/_esm/utils/encoding/fromBytes.js
/**
* Decodes a byte array into a bigint.
*
* - Docs: https://viem.sh/docs/utilities/fromBytes#bytestobigint
*
* @param bytes Byte array to decode.
* @param opts Options.
* @returns BigInt value.
*
* @example
* import { bytesToBigInt } from 'viem'
* const data = bytesToBigInt(new Uint8Array([1, 164]))
* // 420n
*/
function bytesToBigInt(bytes, opts = {}) {
	if (typeof opts.size !== "undefined") assertSize(bytes, { size: opts.size });
	return hexToBigInt(bytesToHex(bytes), opts);
}
/**
* Decodes a byte array into a boolean.
*
* - Docs: https://viem.sh/docs/utilities/fromBytes#bytestobool
*
* @param bytes Byte array to decode.
* @param opts Options.
* @returns Boolean value.
*
* @example
* import { bytesToBool } from 'viem'
* const data = bytesToBool(new Uint8Array([1]))
* // true
*/
function bytesToBool(bytes_, opts = {}) {
	let bytes = bytes_;
	if (typeof opts.size !== "undefined") {
		assertSize(bytes, { size: opts.size });
		bytes = trim(bytes);
	}
	if (bytes.length > 1 || bytes[0] > 1) throw new InvalidBytesBooleanError(bytes);
	return Boolean(bytes[0]);
}
/**
* Decodes a byte array into a number.
*
* - Docs: https://viem.sh/docs/utilities/fromBytes#bytestonumber
*
* @param bytes Byte array to decode.
* @param opts Options.
* @returns Number value.
*
* @example
* import { bytesToNumber } from 'viem'
* const data = bytesToNumber(new Uint8Array([1, 164]))
* // 420
*/
function bytesToNumber(bytes, opts = {}) {
	if (typeof opts.size !== "undefined") assertSize(bytes, { size: opts.size });
	return hexToNumber(bytesToHex(bytes), opts);
}
/**
* Decodes a byte array into a UTF-8 string.
*
* - Docs: https://viem.sh/docs/utilities/fromBytes#bytestostring
*
* @param bytes Byte array to decode.
* @param opts Options.
* @returns String value.
*
* @example
* import { bytesToString } from 'viem'
* const data = bytesToString(new Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33]))
* // 'Hello world'
*/
function bytesToString(bytes_, opts = {}) {
	let bytes = bytes_;
	if (typeof opts.size !== "undefined") {
		assertSize(bytes, { size: opts.size });
		bytes = trim(bytes, { dir: "right" });
	}
	return new TextDecoder().decode(bytes);
}
//#endregion
//#region node_modules/viem/_esm/utils/abi/decodeAbiParameters.js
function decodeAbiParameters(params, data) {
	const bytes = typeof data === "string" ? hexToBytes(data) : data;
	const cursor = createCursor(bytes);
	if (size(bytes) === 0 && params.length > 0) throw new AbiDecodingZeroDataError();
	if (size(data) && size(data) < 32) throw new AbiDecodingDataSizeTooSmallError({
		data: typeof data === "string" ? data : bytesToHex(data),
		params,
		size: size(data)
	});
	let consumed = 0;
	const values = [];
	for (let i = 0; i < params.length; ++i) {
		const param = params[i];
		if (consumed < bytes.length) cursor.setPosition(consumed);
		const [data, consumed_] = decodeParameter(cursor, param, { staticPosition: 0 });
		consumed += consumed_;
		values.push(data);
	}
	return values;
}
function decodeParameter(cursor, param, { staticPosition }) {
	const arrayComponents = getArrayComponents(param.type);
	if (arrayComponents) {
		const [length, type] = arrayComponents;
		return decodeArray(cursor, {
			...param,
			type
		}, {
			length,
			staticPosition
		});
	}
	if (param.type === "tuple") return decodeTuple(cursor, param, { staticPosition });
	if (param.type === "address") return decodeAddress(cursor);
	if (param.type === "bool") return decodeBool(cursor);
	if (param.type.startsWith("bytes")) return decodeBytes(cursor, param, { staticPosition });
	if (param.type.startsWith("uint") || param.type.startsWith("int")) return decodeNumber(cursor, param);
	if (param.type === "string") return decodeString(cursor, { staticPosition });
	throw new InvalidAbiDecodingTypeError(param.type, { docsPath: "/docs/contract/decodeAbiParameters" });
}
var sizeOfLength = 32;
var sizeOfOffset = 32;
function decodeAddress(cursor) {
	return [checksumAddress(bytesToHex(sliceBytes(cursor.readBytes(32), -20))), 32];
}
function decodeArray(cursor, param, { length, staticPosition }) {
	if (length === null) {
		const start = staticPosition + bytesToNumber(cursor.readBytes(sizeOfOffset));
		const startOfData = start + sizeOfLength;
		cursor.setPosition(start);
		const length = bytesToNumber(cursor.readBytes(sizeOfLength));
		const dynamicChild = hasDynamicChild(param);
		let consumed = 0;
		const value = [];
		for (let i = 0; i < length; ++i) {
			cursor.setPosition(startOfData + (dynamicChild ? i * 32 : consumed));
			const [data, consumed_] = decodeParameter(cursor, param, { staticPosition: startOfData });
			consumed += consumed_;
			value.push(data);
			if (consumed_ === 0) {
				cursor.assertReadLimit();
				cursor._touch();
			}
		}
		cursor.setPosition(staticPosition + 32);
		return [value, 32];
	}
	if (hasDynamicChild(param)) {
		const start = staticPosition + bytesToNumber(cursor.readBytes(sizeOfOffset));
		const value = [];
		for (let i = 0; i < length; ++i) {
			cursor.setPosition(start + i * 32);
			const [data] = decodeParameter(cursor, param, { staticPosition: start });
			value.push(data);
		}
		cursor.setPosition(staticPosition + 32);
		return [value, 32];
	}
	let consumed = 0;
	const value = [];
	for (let i = 0; i < length; ++i) {
		const [data, consumed_] = decodeParameter(cursor, param, { staticPosition: staticPosition + consumed });
		consumed += consumed_;
		value.push(data);
		if (consumed_ === 0) {
			cursor.assertReadLimit();
			cursor._touch();
		}
	}
	return [value, consumed];
}
function decodeBool(cursor) {
	return [bytesToBool(cursor.readBytes(32), { size: 32 }), 32];
}
function decodeBytes(cursor, param, { staticPosition }) {
	const [_, size] = param.type.split("bytes");
	if (!size) {
		const offset = bytesToNumber(cursor.readBytes(32));
		cursor.setPosition(staticPosition + offset);
		const length = bytesToNumber(cursor.readBytes(32));
		if (length === 0) {
			cursor.setPosition(staticPosition + 32);
			return ["0x", 32];
		}
		const data = cursor.readBytes(length);
		cursor.setPosition(staticPosition + 32);
		return [bytesToHex(data), 32];
	}
	return [bytesToHex(cursor.readBytes(Number.parseInt(size, 10), 32)), 32];
}
function decodeNumber(cursor, param) {
	const signed = param.type.startsWith("int");
	const size = Number.parseInt(param.type.split("int")[1] || "256", 10);
	const value = cursor.readBytes(32);
	return [size > 48 ? bytesToBigInt(value, { signed }) : bytesToNumber(value, { signed }), 32];
}
function decodeTuple(cursor, param, { staticPosition }) {
	const hasUnnamedChild = param.components.length === 0 || param.components.some(({ name }) => !name);
	const value = hasUnnamedChild ? [] : {};
	let consumed = 0;
	if (hasDynamicChild(param)) {
		const start = staticPosition + bytesToNumber(cursor.readBytes(sizeOfOffset));
		for (let i = 0; i < param.components.length; ++i) {
			const component = param.components[i];
			cursor.setPosition(start + consumed);
			const [data, consumed_] = decodeParameter(cursor, component, { staticPosition: start });
			consumed += consumed_;
			value[hasUnnamedChild ? i : component?.name] = data;
		}
		cursor.setPosition(staticPosition + 32);
		return [value, 32];
	}
	for (let i = 0; i < param.components.length; ++i) {
		const component = param.components[i];
		const [data, consumed_] = decodeParameter(cursor, component, { staticPosition });
		value[hasUnnamedChild ? i : component?.name] = data;
		consumed += consumed_;
	}
	return [value, consumed];
}
function decodeString(cursor, { staticPosition }) {
	const start = staticPosition + bytesToNumber(cursor.readBytes(32));
	cursor.setPosition(start);
	const length = bytesToNumber(cursor.readBytes(32));
	if (length === 0) {
		cursor.setPosition(staticPosition + 32);
		return ["", 32];
	}
	const value = bytesToString(cursor.readBytes(length, 32));
	cursor.setPosition(staticPosition + 32);
	return [value, 32];
}
function hasDynamicChild(param) {
	const { type } = param;
	if (type === "string") return true;
	if (type === "bytes") return true;
	if (type.endsWith("[]")) return true;
	if (type === "tuple") return param.components?.some(hasDynamicChild);
	const arrayComponents = getArrayComponents(param.type);
	if (arrayComponents && hasDynamicChild({
		...param,
		type: arrayComponents[1]
	})) return true;
	return false;
}
//#endregion
//#region node_modules/viem/_esm/utils/abi/decodeEventLog.js
var docsPath$2 = "/docs/contract/decodeEventLog";
function decodeEventLog(parameters) {
	const { abi, data, strict: strict_, topics } = parameters;
	const strict = strict_ ?? true;
	const [signature, ...argTopics] = topics;
	if (!signature) throw new AbiEventSignatureEmptyTopicsError({ docsPath: docsPath$2 });
	const abiItem = abi.find((x) => x.type === "event" && signature === toEventSelector(formatAbiItem(x)));
	if (!(abiItem && "name" in abiItem) || abiItem.type !== "event") throw new AbiEventSignatureNotFoundError(signature, { docsPath: docsPath$2 });
	const { name, inputs } = abiItem;
	const isUnnamed = inputs?.some((x) => !("name" in x && x.name));
	const args = isUnnamed ? [] : {};
	const indexedInputs = inputs.map((x, i) => [x, i]).filter(([x]) => "indexed" in x && x.indexed);
	const missingIndexedInputs = [];
	for (let i = 0; i < indexedInputs.length; i++) {
		const [param, argIndex] = indexedInputs[i];
		const topic = argTopics[i];
		if (!topic) {
			if (strict) throw new DecodeLogTopicsMismatch({
				abiItem,
				param
			});
			missingIndexedInputs.push([param, argIndex]);
			continue;
		}
		args[isUnnamed ? argIndex : param.name || argIndex] = decodeTopic({
			param,
			value: topic
		});
	}
	const nonIndexedInputs = inputs.filter((x) => !("indexed" in x && x.indexed));
	const inputsToDecode = strict ? nonIndexedInputs : [...missingIndexedInputs.map(([param]) => param), ...nonIndexedInputs];
	if (inputsToDecode.length > 0) {
		if (data && data !== "0x") try {
			const decodedData = decodeAbiParameters(inputsToDecode, data);
			if (decodedData) {
				let dataIndex = 0;
				if (!strict) for (const [param, argIndex] of missingIndexedInputs) args[isUnnamed ? argIndex : param.name || argIndex] = decodedData[dataIndex++];
				if (isUnnamed) {
					for (let i = 0; i < inputs.length; i++) if (args[i] === void 0 && dataIndex < decodedData.length) args[i] = decodedData[dataIndex++];
				} else for (let i = 0; i < nonIndexedInputs.length; i++) args[nonIndexedInputs[i].name] = decodedData[dataIndex++];
			}
		} catch (err) {
			if (strict) {
				if (err instanceof AbiDecodingDataSizeTooSmallError || err instanceof PositionOutOfBoundsError) throw new DecodeLogDataMismatch({
					abiItem,
					data,
					params: inputsToDecode,
					size: size(data)
				});
				throw err;
			}
		}
		else if (strict) throw new DecodeLogDataMismatch({
			abiItem,
			data: "0x",
			params: inputsToDecode,
			size: 0
		});
	}
	return {
		eventName: name,
		args: Object.values(args).length > 0 ? args : void 0
	};
}
function decodeTopic({ param, value }) {
	if (param.type === "string" || param.type === "bytes" || param.type === "tuple" || param.type.match(/^(.*)\[(\d+)?\]$/)) return value;
	return (decodeAbiParameters([param], value) || [])[0];
}
//#endregion
//#region node_modules/viem/_esm/utils/abi/decodeFunctionResult.js
var docsPath$1 = "/docs/contract/decodeFunctionResult";
function decodeFunctionResult(parameters) {
	const { abi, args, functionName, data } = parameters;
	let abiItem = abi[0];
	if (functionName) {
		const item = getAbiItem({
			abi,
			args,
			name: functionName
		});
		if (!item) throw new AbiFunctionNotFoundError(functionName, { docsPath: docsPath$1 });
		abiItem = item;
	}
	if (abiItem.type !== "function") throw new AbiFunctionNotFoundError(void 0, { docsPath: docsPath$1 });
	if (!abiItem.outputs) throw new AbiFunctionOutputsNotFoundError(abiItem.name, { docsPath: docsPath$1 });
	const values = decodeAbiParameters(abiItem.outputs, data);
	if (values && values.length > 1) return values;
	if (values && values.length === 1) return values[0];
}
//#endregion
//#region node_modules/viem/_esm/utils/abi/encodeDeployData.js
var docsPath = "/docs/contract/encodeDeployData";
function encodeDeployData(parameters) {
	const { abi, args, bytecode } = parameters;
	if (!args || args.length === 0) return bytecode;
	const description = abi.find((x) => "type" in x && x.type === "constructor");
	if (!description) throw new AbiConstructorNotFoundError({ docsPath });
	if (!("inputs" in description)) throw new AbiConstructorParamsNotFoundError({ docsPath });
	if (!description.inputs || description.inputs.length === 0) throw new AbiConstructorParamsNotFoundError({ docsPath });
	return concatHex([bytecode, encodeAbiParameters(description.inputs, args)]);
}
//#endregion
export { toHex as a, encodeFunctionData as i, decodeFunctionResult as n, decodeEventLog as r, encodeDeployData as t };
