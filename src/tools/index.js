import { DATA_TYPES, dataType } from '../dataComparison/index.js';

export function compose(...functions) {
	return args => functions.reduce((arg, fn) => fn(arg), args);
}

export function copyText(text) {
	navigator.clipboard.writeText(text);
}

export function curry(fn, ...args) {
	return args.length === fn.length
		? fn(...args)
		: (..._args) => curry(fn, ...args, ..._args);
}

export function enumerate(source, options = {}) {
	if (dataType(source) !== DATA_TYPES.OBJECT && !Array.isArray(source)) {
		throw Error(
			'Error: E-IS The source argument supplied is not an Array or an Object.'
		);
	}
	const filterStringKeys = key => dataType(key) === DATA_TYPES.STRING;
	const keys = Array.isArray(source)
		? source.filter(filterStringKeys)
		: Object.keys(source);

	if (!keys.length) {
		throw Error(
			'Error: E-NS The source argument supplied is not populated with string keys.'
		);
	}
	const VALID_OPTIONS = ['constantProperties', 'numericValues'];
	for (const option in options) {
		if (!VALID_OPTIONS.includes(option)) {
			throw Error(
				`Error: E-NR The option '${option}' is not a recognised option.`
			);
		}
		if (dataType(options[option]) !== DATA_TYPES.BOOLEAN) {
			throw Error(`Error: E-NB The option '${option}' is not a Boolean value.`);
		}
	}
	const { numericValues = false, constantProperties = false } = options;

	return Object.freeze(
		keys.reduce(
			(obj, key, index) => ({
				...obj,
				[constantProperties ? toGlobal(key) : key]: numericValues ? index : key,
			}),
			{}
		)
	);

	function toGlobal(_propertyName) {
		const hasSpaces = /\s/.test(_propertyName);
		const globalPropertyName = hasSpaces
			? _propertyName.replace(/\s/g, '_')
			: _propertyName.replace(/([a-z])([A-Z])/g, '$1_$2');
		return globalPropertyName.toUpperCase();
	}
}

export function generateEnums(enumsJson, options) {
	return Object.entries(enumsJson).reduce((enums, [enumKey, enumVals]) => {
		enums[enumKey] = enumerate(enumVals, options);
		return enums;
	}, {});
}

export function lens(...props) {
	const _props = props
		.join('.')
		.split(/\]?\??\.\[?|\]?\[|\]/)
		.filter(item => item !== '');
	return obj => _props.reduce((ob, pr) => ob?.[pr], obj);
}

export function memoize(fn, _cache = new Map()) {
	return (...args) => {
		const key = JSON.stringify(args);
		return (_cache.has(key) ? _cache : _cache.set(key, fn(...args))).get(key);
	};
}

export function parseJson(jsonString, reviver) {
	try {
		return { data: JSON.parse(jsonString, reviver) };
	} catch (error) {
		return { error: error.message };
	}
}

export async function pasteText() {
	return await navigator.clipboard.readText();
}

export function regExpTemplate(regExpFlags = '') {
	return ({ raw }, ...values) =>
		RegExp(String.raw({ raw }, ...values).replaceAll(/\s+/g, ''), regExpFlags);
}

export function simd(instruction) {
	return function (...data) {
		const executions = data.map(
			datum => new Promise(resolve => resolve(instruction(datum)))
		);
		return Promise.allSettled(executions);
	};
}

export async function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export function stringifyJson(jsonObject, replacer, spaces) {
	try {
		return { data: JSON.stringify(jsonObject, replacer, spaces) };
	} catch (error) {
		return { error: error.message };
	}
}

export function escapeRegExp(pattern = '') {
	return pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function isRegExpPattern(pattern = '') {
	try {
		RegExp(pattern);
		return !!pattern.length;
	} catch {
		return false;
	}
}

export function regExpString({ raw }) {
	return String.raw({ raw });
}
