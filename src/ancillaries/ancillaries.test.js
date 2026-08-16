import { describe, it, test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

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
      assert.equal(result1, 9);
      const result2 = accumulatedAverage(9, 5)(45);
      assert.equal(result2, 15);
    });
    it('can calculate with incremental calls', () => {
      const newAverage = accumulatedAverage();
      assert.equal(newAverage(1), 1.0);
      assert.equal(newAverage(2), 1.5);
      assert.equal(newAverage(3), 2.0);
      assert.equal(newAverage(4), 2.5);
      assert.equal(newAverage(5), 3.0);
    });
    it('can re-calculate an average', () => {
      const newAverage = accumulatedAverage();
      assert.equal(newAverage(45, 9, 6), 15);
    });
  });

  describe('Date-based Random number generator', () => {
    it('can produce a random number between 0 and 1', () => {
      const result = dateBasedRandom();
      assert.equal(typeof result, 'number');
      assert.ok(result >= 0);
      assert.ok(result < 1);
    });
  });

  describe('Map Getter', () => {
    it('can obtain a brand new entity', () => {
      const entityMap = new Map();
      const entityGetter = mapGetter(entityMap, (id, { who }) => ({
        id,
        who,
      }));
      assert.equal(entityMap.has('hello'), false);

      const entity = entityGetter('hello', { who: 'World' });
      assert.equal(entityMap.has('hello'), true);
      assert.equal(entity.who, 'World');
    });

    it('can obtain a pre-existing entity', () => {
      const entityMap = new Map();
      const entityGetter = mapGetter(entityMap, (id, { who }) => ({
        id,
        who,
      }));
      assert.equal(entityMap.has('hello'), false);

      entityMap.set('hello', {
        id: 'hello',
        who: 'World',
      });
      assert.equal(entityMap.has('hello'), true);

      const entity = entityGetter('hello');
      assert.equal(entity.who, 'World');
    });
  });

  describe('modulo', () => {
    it('calculate the modulo of zero', () => {
      assert.equal(modulo(42, 0), 0);
      assert.equal(modulo(42)(0), 0);
    });

    it('calculate the modulo of a value in range', () => {
      assert.equal(modulo(42, 20), 20);
      assert.equal(modulo(42)(20), 20);
    });

    it('calculate the modulo of a positive value out of range', () => {
      assert.equal(modulo(42, 66), 24);
      assert.equal(modulo(42)(66), 24);
      assert.equal(modulo(42, 666), 36);
      assert.equal(modulo(42)(666), 36);
    });

    it('calculate the modulo of a negative value in range', () => {
      assert.equal(modulo(42, -20), 22);
      assert.equal(modulo(42)(-20), 22);
    });
  });

  describe('random', () => {
    test('using default parameters', () => {
      const randomTwo = random(2);
      const result = randomTwo();
      assert.ok(result >= 0);
      assert.ok(result < 2);
    });

    test('using minimal limit', () => {
      const random1_3 = random(2, 1);
      const result = random1_3();
      assert.ok(result >= 1);
      assert.ok(result < 3);
    });

    test('using minimal limit and precision', () => {
      const random1_3_to_2dp = random(2, 1, 2);
      const result = random1_3_to_2dp();
      assert.ok(result >= 1);
      assert.ok(result < 3);

      const rnd = (max, min, mul, rand) =>
        Math.floor(rand * (max - min) * mul) / mul + min;
      assert.equal(rnd(2, 1, 100, 0.54321), 1.54);
    });
  });

  describe('roundBoundry', () => {
    describe('using default parameters (round)', () => {
      const roundDefault = roundBoundry(5);

      test('40 -> 40', () => {
        assert.equal(roundDefault(40), 40);
      });
      test('41 -> 40', () => {
        assert.equal(roundDefault(41), 40);
      });
      test('42 -> 40', () => {
        assert.equal(roundDefault(42), 40);
      });
      test('43 -> 45', () => {
        assert.equal(roundDefault(43), 45);
      });
      test('44 -> 45', () => {
        assert.equal(roundDefault(44), 45);
      });
      test('45 -> 45', () => {
        assert.equal(roundDefault(45), 45);
      });
    });

    describe('using specified method (ceil)', () => {
      const roundCeil = roundBoundry(5, 'ceil');

      test('40 -> 40', () => {
        assert.equal(roundCeil(40), 40);
      });
      test('41 -> 45', () => {
        assert.equal(roundCeil(41), 45);
      });
      test('42 -> 45', () => {
        assert.equal(roundCeil(42), 45);
      });
      test('43 -> 45', () => {
        assert.equal(roundCeil(43), 45);
      });
      test('44 -> 45', () => {
        assert.equal(roundCeil(44), 45);
      });
      test('45 -> 45', () => {
        assert.equal(roundCeil(45), 45);
      });
    });

    describe('using specified method (floor)', () => {
      const roundFloor = roundBoundry(5, 'floor');

      test('40 -> 40', () => {
        assert.equal(roundFloor(40), 40);
      });
      test('41 -> 40', () => {
        assert.equal(roundFloor(41), 40);
      });
      test('42 -> 40', () => {
        assert.equal(roundFloor(42), 40);
      });
      test('43 -> 40', () => {
        assert.equal(roundFloor(43), 40);
      });
      test('44 -> 40', () => {
        assert.equal(roundFloor(44), 40);
      });
      test('45 -> 45', () => {
        assert.equal(roundFloor(45), 45);
      });
    });
  });
});
