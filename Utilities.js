export function accumulatedAverage(averageToDate = 0, sampleSize = 0) {
	var runningTotal = averageToDate * (sampleSize || 1);
	var currentSampleSize = sampleSize;
	return (newValue, newAverage, newSampleSize) => {
		currentSampleSize = newSampleSize || currentSampleSize + 1;
		runningTotal =
			(newAverage && newSampleSize
				? newAverage * (newSampleSize - 1)
				: runningTotal) + newValue;
		return runningTotal / currentSampleSize;
	};
}

export function clampRange(min, max) {
	return value => Math.min(Math.max(value, min), max);
}
export function normaliseRange(start, end) {
	return value => (value - start) / (end - start);
}
export function liniarInterpolate(start, end) {
	return factor => start * (1 - factor) + end * factor;
}
export function mapRanges(fromMin, fromMax, toMin, toMax) {
	var norlaise = normaliseRange(fromMin, fromMax);
	var interpolate = liniarInterpolate(toMin, toMax);
	return value => interpolate(norlaise(value));
}

export function rangeBetween(max, min = 0, step = 1) {
	return [...Array((max - min) / step).keys()].map(
		index => index * step + min
	);
}

export const DATA_TYPES = {
	ARRAY: 'array',
	BIGINT: 'bigint',
	BOOLEAN: 'boolean',
	DATE: 'date',
	ERROR: 'error',
	MAP: 'map',
	NULL: 'null',
	NUMBER: 'number',
	OBJECT: 'object',
	REGEXP: 'regexp',
	SET: 'set',
	STRING: 'string',
	SYMBOL: 'symbol',
	UNDEFINED: 'undefined',
};

export function dataType(subject) {
	return Object.prototype.toString.call(subject).slice(8, -1).toLowerCase();
}

export function replaceArray(targetArray, arrayContent = []) {
	targetArray.splice(0, targetArray.length, ...arrayContent);
	return targetArray;
}

export function reconcileArrays(sourceArray, targetArray, objectKey = 'id') {
	const compareProperties = target => source =>
		source[objectKey] === target[objectKey];

	replaceArray(
		targetArray,
		sourceArray.map(sourceItem => {
			const targetItem = targetArray.find(compareProperties(sourceItem));
			return targetItem ? updateItem(sourceItem, targetItem) : sourceItem;
		})
	);

	function updateItem(source, target) {
		Object.entries(source).forEach(entry =>
			Array.isArray(entry[1])
				? replaceArray(target[entry[0]], entry[1])
				: (target[entry[0]] = entry[1])
		);
		return source;
	}
}

export function transposeArray(matrix) {
	return matrix.reduce(
		(_, row) => row.map((__, i) => [...(_[i] || []), row[i]]),
		[]
	);
}

export function groupBy(lookupFn, sourceArray) {
	return sourceArray
		? sourceArray.reduce(_groupBy, {})
		: groupBy.bind(null, lookupFn);
	function _groupBy(groupObj, obj) {
		const group = lookupFn(obj);
		return {
			...groupObj,
			[group]: [...(groupObj[group] ?? []), obj],
		};
	}
}

export function rangeFrom(init = 0, len = 1, step = 1) {
	var stepFn = (_, inc) =>
		(typeof step == 'number' ? step * inc : step(inc)) + init;
	return [...Array(len)].map(stepFn);
}

export function inRange(from, to) {
	if (arguments.length != 2)
		throw new SyntaxError(
			'overlappingRanges needs to be provided with two primary values.'
		);
	var aFrom = Math.min(from, to);
	var aTo = Math.max(from, to);
	return function check(from, to) {
		var xTo = arguments.length == 1 ? from : to;
		var bFrom = Math.min(from, xTo);
		var bTo = Math.max(from, xTo);
		return !(bTo < aFrom || bFrom > aTo);
	};
}
export function loopRange(max, min = 0) {
	return function move(cur, dir) {
		return ((cur + dir + max - min) % max) + min;
	};
}

export function intersectArrays(...arrays) {
	return arrays.reduce((arrAcc, arrN) =>
		[...new Set(arrAcc)].filter(item => arrN.includes(item))
	);
}
export function unionArrays(...arrays) {
	return [...new Set(arrays.flat())];
}

export function exercise(expected, actual, id = '') {
	var expectedResult = JSON.stringify(expected);
	var actualResult = JSON.stringify(actual);
	var exerId = id ? ` ${id}` : '';
	if (expectedResult == actualResult) {
		console.info(
			`%cEXERCISE${exerId} - Passed:	Expected (${expectedResult}), Received (${actualResult}).`,
			'color: green;'
		);
		return true;
	}
	console.info(
		`%cEXERCISE${exerId} - Failed:	Expected (${expectedResult}), Received (${actualResult}).`,
		'color: red;'
	);
	return false;
}

export function base64Encode(bin) {
	const BTOA = str => Buffer.from(str).toString('base64');
	return BTOA(
		encodeURIComponent(bin).replace(/%([\dA-F]{2})/g, (_, p1) =>
			String.fromCharCode(Number(`0x${p1}`))
		)
	);
}
export function base64Decode(b64) {
	return decodeURIComponent(
		[...b64.replace(/=*$/, '')]
			.map(char =>
				'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
					.indexOf(char)
					.toString(2)
					//@ts-ignore missing padStart method of String objects.
					.padStart(6, '0')
			)
			.join('')
			.match(/.{8}/g)
			.map(bin => `%${parseInt(bin, 2).toString(16).toUpperCase()}`)
			.join('')
	);
}

