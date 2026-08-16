import { describe, it, test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import {
  batchBy,
  groupBy,
  permute,
  reconcileArrays,
  replaceArray,
  shuffleArray,
  transposeArray,
  unflatten,
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
        assert.equal(batches.length, 0);
      });

      test('with an even input array', () => {
        const batches = batchesOfThree([...testData, 'L']);
        assert.equal(batches.length, 4);
        assert.equal(batches[3].length, 3);
      });

      test('with an uneven input array', () => {
        const batches = batchesOfThree([...testData]);
        assert.equal(batches.length, 4);
        assert.equal(batches[3].length, 2);
      });
    });
    describe('Number', () => {
      const fourBatches = batchBy.number(4);

      test('with an empty input array', () => {
        const batches = fourBatches([]);
        assert.equal(batches.length, 0);
      });

      test('with an even input array', () => {
        const batches = fourBatches([...testData, 'L']);
        assert.equal(batches.length, 4);
        assert.equal(batches[3].length, 3);
      });

      test('with an uneven input array', () => {
        const batches = fourBatches([...testData]);
        assert.equal(batches.length, 4);
        assert.equal(batches[3].length, 2);
      });
    });
  });

  describe('groupBy', () => {
    test('returns an empty object when given an empty array', () => {
      const groupFunction = ({ name }) => name;
      const sourceArray = [];
      const resultGroupObject = groupBy(groupFunction, sourceArray);
      assert.equal(Object.keys(resultGroupObject).length, 0);
    });
    test('returns an object with a single property when given an array containing objects of the same group (same time args)', () => {
      const groupFunction = ({ name }) => name;
      const sourceArray = [
        { name: 'alpha' },
        { name: 'alpha' },
        { name: 'alpha' },
      ];
      const resultGroupObject = groupBy(groupFunction, sourceArray);

      assert.equal(Object.keys(resultGroupObject).length, 1);
      assert.equal(Object.keys(resultGroupObject)[0], 'alpha');
      assert.equal(resultGroupObject.alpha.length, 3);
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

      assert.equal(Object.keys(resultGroupObject).length, 2);
      assert.equal(Object.keys(resultGroupObject)[0], 'alpha');
      assert.equal(Object.keys(resultGroupObject)[1], 'beta');

      assert.equal(resultGroupObject.alpha.length, 2);
      assert.equal(resultGroupObject.beta.length, 1);
      assert.equal(resultGroupObject.alpha[0].id, 1);
      assert.equal(resultGroupObject.alpha[1].id, 3);
      assert.equal(resultGroupObject.beta[0].id, 2);
    });
  });

  describe('Permute a set of arrays', () => {
    test('In three dimensions', () => {
      assert.equal(permuteSpec.length, 3);
      assert.equal(permuteSpec[0].length, 2);
      assert.equal(permuteSpec[1].length, 3);
      assert.equal(permuteSpec[2].length, 4);

      const result = permute(...permuteSpec);
      assert.equal(Array.isArray(result), true);
      assert.equal(result.length, 2);

      assert.equal(Array.isArray(result[0]), true);
      assert.equal(result[0].length, 3);
      assert.equal(result[1].length, 3);

      assert.equal(Array.isArray(result[0][0]), true);
      assert.equal(result[0][0].length, 4);
      assert.equal(result[0][1].length, 4);
      assert.equal(result[0][2].length, 4);
      assert.equal(result[1][0].length, 4);
      assert.equal(result[1][1].length, 4);
      assert.equal(result[1][2].length, 4);

      assert.equal(Array.isArray(result[0][0][0]), true);
      assert.equal(result[0][0][0].length, 3);

      assert.equal(typeof result[0][0][0][0], 'string');
      assert.equal(result[0][0][0][0].length, 1);
      assert.equal(result[0][0][0][0], 'A');
    });
  });

  describe('Reconcile Arrays', () => {
    it('can accommodate when both arrays are empty', () => {
      const source = [];
      const target = [];

      reconcileArrays(source, target);

      assert.equal(target.length, 0);
    });
    it('can add new objects to the target array', () => {
      const source = [{ id: '1', value: 'alpha' }];
      const target = [];

      assert.equal(target.length, 0);
      reconcileArrays(source, target);

      assert.equal(target.length, 1);
      assert.equal(target[0].id, '1');
      assert.equal(target[0].value, 'alpha');
    });
    it('can remove old objects from the target array', () => {
      const source = [];
      const target = [{ id: '1', value: 'alpha' }];

      assert.equal(target.length, 1);
      reconcileArrays(source, target);

      assert.equal(target.length, 0);
    });
    it('can update matching objects in the target array', () => {
      // Arrange
      const source = [{ id: '1', value: 'beta' }];
      const target = [{ id: '1', value: 'alpha' }];
      // Affirm
      assert.equal(target.length, 1);
      assert.equal(target[0].id, '1');
      assert.equal(target[0].value, 'alpha');
      // Action
      reconcileArrays(source, target);
      // Assert
      assert.equal(target.length, 1);
      assert.equal(target[0].id, '1');
      assert.equal(target[0].value, 'beta');
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
      assert.equal(target.length, 3);
      assert.equal(target[0].id, '1');
      assert.equal(target[0].value, 'alpha');
      assert.equal(target[2].id, '3');
      assert.equal(target[2].value, 'alpha');
      // Action
      reconcileArrays(source, target);
      // Assert
      assert.equal(target.length, 3);
      assert.equal(target[0].id, '2');
      assert.equal(target[0].value, 'alpha');
      assert.equal(target[1].id, '3');
      assert.equal(target[1].value, 'beta');
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
      assert.equal(target.length, 3);
      assert.equal(target[0].id, '1');
      assert.equal(target[0].values.length, 0);
      assert.equal(target[1].id, '2');
      assert.equal(target[1].values.length, 1);
      assert.equal(target[1].values[0], 'beta');
      assert.equal(target[2].id, '3');
      assert.equal(target[2].values.length, 2);
      assert.equal(target[2].values[0], 'alpha');
      assert.equal(target[2].values[1], 'beta');
      // Action
      reconcileArrays(source, target);
      // Assert
      assert.equal(target.length, 3);
      assert.equal(target[0].id, '1');
      assert.equal(target[0].values.length, 1);
      assert.equal(target[0].values[0], 'gamma');
      assert.equal(target[1].id, '2');
      assert.equal(target[1].values.length, 1);
      assert.equal(target[1].values[0], 'alpha');
      assert.equal(target[2].id, '3');
      assert.equal(target[2].values.length, 2);
      assert.equal(target[2].values[0], 'gamma');
      assert.equal(target[2].values[1], 'beta');
    });
  });

  describe('Replace Array', () => {
    it('can populate an empty array', () => {
      const tgtArr = [];
      const srcArr = [1, 2, 3];

      replaceArray(tgtArr, srcArr);
      assert.equal(tgtArr.length, 3);
    });

    it('can empty a populated array', () => {
      const tgtArr = [1, 2, 3];

      replaceArray(tgtArr);
      assert.equal(tgtArr.length, 0);
    });

    it('can replace a populated array', () => {
      const tgtArr = [1, 2, 3];
      const srcArr = [4, 5, 6, 7];

      replaceArray(tgtArr, srcArr);
      assert.equal(tgtArr.length, 4);
    });
  });

  describe('Shuffle Array', () => {
    test('can mix an array', () => {
      const testCase = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      shuffleArray(testCase);
      assert.notEqual(testCase, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });
  });

  describe('Transpose Array', () => {
    it('can process an empty array', () => {
      const testMatrix = [];
      const resultMatrix = transposeArray(testMatrix);
      assert.equal(Array.isArray(resultMatrix), true);
      assert.equal(resultMatrix.length, 0);
    });
    it('can process an array containing empty rows', () => {
      const testMatrix = [[], [], []];
      const resultMatrix = transposeArray(testMatrix);
      assert.equal(Array.isArray(resultMatrix), true);
      assert.equal(resultMatrix.length, 0);
    });
    it('can process an array containing a single row', () => {
      const testMatrix = [['alpha', 'beta', 'gamma']];
      const resultMatrix = transposeArray(testMatrix);
      assert.equal(Array.isArray(resultMatrix), true);
      assert.equal(resultMatrix.length, 3);
      assert.equal(resultMatrix[0][0], 'alpha');
      assert.equal(resultMatrix[1][0], 'beta');
      assert.equal(resultMatrix[2][0], 'gamma');
    });
    it('can process an array containing rows with a single value (column)', () => {
      const testMatrix = [['alpha'], ['beta'], ['gamma']];
      const resultMatrix = transposeArray(testMatrix);
      assert.equal(Array.isArray(resultMatrix), true);
      assert.equal(resultMatrix.length, 1);
      assert.equal(resultMatrix[0][0], 'alpha');
      assert.equal(resultMatrix[0][1], 'beta');
      assert.equal(resultMatrix[0][2], 'gamma');
    });
    it('can process a 2D array (matrix)', () => {
      const testMatrix = [
        ['A', 1, 'alpha'],
        ['B', 2, 'beta'],
        ['C', 3, 'gamma'],
      ];
      const resultMatrix = transposeArray(testMatrix);
      assert.equal(Array.isArray(resultMatrix), true);
      assert.equal(resultMatrix.length, 3);
      assert.equal(resultMatrix[0][0], 'A');
      assert.equal(resultMatrix[0][1], 'B');
      assert.equal(resultMatrix[0][2], 'C');
      assert.equal(resultMatrix[1][0], 1);
      assert.equal(resultMatrix[1][1], 2);
      assert.equal(resultMatrix[1][2], 3);
      assert.equal(resultMatrix[2][0], 'alpha');
      assert.equal(resultMatrix[2][1], 'beta');
      assert.equal(resultMatrix[2][2], 'gamma');
    });
  });

  describe('Unflatten', () => {
    test('can restructure a flat array (little-endian)', () => {
      assert.equal(flatData.length, 72);

      const result = unflatten(2, 3, 4)(flatData);
      assert.equal(result.length, 2);
      assert.equal(result[0].length, 3);
      assert.equal(result[1].length, 3);
      assert.equal(result[0][0].length, 4);
      assert.equal(result[0][1].length, 4);
      assert.equal(result[0][2].length, 4);
      assert.equal(result[1][0].length, 4);
      assert.equal(result[1][1].length, 4);
      assert.equal(result[1][2].length, 4);
      assert.equal(result.flat().length, 6);
      assert.equal(result.flat(2).length, 24);
    });

    test('can restructure a flat array (big-endian)', () => {
      assert.equal(flatData.length, 72);

      const specialisedFunction = unflatten(4, 3, 2);
      const result = specialisedFunction(flatData);
      assert.equal(result.length, 4);
      assert.equal(result[0].length, 3);
      assert.equal(result[1].length, 3);
      assert.equal(result[2].length, 3);
      assert.equal(result[3].length, 3);
      assert.equal(result[0][0].length, 2);
      assert.equal(result[0][1].length, 2);
      assert.equal(result[0][2].length, 2);
      assert.equal(result[1][0].length, 2);
      assert.equal(result[1][1].length, 2);
      assert.equal(result[1][2].length, 2);
      assert.equal(result[2][0].length, 2);
      assert.equal(result[2][1].length, 2);
      assert.equal(result[2][2].length, 2);
      assert.equal(result[3][0].length, 2);
      assert.equal(result[3][1].length, 2);
      assert.equal(result[3][2].length, 2);
      assert.equal(result.flat().length, 12);
      assert.equal(result.flat(2).length, 24);
    });
  });
});
