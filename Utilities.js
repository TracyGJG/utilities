var Utilities = (() => {
	return {
		acculatedAverage,
		clampRange,
		normaliseRange,
		liniarInterpolate,
		mapRanges,
		rangeBetween,
		rangeFrom,
		intersectArrays,
		unionArrays,
		exercise,
	};

	function acculatedAverage(averageToDate = 0, sampleSize = 0) {
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
	function rangeFrom(init = 0, len = 1, step = 1) {
		return [...Array(len)].map((_, inc) => step * inc + init);
	}
	function intersectArrays(...arrays) {
		return arrays.reduce((arrAcc, arrN) =>
			[...new Set(arrAcc)].filter((item) => arrN.includes(item))
		);
	}
	function unionArrays(...arrays) {
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
})();
