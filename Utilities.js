module.exports = {
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
	exercise,
	base64Encode,
	base64Decode,
	shortDay,
	longDay,
	shortMonth,
	longMonth,
	objectEquality,
};

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
	return (value) => Math.min(Math.max(value, min), max);
}
function normaliseRange(start, end) {
	return (value) => (value - start) / (end - start);
}
function liniarInterpolate(start, end) {
	return (factor) => start * (1 - factor) + end * factor;
}
function mapRanges(fromMin, fromMax, toMin, toMax) {
	var norlaise = normaliseRange(fromMin, fromMax);
	var interpolate = liniarInterpolate(toMin, toMax);
	return (value) => interpolate(norlaise(value));
}

function rangeBetween(min, max, step = 1) {
	return [...Array((max - min) / step).keys()].map(
		(index) => index * step + min
	);
}
/**
 * @typedef {number|function(number): number} Step
 * @param {Step} step
 */
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
		[...new Set(arrAcc)].filter((item) => arrN.includes(item))
	);
}
function unionArrays(...arrays) {
	//@ts-ignore missing flat method of Array.
	return Array.from(new Set(arrays.flat()));
}

function exercise(expected, actual, id = '') {
	var expectedResult = JSON.stringify(expected);
	var actualResult = JSON.stringify(actual);
	var exerId = id ? ` ${id}` : '';
	if (expectedResult == actualResult) {
		console.info(
			`%c EXERCISE${exerId} - Passed: Expected (${expectedResult}) and received(${actualResult}).`,
			'color: green;'
		);
		return true;
	}
	console.info(
		`%c EXERCISE${exerId} - Failed: Expected (${expectedResult}) but received(${actualResult}).`,
		'color: red;'
	);
	return false;
}

function base64Encode(bin) {
	return btoa(
		encodeURIComponent(bin).replace(/%([0-9A-F]{2})/g, (match, p1) =>
			String.fromCharCode(Number(`0x${p1}`))
		)
	);
}
function base64Decode(b64) {
	return decodeURIComponent(
		[...b64.replace(/=*$/, '')]
			.map((char) =>
				'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
					.indexOf(char)
					.toString(2)
					//@ts-ignore missing padStart method of String objects.
					.padStart(6, '0')
			)
			.join('')
			.match(/.{8}/g)
			.map((bin) => `%${parseInt(bin, 2).toString(16).toUpperCase()}`)
			.join('')
	);
}

function shortDay(lang = 'en-GB', idx) {
	var dateString = (_) =>
		new Date(1970, 0, 4 + _).toLocaleString(lang, {
			weekday: 'short',
		});
	return arguments.length == 2 ? dateString(idx) : dateString;
}
function longDay(lang = 'en-GB', idx) {
	var dateString = (_) =>
		new Date(1970, 0, 4 + _).toLocaleString(lang, { weekday: 'long' });
	return arguments.length == 2 ? dateString(idx) : dateString;
}
function shortMonth(lang = 'en-GB', idx) {
	var dateString = (_) =>
		new Date(1970, _, 1).toLocaleString(lang, { month: 'short' });
	return arguments.length == 2 ? dateString(idx) : dateString;
}
function longMonth(lang = 'en-GB', idx) {
	var dateString = (_) =>
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
