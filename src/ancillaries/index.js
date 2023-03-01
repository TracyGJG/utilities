import { DATA_TYPES, dataType } from '../dataComparison';

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

export function mapGetter(mapInstance, entityFactory) {
	return (entityId, entityParams) =>
		mapInstance.get(entityId) ||
		mapInstance
			.set(entityId, entityFactory(entityId, entityParams))
			.get(entityId);
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
