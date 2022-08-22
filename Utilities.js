var IUtility = {
	accumulatedAverage,
	clampRange,
	normaliseRange,
	liniarInterpolate,
	mapRanges,
	rangeBetween,
	rangeFrom,
	inRange,
	loopRange,

	intersectArrays,
	unionArrays,
	replaceArray,
	reconcileArrays,
	transposeArray,

	base64Encode,
	base64Decode,
	shortDay,
	longDay,
	shortMonth,
	longMonth,

	objectEquality,
	cloneObject,
	duplicateObject,
	dataType,
	compareObjectByProperty,
	extractProperty,

	exercise,
	consoleTable: console_table,
	sleep,
	memoize,
	curry,
	lens,
	compose,
	enumerate,
};

export default IUtility;

function accumulatedAverage(averageToDate = 0, sampleSize = 0) {
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

function clampRange(min, max) {
	return value => Math.min(Math.max(value, min), max);
}
function normaliseRange(start, end) {
	return value => (value - start) / (end - start);
}
function liniarInterpolate(start, end) {
	return factor => start * (1 - factor) + end * factor;
}
function mapRanges(fromMin, fromMax, toMin, toMax) {
	var norlaise = normaliseRange(fromMin, fromMax);
	var interpolate = liniarInterpolate(toMin, toMax);
	return value => interpolate(norlaise(value));
}

function rangeBetween(max, min = 0, step = 1) {
	return [...Array((max - min) / step).keys()].map(index => index * step + min);
}

function dataType(subject) {
	return Object.prototype.toString.call(subject).slice(8, -1).toLowerCase();
}

function replaceArray(targetArray, arrayContent = []) {
	targetArray.splice(0, targetArray.length, ...arrayContent);
	return targetArray;
}

function reconcileArrays(sourceArray, targetArray, objectKey = 'id') {
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

function transposeArray(matrix) {
	return matrix.reduce(
		(_, row) => row.map((__, i) => [...(_[i] || []), row[i]]),
		[]
	);
}

function rangeFrom(init = 0, len = 1, step = 1) {
	var stepFn = (_, inc) =>
		(typeof step == 'number' ? step * inc : step(inc)) + init;
	return [...Array(len)].map(stepFn);
}

function inRange(from, to) {
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
function loopRange(max, min = 0) {
	return function move(cur, dir) {
		return ((cur + dir + max - min) % max) + min;
	};
}

function intersectArrays(...arrays) {
	return arrays.reduce((arrAcc, arrN) =>
		[...new Set(arrAcc)].filter(item => arrN.includes(item))
	);
}
function unionArrays(...arrays) {
	return [...new Set(arrays.flat())];
}

function exercise(expected, actual, id = '') {
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

function base64Encode(bin) {
	const BTOA = str => Buffer.from(str).toString('base64');
	return BTOA(
		encodeURIComponent(bin).replace(/%([\dA-F]{2})/g, (_, p1) =>
			String.fromCharCode(Number(`0x${p1}`))
		)
	);
}
function base64Decode(b64) {
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

function shortDay(lang = 'en-GB', idx) {
	var dateString = _ =>
		new Date(1970, 0, 4 + _).toLocaleString(lang, {
			weekday: 'short',
		});
	return arguments.length == 2 ? dateString(idx) : dateString;
}
function longDay(lang = 'en-GB', idx) {
	var dateString = _ =>
		new Date(1970, 0, 4 + _).toLocaleString(lang, { weekday: 'long' });
	return arguments.length == 2 ? dateString(idx) : dateString;
}
function shortMonth(lang = 'en-GB', idx) {
	var dateString = _ =>
		new Date(1970, _, 1).toLocaleString(lang, { month: 'short' });
	return arguments.length == 2 ? dateString(idx) : dateString;
}
function longMonth(lang = 'en-GB', idx) {
	var dateString = _ =>
		new Date(1970, _, 1).toLocaleString(lang, { month: 'long' });
	return arguments.length == 2 ? dateString(idx) : dateString;
}

function objectEquality(obj1, obj2) {
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

function cloneObject(obj) {
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

function duplicateObject(srcObj) {
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

function compareObjectByProperty(propName, ascending = true) {
	return (objA, objB) =>
		(ascending ? 1 : -1) *
		(objA[propName] < objB[propName]
			? -1
			: 1 * (objA[propName] > objB[propName]));
}

function extractProperty(...propertyNames) {
	return obj =>
		propertyNames.reduce((o, p) => (o.hasOwnProperty(p) ? o[p] : null), obj);
}

function console_table(arr, domNode) {
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

	domNode.innerHTML += arr.length
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

async function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function memoize(fn, _cache = {}) {
	return (...args) =>
		(key => (_cache[key] = _cache[key] || fn(...args)))(JSON.stringify(args));
}

function curry(fn, ...args) {
	return args.length === fn.length
		? fn(...args)
		: (..._args) => curry(fn, ...args, ..._args);
}

function lens(...props) {
	const _props = props
		.join('.')
		.split(/[\[\]?\.]+/)
		.filter(item => item !== '');
	return obj => _props.reduce((ob, pr) => ob?.[pr], obj);
}

function compose(...functions) {
	return args => functions.reduce((arg, fn) => fn(arg), args);
}

function enumerate(source = [], options = {}) {
	const { numericValues = false, constatntProperties = false } = options;

	return (Array.isArray(source) ? source : Object.keys(source)).reduce(
		(obj, key, index) => {
			const propertyName = constatntProperties ? toGlobal(key) : key;
			return { ...obj, [propertyName]: numericValues ? index : key };
		},
		{}
	);

	function toGlobal(_propertyName) {
		const hasLowerCase = /[a-z]/.test(_propertyName);
		return hasLowerCase
			? _propertyName.replace(/([A-Z/])/g, '_$1').toUpperCase()
			: _propertyName;
	}
}
