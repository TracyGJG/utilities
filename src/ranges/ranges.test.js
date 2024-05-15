import { jest } from '@jest/globals';

import { sum } from '../ancillaries/index.js';

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
      expect(clampedRange(45)).toEqual(50);
      expect(clampedRange(50)).toEqual(50);
      expect(clampedRange(55)).toEqual(55);
      expect(clampedRange(60)).toEqual(60);
      expect(clampedRange(65)).toEqual(60);
    });
  });

  describe('In Range', () => {
    const _inRange = inRange(100, 200);
    it('can identify points between 100 and 200', () => {
      expect(_inRange(50)).toBeFalsy();
      expect(_inRange(99)).toBeFalsy();
      expect(_inRange(100)).toBeTruthy();
      expect(_inRange(101)).toBeTruthy();
      expect(_inRange(199)).toBeTruthy();
      expect(_inRange(200)).toBeTruthy();
      expect(_inRange(201)).toBeFalsy();
      expect(_inRange(250)).toBeFalsy();
    });
    it('can identify ranges that overlap 100 and 200', () => {
      expect(_inRange(0, 50)).toBeFalsy();
      expect(_inRange(0, 99)).toBeFalsy();
      expect(_inRange(50, 100)).toBeTruthy();
      expect(_inRange(50, 150)).toBeTruthy();
      expect(_inRange(50, 250)).toBeTruthy();
      expect(_inRange(200, 250)).toBeTruthy();
      expect(_inRange(201, 250)).toBeFalsy();
    });
    it('can throw a SyntaxError exception when supplied with invalid input', () => {
      const expectionTestNoArgs = () => {
        inRange();
      };
      expect(expectionTestNoArgs).toThrow(SyntaxError);
      const expectionTestOneArg = () => {
        inRange(100);
      };
      expect(expectionTestOneArg).toThrow(SyntaxError);
      const expectionTestThreeArg = () => {
        inRange(100, 200, 300);
      };
      expect(expectionTestThreeArg).toThrow(SyntaxError);
    });
  });

  describe('Liniar Interpolate', () => {
    it('can liniarly interpolate the range between 50 and 60', () => {
      const liniarInterlopated = liniarInterpolate(50, 60);
      expect(liniarInterlopated(-0.5)).toEqual(45);
      expect(liniarInterlopated(0)).toEqual(50);
      expect(liniarInterlopated(0.5)).toEqual(55);
      expect(liniarInterlopated(1)).toEqual(60);
      expect(liniarInterlopated(1.5)).toEqual(65);
    });
  });

  describe('Loop Range', () => {
    describe('zero indexed', () => {
      const zeroIndexed = loopRange(9);
      it('can be increased', () => {
        expect(zeroIndexed(4)).toEqual(5);
        expect(zeroIndexed(8)).toEqual(0);
      });
      it('can be decreased', () => {
        const dir = -1;
        expect(zeroIndexed(4, dir)).toEqual(3);
        expect(zeroIndexed(0, dir)).toEqual(8);
      });
    });

    describe('one indexed', () => {
      const oneIndexed = loopRange(9, 1);
      it('can be increased', () => {
        const dir = 1;
        expect(oneIndexed(4, dir)).toEqual(5);
        expect(oneIndexed(9, dir)).toEqual(1);
      });
      it('can be decreased', () => {
        const dir = -1;
        expect(oneIndexed(4, dir)).toEqual(3);
        expect(oneIndexed(1, dir)).toEqual(9);
      });
    });
  });

  describe('Map Ranges', () => {
    it('can map from a range between 50 and 60 to the range 80 to 100', () => {
      const mappedRanges = mapRanges(50, 60, 80, 100);
      expect(mappedRanges(45)).toEqual(70);
      expect(mappedRanges(50)).toEqual(80);
      expect(mappedRanges(55)).toEqual(90);
      expect(mappedRanges(60)).toEqual(100);
      expect(mappedRanges(65)).toEqual(110);
    });

    it('can map Celsius to Fahrenheit', () => {
      const mappedRanges = mapRanges(0, 100, 32, 212);
      expect(mappedRanges(-40).toFixed(0)).toEqual('-40');
      expect(mappedRanges(0)).toEqual(32);
      expect(mappedRanges(15)).toEqual(59);
      expect(mappedRanges(30)).toEqual(86);
      expect(mappedRanges(50)).toEqual(122);
      expect(mappedRanges(100)).toEqual(212);
    });
  });

  describe('Normalise Range', () => {
    it('can normalise the range between 50 and 60', () => {
      const normalisedRange = normaliseRange(50, 60);
      expect(normalisedRange(45)).toEqual(-0.5);
      expect(normalisedRange(50)).toEqual(0);
      expect(normalisedRange(55)).toEqual(0.5);
      expect(normalisedRange(60)).toEqual(1);
      expect(normalisedRange(65)).toEqual(1.5);
    });
  });

  describe('Range', () => {
    test('zero-based', () => {
      expect(range(6)).toEqual([0, 1, 2, 3, 4, 5]);
    });

    test('one-based', () => {
      expect(range(6, _ => _ + 1)).toEqual([1, 2, 3, 4, 5, 6]);
    });

    test('stepped', () => {
      const result = range(6, _ => (_ + 1) * 2);
      expect(result).toEqual([2, 4, 6, 8, 10, 12]);
      expect(sum(...result)).toBe(42);
    });
  });

  describe('Range Between', () => {
    it('can generate a range of 10 values between 0 and 9', () => {
      const result = rangeBetween(10);
      expect(result.length).toEqual(10);
      expect(result[0]).toEqual(0);
      expect(result[9]).toEqual(9);
    });
    it('can generate a range of 10 values between 10 and 20', () => {
      const result = rangeBetween(20, 10);
      expect(result.length).toEqual(10);
      expect(result[0]).toEqual(10);
      expect(result[9]).toEqual(19);
    });
    it('can generate a range of 10 values between 10 and 20, in steps of 3', () => {
      const result = rangeBetween(20, 10, 3);
      expect(result.length).toEqual(4);
      expect(result[0]).toEqual(10);
      expect(result[1]).toEqual(13);
      expect(result[2]).toEqual(16);
      expect(result[3]).toEqual(19);
    });
  });

  describe('Range From', () => {
    it('can generate a range - no arguments', () => {
      expect(rangeFrom().length).toEqual(1);
      expect(rangeFrom()[0]).toEqual(0);
    });
    it('can generate a range - single argument (length)', () => {
      expect(rangeFrom(10).length).toEqual(10);
      expect(rangeFrom(10)[0]).toEqual(0);
      expect(rangeFrom(10)[9]).toEqual(9);
    });
    it('can generate a range - pair of arguments (length and initial)', () => {
      expect(rangeFrom(12, 10).length).toEqual(12);
      expect(rangeFrom(12, 10)[0]).toEqual(10);
      expect(rangeFrom(12, 10)[11]).toEqual(21);
    });
    it('can generate a range - pair of arguments, with step value', () => {
      expect(rangeFrom(12, 10, 2).length).toEqual(12);
      expect(rangeFrom(12, 10, 2)[0]).toEqual(10);
      expect(rangeFrom(12, 10, 2)[11]).toEqual(32);
    });
    it('can generate a range - pair of arguments, with step function', () => {
      const transformFn = _ => 2 * _;
      expect(rangeFrom(12, 10, transformFn).length).toEqual(12);
      expect(rangeFrom(12, 10, transformFn)[0]).toEqual(10);
      expect(rangeFrom(12, 10, transformFn)[11]).toEqual(32);
    });
  });

  describe('Range Generator', () => {
    it('can generate a range of values 0 to N, just given N', () => {
      const result = rangeGenerator(10);
      expect(result.length).toEqual(11);
      expect(result[0]).toEqual(0);
      expect(result[10]).toEqual(10);
    });

    it('can generate a range of values M to N, given N & M', () => {
      const result = rangeGenerator(10, 1);
      expect(result.length).toEqual(10);
      expect(result[0]).toEqual(1);
      expect(result[9]).toEqual(10);
    });

    it('can generate a range of values M to N in increments of S', () => {
      const result = rangeGenerator(10, 1, 2);
      expect(result.length).toEqual(5);
      expect(result[0]).toEqual(1);
      expect(result[4]).toEqual(9);
    });
    it('can generate a range as an itterable', () => {
      const result = [];
      for (let i of rangeGenerator(10, 0, 2)) {
        result.push(i);
      }
      expect(result.length).toEqual(6);
      expect(result[0]).toEqual(0);
      expect(result[5]).toEqual(10);
    });
  });
});
