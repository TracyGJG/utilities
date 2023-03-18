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
	if (dataType(source) !== DATA_TYPES.OBJECT && !Array.isArray(source))
		throw Error(
			'Error: E-IS The source argument supplied is not an Array or an Object.'
		);

	const keysCount = Array.isArray(source)
		? source.length
		: Object.keys(source).length;

	if (!keysCount)
		throw Error('Error: E-NP The source argument supplied is not populated.');

	const filterStringKeys = key => dataType(key) === DATA_TYPES.STRING;
	const keys = (Array.isArray(source) ? source : Object.keys(source)).filter(
		filterStringKeys
	);

	if (!keys.length)
		throw Error(
			'Error: E-NS The source argument supplied is not populated with string keys.'
		);

	const VALID_OPTIONS = ['constantProperties', 'numericValues'];
	for (const option in options) {
		if (!VALID_OPTIONS.includes(option))
			throw Error(
				`Error: E-NR The option '${option}' is not a recognised option.`
			);
		if (dataType(options[option]) !== DATA_TYPES.BOOLEAN)
			throw Error(`Error: E-NB The option '${option}' is not a Boolean value.`);
	}

	const { numericValues = false, constantProperties = false } = options;

	return keys.reduce((obj, key, index) => {
		const propertyName = constantProperties ? toGlobal(key) : key;
		return { ...obj, [propertyName]: numericValues ? index : key };
	}, {});

	function toGlobal(_propertyName) {
		const hasSpaces = /\s/.test(_propertyName);
		const globalPropertyName = hasSpaces
			? _propertyName.replace(/\s/g, '_')
			: _propertyName.replace(/([a-z])([A-Z])/g, '$1_$2');
		return globalPropertyName.toUpperCase();
	}
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

export async function pasteText() {
	return await navigator.clipboard.readText();
}

export async function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
