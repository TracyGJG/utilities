/**
 * @jest-environment jsdom
 */

import {
  accumulatedAverage,
  dateBasedRandom,
  mapGetter,
  modulo,
  random,
  roundBoundry,
} from './index.js';

describe('Ancillaries', () => {
  describe('Accumulated Average', () => {
    it('can calculate with a single call', () => {
      const result1 = accumulatedAverage(9, 5)(9);
      expect(result1).toEqual(9);
      const result2 = accumulatedAverage(9, 5)(45);
      expect(result2).toEqual(15);
    });
    it('can calculate with incremental calls', () => {
      const newAverage = accumulatedAverage();
      expect(newAverage(1)).toEqual(1.0);
      expect(newAverage(2)).toEqual(1.5);
      expect(newAverage(3)).toEqual(2.0);
      expect(newAverage(4)).toEqual(2.5);
      expect(newAverage(5)).toEqual(3.0);
    });
    it('can re-calculate an average', () => {
      const newAverage = accumulatedAverage();
      expect(newAverage(45, 9, 6)).toEqual(15);
    });
  });

  describe('Date-based Random number generator', () => {
    it('can produce a random number between 0 and 1', () => {
      const result = dateBasedRandom();
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThan(1);
    });
  });

  describe('Map Getter', () => {
    it('can obtain a brand new entity', () => {
      const entityMap = new Map();
      const entityGetter = mapGetter(entityMap, (id, { who }) => ({
        id,
        who,
      }));
      expect(entityMap.has('hello')).toStrictEqual(false);

      const entity = entityGetter('hello', { who: 'World' });
      expect(entityMap.has('hello')).toStrictEqual(true);
      expect(entity.who).toBe('World');
    });

    it('can obtain a pre-existing entity', () => {
      const entityMap = new Map();
      const entityGetter = mapGetter(entityMap, (id, { who }) => ({
        id,
        who,
      }));
      expect(entityMap.has('hello')).toStrictEqual(false);

      entityMap.set('hello', {
        id: 'hello',
        who: 'World',
      });
      expect(entityMap.has('hello')).toStrictEqual(true);

      const entity = entityGetter('hello');
      expect(entity.who).toBe('World');
    });
  });

  describe('modulo', () => {
    it('calculate the modulo of zero', () => {
      expect(modulo(42, 0)).toBe(0);
      expect(modulo(42)(0)).toBe(0);
    });

    it('calculate the modulo of a value in range', () => {
      expect(modulo(42, 20)).toBe(20);
      expect(modulo(42)(20)).toBe(20);
    });

    it('calculate the modulo of a positive value out of range', () => {
      expect(modulo(42, 66)).toBe(24);
      expect(modulo(42)(66)).toBe(24);
      expect(modulo(42, 666)).toBe(36);
      expect(modulo(42)(666)).toBe(36);
    });

    it('calculate the modulo of a negative value in range', () => {
      expect(modulo(42, -20)).toBe(22);
      expect(modulo(42)(-20)).toBe(22);
    });
  });

  describe('random', () => {
    test('using default parameters', () => {
      const randomTwo = random(2);
      const result = randomTwo();
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThan(2);
    });

    test('using minimal limit', () => {
      const random1_3 = random(2, 1);
      const result = random1_3();
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThan(3);
    });

    test('using minimal limit and precision', () => {
      const random1_3_to_2dp = random(2, 1, 2);
      const result = random1_3_to_2dp();
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThan(3);

      const rnd = (max, min, mul, rand) =>
        Math.floor(rand * (max - min) * mul) / mul + min;
      expect(rnd(2, 1, 100, 0.54321)).toEqual(1.54);
    });
  });

  describe('roundBoundry', () => {
    describe('using default parameters (round)', () => {
      const roundDefault = roundBoundry(5);

      test('40 -> 40', () => {
        expect(roundDefault(40)).toBe(40);
      });
      test('41 -> 40', () => {
        expect(roundDefault(41)).toBe(40);
      });
      test('42 -> 40', () => {
        expect(roundDefault(42)).toBe(40);
      });
      test('43 -> 45', () => {
        expect(roundDefault(43)).toBe(45);
      });
      test('44 -> 45', () => {
        expect(roundDefault(44)).toBe(45);
      });
      test('45 -> 45', () => {
        expect(roundDefault(45)).toBe(45);
      });
    });

    describe('using specified method (ceil)', () => {
      const roundCeil = roundBoundry(5, 'ceil');

      test('40 -> 40', () => {
        expect(roundCeil(40)).toBe(40);
      });
      test('41 -> 45', () => {
        expect(roundCeil(41)).toBe(45);
      });
      test('42 -> 45', () => {
        expect(roundCeil(42)).toBe(45);
      });
      test('43 -> 45', () => {
        expect(roundCeil(43)).toBe(45);
      });
      test('44 -> 45', () => {
        expect(roundCeil(44)).toBe(45);
      });
      test('45 -> 45', () => {
        expect(roundCeil(45)).toBe(45);
      });
    });

    describe('using specified method (floor)', () => {
      const roundFloor = roundBoundry(5, 'floor');

      test('40 -> 40', () => {
        expect(roundFloor(40)).toBe(40);
      });
      test('41 -> 40', () => {
        expect(roundFloor(41)).toBe(40);
      });
      test('42 -> 40', () => {
        expect(roundFloor(42)).toBe(40);
      });
      test('43 -> 40', () => {
        expect(roundFloor(43)).toBe(40);
      });
      test('44 -> 40', () => {
        expect(roundFloor(44)).toBe(40);
      });
      test('45 -> 45', () => {
        expect(roundFloor(45)).toBe(45);
      });
    });
  });
});
