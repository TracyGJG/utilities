import { DATA_TYPES, dataType } from '../dataComparison/index.js';

export function accumulatedAverage(averageToDate = 0, sampleSize = 0) {
	let runningTotal = averageToDate * (sampleSize || 1);
	let currentSampleSize = sampleSize;
	return (newValue, newAverage, newSampleSize) => {
		currentSampleSize = newSampleSize || currentSampleSize + 1;
		runningTotal =
			(newAverage && newSampleSize
				? newAverage * (newSampleSize - 1)
				: runningTotal) + newValue;
		return runningTotal / currentSampleSize;
	};
}

export function mapGetter(mapInstance, entityFactory) {
	return (entityId, entityParams) =>
		mapInstance.get(entityId) ||
		mapInstance
			.set(entityId, entityFactory(entityId, entityParams))
			.get(entityId);
}

export function random(max, min = 0, precision = 0) {
	const multiplier = 10 ** precision;
	return () =>
		min + Math.floor(Math.random() * (max - min) * multiplier) / multiplier;
}

export function sum(...nums) {
	let _sum = 0;
	nums.forEach(num => {
		if (dataType(num) !== DATA_TYPES.NUMBER) {
			throw Error(`Error: E-NN An argument supplied is not a Numeric value.`);
		}
		_sum += num;
	});
	return _sum;
}

export function webStore(keyName, localWebStorage = true) {
	const webStorage = localWebStorage
		? window.localStorage
		: window.sessionStorage;
	const clear = () => webStorage.clear();
	const get = (defaultValue = null) => {
		const value = webStorage.getItem(keyName);
		return value ? JSON.parse(value) : defaultValue;
	};
	const remove = () => webStorage.removeItem(keyName);
	const set = value => webStorage.setItem(keyName, JSON.stringify(value));

	return {
		clear,
		get,
		remove,
		set,
	};
}

webStore.sessionWebStorage = false;
