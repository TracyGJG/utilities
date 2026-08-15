import { describe, it, test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import {
  DATA_TYPES,
  compareObjectByProperty,
  dataType,
  flattenObject,
  isBase,
  isEmptyObject,
  isObject,
  objectEquality,
  reduceObject,
  referencedClone,
} from './index.js';

describe('Comparison and Cloning', () => {
  describe('compareObjectByProperty', () => {
    let testObjArray;

    beforeEach(() => {
      testObjArray = [
        { id: 1, name: 'Alpha' },
        { id: 2, name: 'Gamma' },
        { id: 6, name: 'Delta' },
        { id: 3, name: 'Beta' },
        { id: 4, name: 'Delta' },
        { id: 5, name: 'Beta' },
      ];
    });

    it('can produce an object comparator using a given property name (ascending)', () => {
      testObjArray.sort(compareObjectByProperty('name'));
      assert.strictEqual(testObjArray[0].name, 'Alpha');
      assert.strictEqual(testObjArray[0].id, 1);
      assert.strictEqual(testObjArray[1].name, 'Beta');
      assert.strictEqual(testObjArray[1].id, 3);
      assert.strictEqual(testObjArray[2].name, 'Beta');
      assert.strictEqual(testObjArray[2].id, 5);
      assert.strictEqual(testObjArray[4].name, 'Delta');
      assert.strictEqual(testObjArray[4].id, 4);
      assert.strictEqual(testObjArray[3].name, 'Delta');
      assert.strictEqual(testObjArray[3].id, 6);
      assert.strictEqual(testObjArray[5].name, 'Gamma');
      assert.strictEqual(testObjArray[5].id, 2);
    });

    it('can produce an object comparator using a given property name (descending)', () => {
      testObjArray.sort(compareObjectByProperty('name', false));
      assert.strictEqual(testObjArray[0].name, 'Gamma');
      assert.strictEqual(testObjArray[0].id, 2);
      assert.strictEqual(testObjArray[1].name, 'Delta');
      assert.strictEqual(testObjArray[1].id, 6);
      assert.strictEqual(testObjArray[2].name, 'Delta');
      assert.strictEqual(testObjArray[2].id, 4);
      assert.strictEqual(testObjArray[3].name, 'Beta');
      assert.strictEqual(testObjArray[3].id, 3);
      assert.strictEqual(testObjArray[4].name, 'Beta');
      assert.strictEqual(testObjArray[4].id, 5);
      assert.strictEqual(testObjArray[5].name, 'Alpha');
      assert.strictEqual(testObjArray[5].id, 1);
    });
  });

  describe('dataType', () => {
    describe('Enumerations', () => {
      it('has a values for 14 data types', () => {
        assert.equal(Object.keys(DATA_TYPES).length, 15);
      });

      it('has a value for the Array data type', () => {
        assert.equal(DATA_TYPES.ARRAY, 'array');
      });

      it('has a value for the Undefined data type', () => {
        assert.equal(DATA_TYPES.UNDEFINED, 'undefined');
      });
    });

    describe('Primitive Values', () => {
      it('can detect Undefined', () => {
        assert.equal(dataType(), 'undefined');
      });

      it('can detect Null', () => {
        assert.equal(dataType(null), 'null');
      });

      it('can detect NaN (Not a Number) as a Number', () => {
        assert.equal(dataType(NaN), 'number');
      });

      it('can detect Infinity as a Number', () => {
        assert.equal(dataType(Infinity), 'number');
      });
    });

    describe('Booleans', () => {
      it('can detect a literal', () => {
        assert.equal(dataType(false), 'boolean');
      });

      it('can detect an object', () => {
        assert.equal(dataType(Boolean()), 'boolean');
      });
    });

    describe('Numbers', () => {
      it('can detect a literal', () => {
        assert.equal(dataType(42), 'number');
      });

      it('can detect an object', () => {
        assert.equal(dataType(Number('42')), 'number');
      });
    });

    describe('Strings', () => {
      it('can detect a literal', () => {
        assert.equal(dataType('fourty-two'), 'string');
      });

      it('can detect a Template Literal', () => {
        assert.equal(dataType(`fourty-two`), 'string');
      });

      it('can detect an object', () => {
        assert.equal(dataType(String(42)), 'string');
      });
    });

    describe('Regular Expressions', () => {
      it('can detect a literal', () => {
        assert.equal(dataType(/42/), 'regexp');
      });

      it('can detect an object', () => {
        assert.equal(dataType(RegExp('42')), 'regexp');
      });
    });

    describe('Objects', () => {
      it('can detect an Object', () => {
        assert.equal(dataType({}), 'object');
      });

      it('can detect an Array', () => {
        assert.equal(dataType([]), 'array');
      });

      it('can detect an Error', () => {
        assert.equal(dataType(Error()), 'error');
      });

      it('can detect a Symbol', () => {
        assert.equal(dataType(Symbol()), 'symbol');
      });
    });

    describe('Big Integers', () => {
      it('can detect a literal', () => {
        assert.equal(dataType(42n), 'bigint');
      });

      it('can detect an object', () => {
        assert.equal(dataType(BigInt('42')), 'bigint');
      });
    });

    describe('From constructor', () => {
      it('can detect a Date', () => {
        assert.equal(dataType(new Date()), 'date');
      });

      it('can detect a Set', () => {
        assert.equal(dataType(new Set()), 'set');
      });

      it('can detect a Map', () => {
        assert.equal(dataType(new Map()), 'map');
      });
    });
  });

  describe.skip('Flatten Object', () => {
    test('an empty object', () => {
      const result = flattenObject({});
      assert.strictEqual(isObject(result)).toStrictEqual(true);
      assert.equal(Object.keys(result).length, 0);
    });

    test('an object of primitives', () => {
      const result = flattenObject({
        alpha: true,
        beta: 42,
        gamma: 'Hello, World!',
      });
      assert.strictEqual(isObject(result)).toStrictEqual(true);
      assert.equal(Object.keys(result).length, 3);
    });

    test('an object containing an array of primitives', () => {
      const result = flattenObject({
        delta: [true, 42, 'Hello, World!'],
      });
      assert.strictEqual(isObject(result)).toStrictEqual(true);
      assert.equal(Object.keys(result).length, 3);
      expect(result['delta[0]']).toStrictEqual(true);
      expect(result['delta[1]']).toStrictEqual(42);
      expect(result['delta[2]']).toStrictEqual('Hello, World!');
    });

    test('an object containing a nested object of primitives', () => {
      const result = flattenObject({
        delta: {
          alpha: true,
          beta: 42,
          gamma: 'Hello, World!',
        },
      });
      expect(isObject(result)).toStrictEqual(true);
      assert.equal(Object.keys(result).length).toEqual(3);
      expect(result['delta.alpha']).toStrictEqual(true);
      expect(result['delta.beta']).toStrictEqual(42);
      expect(result['delta.gamma']).toStrictEqual('Hello, World!');
    });

    test('an object containing an array containing an object', () => {
      const result = flattenObject({
        delta: [
          {
            alpha: true,
            beta: 42,
            gamma: 'Hello, World!',
          },
        ],
      });
      expect(isObject(result)).toStrictEqual(true);
      assert.equal(Object.keys(result).length).toEqual(3);
      expect(result['delta[0].alpha']).toStrictEqual(true);
      expect(result['delta[0].beta']).toStrictEqual(42);
      expect(result['delta[0].gamma']).toStrictEqual('Hello, World!');
    });

    test('an object containing a nested object containing an array', () => {
      const result = flattenObject({
        delta: {
          epsilon: [true, 42, 'Hello, World!'],
        },
      });
      expect(isObject(result)).toStrictEqual(true);
      assert.equal(Object.keys(result).length).toEqual(3);
      expect(result['delta.epsilon[0]']).toStrictEqual(true);
      expect(result['delta.epsilon[1]']).toStrictEqual(42);
      expect(result['delta.epsilon[2]']).toStrictEqual('Hello, World!');
    });
  });

  describe.skip('is Null or Undefined', () => {
    test('can confirm undefined is a base value', () => {
      expect(isBase(undefined)).toStrictEqual(true);
    });
    test('can confirm null is a base value', () => {
      expect(isBase(null)).toStrictEqual(true);
    });
    test('can confirm false is not a base value', () => {
      expect(isBase(false)).toStrictEqual(false);
    });
    test('can confirm true is not a base value', () => {
      expect(isBase(true)).toStrictEqual(false);
    });
    test('can confirm zero is not a base value', () => {
      expect(isBase(0)).toStrictEqual(false);
    });
    test('can confirm one is not a base value', () => {
      expect(isBase(1)).toStrictEqual(false);
    });
    test('can confirm minus one is not a base value', () => {
      expect(isBase(-1)).toStrictEqual(false);
    });
    test('can confirm an empty string is not a base value', () => {
      expect(isBase('')).toStrictEqual(false);
    });
    test('can confirm a populated string is not a base value', () => {
      expect(isBase('42')).toStrictEqual(false);
    });
    test('can confirm an empty array is not a base value', () => {
      expect(isBase([])).toStrictEqual(false);
    });
    test('can confirm an empty object is not a base value', () => {
      expect(isBase({})).toStrictEqual(false);
    });
  });

  describe.skip('is an Empty Object', () => {
    it('is false for a populated object', () => {
      let userDetails = {
        name: 'John Doe',
        username: 'jonnydoe',
        age: 14,
      };
      expect(isEmptyObject(userDetails)).toStrictEqual(false);
    });
    it('is true for a default object', () => {
      let myEmptyObj = {};
      expect(isEmptyObject(myEmptyObj)).toStrictEqual(true);
    });
    it('is null for a variable with a null value', () => {
      let nullObj = null;
      assert.equal(isEmptyObject(nullObj)).toBeNull();
    });
    it('is undefined for a variable of undefined value', () => {
      let undefinedObj;
      expect(isEmptyObject(undefinedObj)).not.toBeDefined();
    });
  });

  describe.skip('is an Object', () => {
    test('can confirm an empty object is an object', () => {
      const testCase = {};
      expect(isObject(testCase)).toStrictEqual(true);
    });
    test('can confirm a populated object is an object', () => {
      expect(isObject({ message: 'Hello World' })).toStrictEqual(true);
    });
    test('can confirm undefined is not an object', () => {
      expect(isObject(undefined)).toStrictEqual(false);
    });
    test('can confirm null is not an object', () => {
      expect(isObject(null)).toStrictEqual(false);
    });
    test('can confirm false is not an object', () => {
      expect(isObject(false)).toStrictEqual(false);
    });
    test('can confirm true is not an object', () => {
      expect(isObject(true)).toStrictEqual(false);
    });
    test('can confirm zero is not an object', () => {
      expect(isObject(0)).toStrictEqual(false);
    });
    test('can confirm one is not an object', () => {
      expect(isObject(1)).toStrictEqual(false);
    });
    test('can confirm minus one is not an object', () => {
      expect(isObject(-1)).toStrictEqual(false);
    });
    test('can confirm an empty string is not an object', () => {
      expect(isObject('')).toStrictEqual(false);
    });
    test('can confirm a populated string is not an object', () => {
      expect(isObject('42')).toStrictEqual(false);
    });
    test('can confirm an empty array is not an object', () => {
      const testCase = [];
      expect(isObject(testCase)).toStrictEqual(false);
    });
  });

  describe.skip('Object Equality', () => {
    it('can compare primitive strings (true)', () => {
      expect(objectEquality('42', '42')).toStrictEqual(true);
    });
    it('can compare primitive strings (false)', () => {
      expect(objectEquality('42', '_42_')).toStrictEqual(false);
    });
    it('can compare arrays (of strings) (true)', () => {
      expect(objectEquality(['42'], ['42'])).toStrictEqual(true);
    });
    it('can compare arrays (of strings) (false)', () => {
      expect(objectEquality(['42'], ['_42_'])).toStrictEqual(false);
    });
    it('can compare simple matching objects', () => {
      expect(objectEquality({ val: '42' }, { val: '42' })).toStrictEqual(true);
    });
    it('can compare simple non-matching objects (property)', () => {
      expect(objectEquality({ val: '42' }, { val_: '42' })).toStrictEqual(
        false,
      );
    });
    it('can compare simple non-matching objects (value)', () => {
      expect(objectEquality({ val: '42' }, { val: '_42_' })).toStrictEqual(
        false,
      );
    });
    it('can compare similar nested objects', () => {
      const obj1 = {
        strProp: 'Property 1',
        numProp: 2,
        blnProp: true,
        arrProp: ['alpha', 'beta', 'gamma'],
        objProp: {
          subProp: 'Sub Property',
        },
      };
      const obj2 = JSON.parse(JSON.stringify(obj1));

      expect(objectEquality(obj1, obj2)).toBeTruthy();
    });
    it('can compare object structures (same)', () => {
      const obj1 = {
        strProp: 'Property 1',
        numProp: 2,
        blnProp: true,
        arrProp: ['alpha', 'beta', 'gamma'],
        objProp: {
          subProp: 'Sub Property',
        },
      };
      const obj2 = JSON.parse(JSON.stringify(obj1));

      expect(objectEquality(obj1, obj2, true)).toBeTruthy();
    });
    it('can compare object structures (different value)', () => {
      const obj1 = {
        strProp: 'Property 1',
        numProp: 2,
        blnProp: true,
        arrProp: ['alpha', 'beta', 'gamma'],
        objProp: {
          subProp: 'Sub Property',
        },
      };
      const obj2 = JSON.parse(JSON.stringify(obj1));
      obj2.arrProp[2] = 'delta';

      expect(objectEquality(obj1, obj2, true)).toBeTruthy();
    });
    it('can compare object structures (different value)', () => {
      const obj1 = {
        strProp: 'Property 1',
        numProp: 2,
        blnProp: true,
        arrProp: ['alpha', 'beta', 'gamma'],
        objProp: {
          subProp: 'Sub Property',
        },
      };
      const obj2 = JSON.parse(JSON.stringify(obj1));
      obj2.arrProp[2] = 42;

      expect(objectEquality(obj1, obj2, true)).toBeFalsy();
    });

    it('can compare objects with dissimilar array lengths', () => {
      const obj1 = {
        strProp: 'Property 1',
        numProp: 2,
        blnProp: true,
        arrProp: ['alpha', 'beta', 'gamma'],
        objProp: {
          subProp: 'Sub Property',
        },
      };
      const obj2 = JSON.parse(JSON.stringify(obj1));
      obj2.arrProp.push('delta');

      expect(objectEquality(obj1, obj2)).toBeFalsy();
    });

    it('can compare objects that vary only be a single nested property value', () => {
      const obj1 = {
        strProp: 'Property 1',
        numProp: 2,
        blnProp: true,
        arrProp: ['alpha', 'beta', 'gamma'],
        objProp: {
          subProp: 'Sub Property',
        },
      };
      const obj2 = JSON.parse(JSON.stringify(obj1));
      obj2.objProp.subProp = 'Dif Property';

      expect(objectEquality(obj1, obj2)).toBeFalsy();
    });

    it('can compare objects that vary in structure by a single nested property', () => {
      const obj1 = {
        strProp: 'Property 1',
        numProp: 2,
        blnProp: true,
        arrProp: ['alpha', 'beta', 'gamma'],
        objProp: {
          subProp: 'Sub Property',
        },
      };
      const obj2 = JSON.parse(JSON.stringify(obj1));
      obj2.objProp.subProp2 = 'Additional Property';

      expect(objectEquality(obj1, obj2)).toBeFalsy();
    });
  });

  describe.skip('Object reducer', () => {
    test('reports an exception if there are no arguments', () => {
      const testException = () => reduceObject();

      expect(testException).toThrow(
        'Error: reduceObject requires at least 1 property name as a parameter.',
      );
    });

    test('can handle and empty source object', () => {
      const testFn = reduceObject('alpha');
      expect(testFn({})).toEqual({});
    });

    test('can handle a complete object mapping', () => {
      const testFn = reduceObject('alpha');
      expect(testFn({ alpha: 'A' })).toEqual({ alpha: 'A' });
    });

    test('can handle a partial object mapping', () => {
      const testFn = reduceObject('alpha');
      expect(testFn({ alpha: 'A', beta: 'B' })).toEqual({ alpha: 'A' });
    });

    test('can handle a mismatched object mapping', () => {
      const testFn = reduceObject('alpha');
      expect(testFn({ beta: 'B' })).toEqual({});
    });
  });

  describe.skip('Object referencedClone', () => {
    test('can accept null', () => {
      const testObject = null;
      let result = referencedClone(testObject);
      expect(result).toStrictEqual(null);
      expect(result).toEqual(testObject);
    });

    test('can accept an array', () => {
      const testObject = [];
      let result = referencedClone(testObject);
      expect(result).toStrictEqual([]);
      expect(result).toEqual(testObject);
    });

    test('can accept an empty object', () => {
      const testObject = {};
      let result = referencedClone(testObject);
      expect(result).toStrictEqual({});
      expect(result === testObject).toStrictEqual(false);
    });

    test('can accept an object containing array and object properties', () => {
      const testObject = {
        arr: [],
        obj: {},
      };
      let result = referencedClone(testObject);
      expect(result).toStrictEqual(testObject);
      expect(result.arr).toStrictEqual(testObject.arr);
      expect(result.obj).toStrictEqual(testObject.obj);
    });

    test('can accept an object with primitive properties', () => {
      const testObject = {
        bool: true,
        num: 42,
        str: 'Hello, World!',
        bigInt: 42n,
      };
      let result = referencedClone(testObject);
      expect(result).toStrictEqual(testObject);

      result.bool = false;
      result.num = 666;
      result.str = 'Goodbye cruel world';
      result.bigInt = 666n;

      expect(testObject.bool).toStrictEqual(false);
      expect(testObject.num).toStrictEqual(666);
      expect(testObject.str).toStrictEqual('Goodbye cruel world');
      expect(testObject.bigInt).toStrictEqual(666n);
    });

    test('can exclude properties', () => {
      const testObject = {
        bool: true,
        num: 42,
        str: 'Hello, World!',
        bigInt: 42n,
      };
      let result = referencedClone(testObject, ['str']);
      expect(result).not.toStrictEqual(testObject);

      const includedKeys = Object.keys(result);
      expect(includedKeys.length).toBe(3);
      expect(includedKeys.includes('str')).toStrictEqual(false);
    });

    test('can include properties', () => {
      const testObject = {
        bool: true,
        num: 42,
        str: 'Hello, World!',
        bigInt: 42n,
      };
      let result = referencedClone(testObject, ['str'], true);
      expect(result).not.toStrictEqual(testObject);

      const includedKeys = Object.keys(result);
      expect(includedKeys.length).toBe(1);
      expect(includedKeys.includes('str')).toStrictEqual(true);
    });
  });
});