export function shortDay(lang = 'en-GB', idx) {
	var dateString = _ =>
		new Date(1970, 0, 4 + _).toLocaleString(lang, {
			weekday: 'short',
		});
	return arguments.length == 2 ? dateString(idx) : dateString;
}
export function longDay(lang = 'en-GB', idx) {
	var dateString = _ =>
		new Date(1970, 0, 4 + _).toLocaleString(lang, { weekday: 'long' });
	return arguments.length == 2 ? dateString(idx) : dateString;
}
export function shortMonth(lang = 'en-GB', idx) {
	var dateString = _ =>
		new Date(1970, _, 1).toLocaleString(lang, { month: 'short' });
	return arguments.length == 2 ? dateString(idx) : dateString;
}
export function longMonth(lang = 'en-GB', idx) {
	var dateString = _ =>
		new Date(1970, _, 1).toLocaleString(lang, { month: 'long' });
	return arguments.length == 2 ? dateString(idx) : dateString;
}

export function objectEquality(obj1, obj2) {
	return deepEquality(obj1, obj2);

	function deepEquality(object1, object2) {
		const keys1 = Object.keys(object1);
		const keys2 = Object.keys(object2);

		if (keys1.length !== keys2.length) {
			return false;
		}

		for (const key of keys1) {
			const val1 = object1[key];
			const val2 = object2[key];
			const areObjects = isObject(val1) && isObject(val2);
			if (
				(areObjects && !deepEquality(val1, val2)) ||
				(!areObjects && val1 !== val2)
			) {
				return false;
			}
		}
		return true;
	}

	function isObject(object) {
		return object != null && typeof object === 'object';
	}
}

export function cloneObject(obj) {
	if (obj === null || typeof obj !== 'object' || '__isActiveClone' in obj)
		return obj;

	let temp = obj instanceof Date ? new obj.constructor() : obj.constructor();

	for (let key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			obj['__isActiveClone'] = null;
			temp[key] = cloneObject(obj[key]);
			delete obj['__isActiveClone'];
		}
	}
	return temp;
}

export function duplicateObject(srcObj) {
	if (Array.isArray(srcObj)) {
		return srcObj.map(duplicateObject);
	}
	if (srcObj != null && typeof srcObj === 'object') {
		if (srcObj instanceof Date) {
			return new Date(srcObj.toISOString());
		}
		if (srcObj instanceof RegExp) {
			return new RegExp(srcObj.source, srcObj.flags);
		}
		return Object.entries(srcObj).reduce(
			(tgtObj, [propName, propValue]) => ({
				...tgtObj,
				[propName]: duplicateObject(propValue),
			}),
			{}
		);
	} else {
		return srcObj;
	}
}

export function compareObjectByProperty(propName, ascending = true) {
	return (objA, objB) =>
		(ascending ? 1 : -1) *
		(objA[propName] < objB[propName]
			? -1
			: 1 * (objA[propName] > objB[propName]));
}

export function extractProperty(...propertyNames) {
	return obj =>
		propertyNames.reduce(
			(o, p) => (o.hasOwnProperty(p) ? o[p] : null),
			obj
		);
}

export function consoleTable(arr) {
	function getHeading(row) {
		return Array.isArray(row)
			? row.map((_, idx) => `<th>${idx + 1}</th>`).join('')
			: typeof row === 'object'
			? Object.keys(row)
					.map(col => `<th>${col}</th>`)
					.join('')
			: `<th>Value</th>`;
	}
	function getData(row) {
		const htmlData = cell => `<td>${cell}</td>`;
		return Array.isArray(row)
			? row.map(htmlData).join('')
			: typeof row === 'object'
			? Object.values(row).map(htmlData).join('')
			: htmlData(row);
	}

	return arr.length
		? `<table border="1">
<tr><th>#</th>${getHeading(arr[0])}</tr>
${arr
	.map(
		(row, idx) => `<tr><td>${idx}</td>${getData(row)}</tr>
`
	)
	.join('')}</table>`
		: '';
}

export async function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export function memoize(fn, _cache = {}) {
	return (...args) =>
		(key => (_cache[key] = _cache[key] || fn(...args)))(
			JSON.stringify(args)
		);
}

export function curry(fn, ...args) {
	return args.length === fn.length
		? fn(...args)
		: (..._args) => curry(fn, ...args, ..._args);
}

export function lens(...props) {
	const _props = props
		.join('.')
		.split(/[\[\]?\.]+/)
		.filter(item => item !== '');
	return obj => _props.reduce((ob, pr) => ob?.[pr], obj);
}

export function compose(...functions) {
	return args => functions.reduce((arg, fn) => fn(arg), args);
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
		throw Error(
			'Error: E-NP The source argument supplied is not populated.'
		);

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
			throw Error(
				`Error: E-NB The option '${option}' is not a Boolean value.`
			);
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
