export function clampRange(min, max) {
	return value => Math.min(Math.max(value, min), max);
}

export function inRange(from, to) {
	if (arguments.length != 2)
		throw new SyntaxError(
			'overlappingRanges needs to be provided with two primary values.'
		);
	const aFrom = Math.min(from, to);
	const aTo = Math.max(from, to);
	return function check(from, to) {
		const xTo = arguments.length === 1 ? from : to;
		const bFrom = Math.min(from, xTo);
		const bTo = Math.max(from, xTo);
		return !(bTo < aFrom || bFrom > aTo);
	};
}

export function liniarInterpolate(start, end) {
	return factor => start * (1 - factor) + end * factor;
}

export function loopRange(max, min = 0) {
	return function move(cur, dir = 1) {
		return ((cur + dir + max - min) % max) + min;
	};
}

export function mapRanges(fromMin, fromMax, toMin, toMax) {
	const norlaise = normaliseRange(fromMin, fromMax);
	const interpolate = liniarInterpolate(toMin, toMax);
	return value => interpolate(norlaise(value));
}

export function normaliseRange(start, end) {
	return value => (value - start) / (end - start);
}

export function rangeBetween(max, min = 0, step = 1) {
	return [...Array((max - min) / step).keys()].map(index => index * step + min);
}

export function rangeFrom(init = 0, len = 1, step = 1) {
	const stepFn = (_, inc) =>
		(typeof step === 'number' ? step * inc : step(inc)) + init;
	return [...Array(len)].map(stepFn);
}
