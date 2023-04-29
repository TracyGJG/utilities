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
	return Array.from(
		{ length: Math.ceil((max - min) / step) },
		(_, i) => min + i * step
	);
}

export function rangeFrom(length = 1, init = 0, step = 1) {
	const stepFn = typeof step === 'function' ? step : _ => _ * step;
	return Array.from({ length }, (_, i) => init + stepFn(i));
}

export function rangeGenerator(end, start = 0, step = 1) {
	return [..._range(end, start, step)];
	function* _range(_end, _start, _step) {
		yield _start;
		_start += _step;
		if (_start > _end) return;
		yield* _range(_end, _start, _step);
	}
}
