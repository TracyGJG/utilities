import {
	accumulatedAverage,
	mapGetter,
	random,
	sum,
	webStore,
} from './src/ancillaries/index.js';
import {
	batchBy,
	groupBy,
	intersectArrays,
	reconcileArrays,
	replaceArray,
	transposeArray,
	unionArrays,
	shuffleArray,
} from './src/arrays/index.js';
import {
	DATA_TYPES,
	cloneObject,
	compareObjectByProperty,
	dataType,
	duplicateObject,
	isBase,
	isEmptyObject,
	isObject,
	objectEquality,
} from './src/dataComparison/index.js';
import {
	base64Decode,
	base64Encode,
	longDay,
	longMonth,
	shortDay,
	shortMonth,
} from './src/dataConverters/index.js';
import {
	acc,
	ace,
	ael,
	cde,
	cse,
	dce,
	qs,
	qsa,
	sui,
	debounce,
	throttle,
} from './src/dom/index.js';
import {
	adhocArray,
	consoleGroup,
	consoleTable,
	exercise,
} from './src/exercising/index.js';
import {
	clampRange,
	inRange,
	liniarInterpolate,
	loopRange,
	mapRanges,
	normaliseRange,
	rangeBetween,
	rangeFrom,
	rangeGenerator,
} from './src/ranges/index.js';
import {
	compose,
	copyText,
	curry,
	enumerate,
	lens,
	memoize,
	pasteText,
	regExpFromString,
	simd,
	sleep,
} from './src/tools/index.js';

export {
	DATA_TYPES,
	// 0
	acc,
	accumulatedAverage,
	ace,
	adhocArray,
	ael,
	// 5
	base64Decode,
	base64Encode,
	batchBy,
	cde,
	clampRange,
	// 10
	cloneObject,
	compareObjectByProperty,
	compose,
	consoleGroup,
	consoleTable,
	// 15
	copyText,
	cse,
	curry,
	dataType,
	dce,
	// 20
	debounce,
	duplicateObject,
	enumerate,
	exercise,
	groupBy,
	// 25
	inRange,
	intersectArrays,
	isBase,
	isEmptyObject,
	isObject,
	// 30
	lens,
	liniarInterpolate,
	longDay,
	longMonth,
	loopRange,
	// 35
	mapGetter,
	mapRanges,
	memoize,
	normaliseRange,
	objectEquality,
	// 40
	pasteText,
	qs,
	qsa,
	random,
	rangeBetween,
	// 45
	rangeFrom,
	rangeGenerator,
	reconcileArrays,
	regExpFromString,
	replaceArray,
	// 50
	shortDay,
	shortMonth,
	shuffleArray,
	simd,
	sleep,
	// 55
	sui,
	sum,
	throttle,
	transposeArray,
	unionArrays,
	// 60
	webStore,
};
