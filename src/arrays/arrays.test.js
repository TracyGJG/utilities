import { jest } from '@jest/globals';

import {
	batchBy,
	groupBy,
	intersectArrays,
	permute,
	reconcileArrays,
	replaceArray,
	shuffleArray,
	transposeArray,
	unflatten,
	unionArrays,
} from './index.js';

import { rangeFrom } from '../ranges/index.js';

import { flatData, permuteSpec } from './testData.js';

describe('Arrays', () => {
	describe('batchBy', () => {
		const testData = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];

		describe('Size', () => {
			const batchesOfThree = batchBy.size(3);

			test('with an empty input array', () => {
				const batches = batchesOfThree([]);
				expect(batches.length).toBe(0);
			});

			test('with an even input array', () => {
				const batches = batchesOfThree([...testData, 'L']);
				expect(batches.length).toBe(4);
				expect(batches[3].length).toBe(3);
			});

			test('with an uneven input array', () => {
				const batches = batchesOfThree([...testData]);
				expect(batches.length).toBe(4);
				expect(batches[3].length).toBe(2);
			});
		});
		describe('Number', () => {
			const fourBatches = batchBy.number(4);

			test('with an empty input array', () => {
				const batches = fourBatches([]);
				expect(batches.length).toBe(0);
			});

			test('with an even input array', () => {
				const batches = fourBatches([...testData, 'L']);
				expect(batches.length).toBe(4);
				expect(batches[3].length).toBe(3);
			});

			test('with an uneven input array', () => {
				const batches = fourBatches([...testData]);
				expect(batches.length).toBe(4);
				expect(batches[3].length).toBe(2);
			});
		});
	});

	describe('groupBy', () => {
		test('returns an empty object when given an empty array', () => {
			const groupFunction = ({ name }) => name;
			const sourceArray = [];
			const resultGroupObject = groupBy(groupFunction, sourceArray);
			expect(Object.keys(resultGroupObject).length).toBe(0);
		});
		test('returns an object with a single property when given an array containing objects of the same group (same time args)', () => {
			const groupFunction = ({ name }) => name;
			const sourceArray = [
				{ name: 'alpha' },
				{ name: 'alpha' },
				{ name: 'alpha' },
			];
			const resultGroupObject = groupBy(groupFunction, sourceArray);

			expect(Object.keys(resultGroupObject).length).toBe(1);
			expect(Object.keys(resultGroupObject)[0]).toBe('alpha');
			expect(resultGroupObject.alpha.length).toBe(3);
		});
		test('returns an object with multiple properties when given an array containing objects of different groups (different time args)', () => {
			const groupFunction = ({ name }) => name;
			const sourceArray = [
				{ id: 1, name: 'alpha' },
				{ id: 2, name: 'beta' },
				{ id: 3, name: 'alpha' },
			];
			const resultGroupFunction = groupBy(groupFunction);
			const resultGroupObject = resultGroupFunction(sourceArray);

			expect(Object.keys(resultGroupObject).length).toBe(2);
			expect(Object.keys(resultGroupObject)[0]).toBe('alpha');
			expect(Object.keys(resultGroupObject)[1]).toBe('beta');

			expect(resultGroupObject.alpha.length).toBe(2);
			expect(resultGroupObject.beta.length).toBe(1);
			expect(resultGroupObject.alpha[0].id).toBe(1);
			expect(resultGroupObject.alpha[1].id).toBe(3);
			expect(resultGroupObject.beta[0].id).toBe(2);
		});
	});

	describe('Intersect Array', () => {
		const alpha = rangeFrom(4, 1); // [1, 2, 3, 4]
		const beta = rangeFrom(4, 2); // [2, 3, 4, 5]
		const delta = rangeFrom(4, 3); // [3, 4, 5, 6]
		const zeta = rangeFrom(4, 10, 10); // [10, 20, 30, 40]
		it('can intersect a single array', () => {
			const result = [1, 2, 3, 4];
			expect(intersectArrays(alpha)).toEqual(result);
		});
		it('can intersect an array with an empty array', () => {
			const result = [];
			expect(intersectArrays(alpha, [])).toEqual(result);
		});
		it('can intersect two (non-intersecting arrays)', () => {
			const result = [];
			expect(intersectArrays(alpha, zeta)).toEqual(result);
		});
		it('can intersect two (intersecting arrays)', () => {
			const result = [2, 3, 4];
			expect(intersectArrays(alpha, beta)).toEqual(result);
		});
		it('can intersect three arrays', () => {
			const result = [3, 4];
			expect(intersectArrays(alpha, beta, delta)).toEqual(result);
		});
	});

	describe('Permute a set of arrays', () => {
		test('In three dimensions', () => {
			expect(permuteSpec.length).toBe(3);
			expect(permuteSpec[0].length).toBe(2);
			expect(permuteSpec[1].length).toBe(3);
			expect(permuteSpec[2].length).toBe(4);

			const result = permute(...permuteSpec);
			expect(Array.isArray(result)).toStrictEqual(true);
			expect(result.length).toBe(2);

			expect(Array.isArray(result[0])).toStrictEqual(true);
			expect(result[0].length).toBe(3);
			expect(result[1].length).toBe(3);

			expect(Array.isArray(result[0][0])).toStrictEqual(true);
			expect(result[0][0].length).toBe(4);
			expect(result[0][1].length).toBe(4);
			expect(result[0][2].length).toBe(4);
			expect(result[1][0].length).toBe(4);
			expect(result[1][1].length).toBe(4);
			expect(result[1][2].length).toBe(4);

			expect(Array.isArray(result[0][0][0])).toStrictEqual(true);
			expect(result[0][0][0].length).toBe(3);

			expect(typeof result[0][0][0][0]).toStrictEqual('string');
			expect(result[0][0][0][0].length).toBe(1);
			expect(result[0][0][0][0]).toBe('A');
		});
	});

	describe('Reconcile Arrays', () => {
		it('can accommodate when both arrays are empty', () => {
			const source = [];
			const target = [];

			reconcileArrays(source, target);

			expect(target.length).toBe(0);
		});
		it('can add new objects to the target array', () => {
			const source = [{ id: '1', value: 'alpha' }];
			const target = [];

			expect(target.length).toBe(0);
			reconcileArrays(source, target);

			expect(target.length).toBe(1);
			expect(target[0].id).toBe('1');
			expect(target[0].value).toBe('alpha');
		});
		it('can remove old objects from the target array', () => {
			const source = [];
			const target = [{ id: '1', value: 'alpha' }];

			expect(target.length).toBe(1);
			reconcileArrays(source, target);

			expect(target.length).toBe(0);
		});
		it('can update matching objects in the target array', () => {
			// Arrange
			const source = [{ id: '1', value: 'beta' }];
			const target = [{ id: '1', value: 'alpha' }];
			// Affirm
			expect(target.length).toBe(1);
			expect(target[0].id).toBe('1');
			expect(target[0].value).toBe('alpha');
			// Action
			reconcileArrays(source, target);
			// Assert
			expect(target.length).toBe(1);
			expect(target[0].id).toBe('1');
			expect(target[0].value).toBe('beta');
		});
		it('can manage a combination of changes to the target array', () => {
			// Arrange
			const source = [
				{ id: '2', value: 'alpha' },
				{ id: '3', value: 'beta' },
				{ id: '4', value: 'alpha' },
			];
			const target = [
				{ id: '1', value: 'alpha' },
				{ id: '2', value: 'alpha' },
				{ id: '3', value: 'alpha' },
			];
			// Affirm
			expect(target.length).toBe(3);
			expect(target[0].id).toBe('1');
			expect(target[0].value).toBe('alpha');
			expect(target[2].id).toBe('3');
			expect(target[2].value).toBe('alpha');
			// Action
			reconcileArrays(source, target);
			// Assert
			expect(target.length).toBe(3);
			expect(target[0].id).toBe('2');
			expect(target[0].value).toBe('alpha');
			expect(target[1].id).toBe('3');
			expect(target[1].value).toBe('beta');
		});
		it('can reconcile arrays that contain arrays', () => {
			// Arrange
			const source = [
				{ id: '1', values: ['gamma'] },
				{ id: '2', values: ['alpha'] },
				{ id: '3', values: ['gamma', 'beta'] },
			];
			const target = [
				{ id: '1', values: [] },
				{ id: '2', values: ['beta'] },
				{ id: '3', values: ['alpha', 'beta'] },
			];
			// Affirm
			expect(target.length).toBe(3);
			expect(target[0].id).toBe('1');
			expect(target[0].values.length).toBe(0);
			expect(target[1].id).toBe('2');
			expect(target[1].values.length).toBe(1);
			expect(target[1].values[0]).toBe('beta');
			expect(target[2].id).toBe('3');
			expect(target[2].values.length).toBe(2);
			expect(target[2].values[0]).toBe('alpha');
			expect(target[2].values[1]).toBe('beta');
			// Action
			reconcileArrays(source, target);
			// Assert
			expect(target.length).toBe(3);
			expect(target[0].id).toBe('1');
			expect(target[0].values.length).toBe(1);
			expect(target[0].values[0]).toBe('gamma');
			expect(target[1].id).toBe('2');
			expect(target[1].values.length).toBe(1);
			expect(target[1].values[0]).toBe('alpha');
			expect(target[2].id).toBe('3');
			expect(target[2].values.length).toBe(2);
			expect(target[2].values[0]).toBe('gamma');
			expect(target[2].values[1]).toBe('beta');
		});
	});

	describe('Replace Array', () => {
		it('can populate an empty array', () => {
			const tgtArr = [];
			const srcArr = [1, 2, 3];

			replaceArray(tgtArr, srcArr);
			expect(tgtArr.length).toEqual(3);
		});

		it('can empty a populated array', () => {
			const tgtArr = [1, 2, 3];

			replaceArray(tgtArr);
			expect(tgtArr.length).toEqual(0);
		});

		it('can replace a populated array', () => {
			const tgtArr = [1, 2, 3];
			const srcArr = [4, 5, 6, 7];

			replaceArray(tgtArr, srcArr);
			expect(tgtArr.length).toEqual(4);
		});
	});

	describe('Shuffle Array', () => {
		test('can mix an array', () => {
			const testCase = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
			shuffleArray(testCase);
			expect(testCase).not.toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
		});
	});

	describe('Transpose Array', () => {
		it('can process an empty array', () => {
			const testMatrix = [];
			const resultMatrix = transposeArray(testMatrix);
			expect(Array.isArray(resultMatrix)).toBeTruthy();
			expect(resultMatrix.length).toBe(0);
		});
		it('can process an array containing empty rows', () => {
			const testMatrix = [[], [], []];
			const resultMatrix = transposeArray(testMatrix);
			expect(Array.isArray(resultMatrix)).toBeTruthy();
			expect(resultMatrix.length).toBe(0);
		});
		it('can process an array containing a single row', () => {
			const testMatrix = [['alpha', 'beta', 'gamma']];
			const resultMatrix = transposeArray(testMatrix);
			expect(Array.isArray(resultMatrix)).toBeTruthy();
			expect(resultMatrix.length).toBe(3);
			expect(resultMatrix[0][0]).toBe('alpha');
			expect(resultMatrix[1][0]).toBe('beta');
			expect(resultMatrix[2][0]).toBe('gamma');
		});
		it('can process an array containing rows with a single value (column)', () => {
			const testMatrix = [['alpha'], ['beta'], ['gamma']];
			const resultMatrix = transposeArray(testMatrix);
			expect(Array.isArray(resultMatrix)).toBeTruthy();
			expect(resultMatrix.length).toBe(1);
			expect(resultMatrix[0][0]).toBe('alpha');
			expect(resultMatrix[0][1]).toBe('beta');
			expect(resultMatrix[0][2]).toBe('gamma');
		});
		it('can process a 2D array (matrix)', () => {
			const testMatrix = [
				['A', 1, 'alpha'],
				['B', 2, 'beta'],
				['C', 3, 'gamma'],
			];
			const resultMatrix = transposeArray(testMatrix);
			expect(Array.isArray(resultMatrix)).toBeTruthy();
			expect(resultMatrix.length).toBe(3);
			expect(resultMatrix[0][0]).toBe('A');
			expect(resultMatrix[0][1]).toBe('B');
			expect(resultMatrix[0][2]).toBe('C');
			expect(resultMatrix[1][0]).toBe(1);
			expect(resultMatrix[1][1]).toBe(2);
			expect(resultMatrix[1][2]).toBe(3);
			expect(resultMatrix[2][0]).toBe('alpha');
			expect(resultMatrix[2][1]).toBe('beta');
			expect(resultMatrix[2][2]).toBe('gamma');
		});
	});

	describe('Unflatten', () => {
		test('can restructure a flat array (little-endian)', () => {
			expect(flatData.length).toBe(72);

			const result = unflatten(2, 3, 4)(flatData);
			expect(result.length).toEqual(2);
			expect(result[0].length).toEqual(3);
			expect(result[1].length).toEqual(3);
			expect(result[0][0].length).toEqual(4);
			expect(result[0][1].length).toEqual(4);
			expect(result[0][2].length).toEqual(4);
			expect(result[1][0].length).toEqual(4);
			expect(result[1][1].length).toEqual(4);
			expect(result[1][2].length).toEqual(4);
			expect(result.flat().length).toEqual(6);
			expect(result.flat(2).length).toEqual(24);
		});

		test('can restructure a flat array (big-endian)', () => {
			expect(flatData.length).toBe(72);

			const specialisedFunction = unflatten(4, 3, 2);
			const result = specialisedFunction(flatData);
			expect(result.length).toEqual(4);
			expect(result[0].length).toEqual(3);
			expect(result[1].length).toEqual(3);
			expect(result[2].length).toEqual(3);
			expect(result[3].length).toEqual(3);
			expect(result[0][0].length).toEqual(2);
			expect(result[0][1].length).toEqual(2);
			expect(result[0][2].length).toEqual(2);
			expect(result[1][0].length).toEqual(2);
			expect(result[1][1].length).toEqual(2);
			expect(result[1][2].length).toEqual(2);
			expect(result[2][0].length).toEqual(2);
			expect(result[2][1].length).toEqual(2);
			expect(result[2][2].length).toEqual(2);
			expect(result[3][0].length).toEqual(2);
			expect(result[3][1].length).toEqual(2);
			expect(result[3][2].length).toEqual(2);
			expect(result.flat().length).toEqual(12);
			expect(result.flat(2).length).toEqual(24);
		});
	});

	describe('Union Array', () => {
		const alpha = rangeFrom(4, 1); // [1, 2, 3, 4]
		const beta = rangeFrom(4, 2); // [2, 3, 4, 5]
		const delta = rangeFrom(4, 3); // [3, 4, 5, 6]
		const zeta = rangeFrom(4, 10, 10); // [10, 20, 30, 40]
		it('can union a single array', () => {
			const result = [1, 2, 3, 4];
			expect(unionArrays(alpha)).toEqual(result);
		});
		it('can union an array with an empty array', () => {
			const result = [1, 2, 3, 4];
			expect(unionArrays(alpha, [])).toEqual(result);
		});
		it('can union two (non-intersecting arrays)', () => {
			const result = [1, 2, 3, 4, 10, 20, 30, 40];
			expect(unionArrays(alpha, zeta)).toEqual(result);
		});
		it('can union three (intesecting) arrays', () => {
			const result = [1, 2, 3, 4, 5, 6];
			expect(unionArrays(alpha, beta, delta)).toEqual(result);
		});
	});
});
