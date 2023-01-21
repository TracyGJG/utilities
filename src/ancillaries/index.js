import { DATA_TYPES, dataType } from '../dataComparison/index.js';

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
