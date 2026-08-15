import { describe, it, test } from 'node:test';
import assert from 'node:assert/strict';

import {
  clampRange,
  inRange,
  liniarInterpolate,
  loopRange,
  mapRanges,
  normaliseRange,
  range,
  rangeBetween,
  rangeFrom,
  rangeGenerator,
} from './index.js';

describe('Ranges', () => {
  describe('Clamp Range', () => {
    it('can clamp the range between 50 and 60', () => {
      const clampedRange = clampRange(50, 60);
      assert.equal(clampedRange(45), 50);
      assert.equal(clampedRange(50), 50);
      assert.equal(clampedRange(55), 55);
      assert.equal(clampedRange(60), 60);
      assert.equal(clampedRange(65), 60);
    });
  });

  describe('In Range', () => {
    const _inRange = inRange(100, 200);
    it('can identify points between 100 and 200', () => {
      assert.equal(_inRange(50), false);
      assert.equal(_inRange(99), false);
      assert.equal(_inRange(100), true);
      assert.equal(_inRange(101), true);
      assert.equal(_inRange(199), true);
      assert.equal(_inRange(200), true);
      assert.equal(_inRange(201), false);
      assert.equal(_inRange(250), false);
    });
    it('can identify ranges that overlap 100 and 200', () => {
      assert.equal(_inRange(0, 50), false);
      assert.equal(_inRange(0, 99), false);
      assert.equal(_inRange(50, 100), true);
      assert.equal(_inRange(50, 150), true);
      assert.equal(_inRange(50, 250), true);
      assert.equal(_inRange(200, 250), true);
      assert.equal(_inRange(201, 250), false);
    });
    it('can throw a SyntaxError exception when supplied with invalid input', () => {
      const expectionTestNoArgs = () => {
        inRange();
      };
      assert.throws(expectionTestNoArgs, SyntaxError);
      const expectionTestOneArg = () => {
        inRange(100);
      };
      assert.throws(expectionTestOneArg, SyntaxError);
      const expectionTestThreeArg = () => {
        inRange(100, 200, 300);
      };
      assert.throws(expectionTestThreeArg, SyntaxError);
    });
  });

  describe('Liniar Interpolate', () => {
    it('can liniarly interpolate the range between 50 and 60', () => {
      const liniarInterlopated = liniarInterpolate(50, 60);
      assert.equal(liniarInterlopated(-0.5), 45);
      assert.equal(liniarInterlopated(0), 50);
      assert.equal(liniarInterlopated(0.5), 55);
      assert.equal(liniarInterlopated(1), 60);
      assert.equal(liniarInterlopated(1.5), 65);
    });
  });

  describe('Loop Range', () => {
    describe('zero indexed', () => {
      const zeroIndexed = loopRange(9);
      it('can be increased', () => {
        assert.equal(zeroIndexed(4), 5);
        assert.equal(zeroIndexed(8), 0);
      });
      it('can be decreased', () => {
        const dir = -1;
        assert.equal(zeroIndexed(4, dir), 3);
        assert.equal(zeroIndexed(0, dir), 8);
      });
    });

    describe('one indexed', () => {
      const oneIndexed = loopRange(9, 1);
      it('can be increased', () => {
        const dir = 1;
        assert.equal(oneIndexed(4, dir), 5);
        assert.equal(oneIndexed(9, dir), 1);
      });
      it('can be decreased', () => {
        const dir = -1;
        assert.equal(oneIndexed(4, dir), 3);
        assert.equal(oneIndexed(1, dir), 9);
      });
    });
  });

  describe('Map Ranges', () => {
    it('can map from a range between 50 and 60 to the range 80 to 100', () => {
      const mappedRanges = mapRanges(50, 60, 80, 100);
      assert.equal(mappedRanges(45), 70);
      assert.equal(mappedRanges(50), 80);
      assert.equal(mappedRanges(55), 90);
      assert.equal(mappedRanges(60), 100);
      assert.equal(mappedRanges(65), 110);
    });

    it('can map Celsius to Fahrenheit', () => {
      const mappedRanges = mapRanges(0, 100, 32, 212);
      assert.equal(mappedRanges(-40).toFixed(0), '-40');
      assert.equal(mappedRanges(0), 32);
      assert.equal(mappedRanges(15), 59);
      assert.equal(mappedRanges(30), 86);
      assert.equal(mappedRanges(50), 122);
      assert.equal(mappedRanges(100), 212);
    });
  });

  describe('Normalise Range', () => {
    it('can normalise the range between 50 and 60', () => {
      const normalisedRange = normaliseRange(50, 60);
      assert.equal(normalisedRange(45), -0.5);
      assert.equal(normalisedRange(50), 0);
      assert.equal(normalisedRange(55), 0.5);
      assert.equal(normalisedRange(60), 1);
      assert.equal(normalisedRange(65), 1.5);
    });
  });

  describe('Range', () => {
    test('zero-based', () => {
      assert.deepEqual(range(6), [0, 1, 2, 3, 4, 5]);
    });

    test('one-based', () => {
      assert.deepEqual(
        range(6, (_) => _ + 1),
        [1, 2, 3, 4, 5, 6],
      );
    });

    test('stepped', () => {
      Math.sumPrecise = (numArray) => numArray.reduce((tot, val) => tot + val);
      const result = range(6, (_) => (_ + 1) * 2);
      assert.deepEqual(result, [2, 4, 6, 8, 10, 12]);
      assert.deepEqual(Math.sumPrecise(result), 42);
    });
  });

  describe('Range Between', () => {
    it('can generate a range of 10 values between 0 and 9', () => {
      const result = rangeBetween(10);
      assert.equal(result.length, 10);
      assert.equal(result[0], 0);
      assert.equal(result[9], 9);
    });
    it('can generate a range of 10 values between 10 and 20', () => {
      const result = rangeBetween(20, 10);
      assert.equal(result.length, 10);
      assert.equal(result[0], 10);
      assert.equal(result[9], 19);
    });
    it('can generate a range of 10 values between 10 and 20, in steps of 3', () => {
      const result = rangeBetween(20, 10, 3);
      assert.equal(result.length, 4);
      assert.equal(result[0], 10);
      assert.equal(result[1], 13);
      assert.equal(result[2], 16);
      assert.equal(result[3], 19);
    });
  });

  describe('Range From', () => {
    it('can generate a range - no arguments', () => {
      assert.equal(rangeFrom().length, 1);
      assert.equal(rangeFrom()[0], 0);
    });
    it('can generate a range - single argument (length)', () => {
      assert.equal(rangeFrom(10).length, 10);
      assert.equal(rangeFrom(10)[0], 0);
      assert.equal(rangeFrom(10)[9], 9);
    });
    it('can generate a range - pair of arguments (length and initial)', () => {
      assert.equal(rangeFrom(12, 10).length, 12);
      assert.equal(rangeFrom(12, 10)[0], 10);
      assert.equal(rangeFrom(12, 10)[11], 21);
    });
    it('can generate a range - pair of arguments, with step value', () => {
      assert.equal(rangeFrom(12, 10, 2).length, 12);
      assert.equal(rangeFrom(12, 10, 2)[0], 10);
      assert.equal(rangeFrom(12, 10, 2)[11], 32);
    });
    it('can generate a range - pair of arguments, with step function', () => {
      const transformFn = (_) => 2 * _;
      assert.equal(rangeFrom(12, 10, transformFn).length, 12);
      assert.equal(rangeFrom(12, 10, transformFn)[0], 10);
      assert.equal(rangeFrom(12, 10, transformFn)[11], 32);
    });
  });

  describe('Range Generator', () => {
    it('can generate a range of values 0 to N, just given N', () => {
      const result = rangeGenerator(10);
      assert.equal(result.length, 11);
      assert.equal(result[0], 0);
      assert.equal(result[10], 10);
    });

    it('can generate a range of values M to N, given N & M', () => {
      const result = rangeGenerator(10, 1);
      assert.equal(result.length, 10);
      assert.equal(result[0], 1);
      assert.equal(result[9], 10);
    });

    it('can generate a range of values M to N in increments of S', () => {
      const result = rangeGenerator(10, 1, 2);
      assert.equal(result.length, 5);
      assert.equal(result[0], 1);
      assert.equal(result[4], 9);
    });
    it('can generate a range as an itterable', () => {
      const result = [];
      for (let i of rangeGenerator(10, 0, 2)) {
        result.push(i);
      }
      assert.equal(result.length, 6);
      assert.equal(result[0], 0);
      assert.equal(result[5], 10);
    });
  });
});
