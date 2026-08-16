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
      assert.equal(testObjArray[0].name, 'Alpha');
      assert.equal(testObjArray[0].id, 1);
      assert.equal(testObjArray[1].name, 'Beta');
      assert.equal(testObjArray[1].id, 3);
      assert.equal(testObjArray[2].name, 'Beta');
      assert.equal(testObjArray[2].id, 5);
      assert.equal(testObjArray[4].name, 'Delta');
      assert.equal(testObjArray[4].id, 4);
      assert.equal(testObjArray[3].name, 'Delta');
      assert.equal(testObjArray[3].id, 6);
      assert.equal(testObjArray[5].name, 'Gamma');
      assert.equal(testObjArray[5].id, 2);
    });

    it('can produce an object comparator using a given property name (descending)', () => {
      testObjArray.sort(compareObjectByProperty('name', false));
      assert.equal(testObjArray[0].name, 'Gamma');
      assert.equal(testObjArray[0].id, 2);
      assert.equal(testObjArray[1].name, 'Delta');
      assert.equal(testObjArray[1].id, 6);
      assert.equal(testObjArray[2].name, 'Delta');
      assert.equal(testObjArray[2].id, 4);
      assert.equal(testObjArray[3].name, 'Beta');
      assert.equal(testObjArray[3].id, 3);
      assert.equal(testObjArray[4].name, 'Beta');
      assert.equal(testObjArray[4].id, 5);
      assert.equal(testObjArray[5].name, 'Alpha');
      assert.equal(testObjArray[5].id, 1);
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

  describe('Flatten Object', () => {
    test('an empty object', () => {
      const result = flattenObject({});
      assert.equal(isObject(result), true);
      assert.equal(Object.keys(result).length, 0);
    });

    test('an object of primitives', () => {
      const result = flattenObject({
        alpha: true,
        beta: 42,
        gamma: 'Hello, World!',
      });
      assert.equal(isObject(result), true);
      assert.equal(Object.keys(result).length, 3);
    });

    test('an object containing an array of primitives', () => {
      const result = flattenObject({
        delta: [true, 42, 'Hello, World!'],
      });
      assert.equal(isObject(result), true);
      assert.equal(Object.keys(result).length, 3);
      assert.equal(result['delta[0]'], true);
      assert.equal(result['delta[1]'], 42);
      assert.equal(result['delta[2]'], 'Hello, World!');
    });

    test('an object containing a nested object of primitives', () => {
      const result = flattenObject({
        delta: {
          alpha: true,
          beta: 42,
          gamma: 'Hello, World!',
        },
      });
      assert.equal(isObject(result), true);
      assert.equal(Object.keys(result).length, 3);
      assert.equal(result['delta.alpha'], true);
      assert.equal(result['delta.beta'], 42);
      assert.equal(result['delta.gamma'], 'Hello, World!');
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
      assert.equal(isObject(result), true);
      assert.equal(Object.keys(result).length, 3);
      assert.equal(result['delta[0].alpha'], true);
      assert.equal(result['delta[0].beta'], 42);
      assert.equal(result['delta[0].gamma'], 'Hello, World!');
    });

    test('an object containing a nested object containing an array', () => {
      const result = flattenObject({
        delta: {
          epsilon: [true, 42, 'Hello, World!'],
        },
      });
      assert.equal(isObject(result), true);
      assert.equal(Object.keys(result).length, 3);
      assert.equal(result['delta.epsilon[0]'], true);
      assert.equal(result['delta.epsilon[1]'], 42);
      assert.equal(result['delta.epsilon[2]'], 'Hello, World!');
    });
  });

  describe('is Null or Undefined', () => {
    test('can confirm undefined is a base value', () => {
      assert.ok(isBase(undefined));
    });
    test('can confirm null is a base value', () => {
      assert.ok(isBase(null));
    });
    test('can confirm false is not a base value', () => {
      assert.ok(!isBase(false));
    });
    test('can confirm true is not a base value', () => {
      assert.ok(!isBase(true));
    });
    test('can confirm zero is not a base value', () => {
      assert.ok(!isBase(0));
    });
    test('can confirm one is not a base value', () => {
      assert.ok(!isBase(1));
    });
    test('can confirm minus one is not a base value', () => {
      assert.ok(!isBase(-1));
    });
    test('can confirm an empty string is not a base value', () => {
      assert.ok(!isBase(''));
    });
    test('can confirm a populated string is not a base value', () => {
      assert.ok(!isBase('42'));
    });
    test('can confirm an empty array is not a base value', () => {
      assert.ok(!isBase([]));
    });
    test('can confirm an empty object is not a base value', () => {
      assert.ok(!isBase({}));
    });
  });

  describe('is an Empty Object', () => {
    it('is false for a populated object', () => {
      let userDetails = {
        name: 'John Doe',
        username: 'jonnydoe',
        age: 14,
      };
      assert.ok(!isEmptyObject(userDetails));
    });
    it('is true for a default object', () => {
      let myEmptyObj = {};
      assert.ok(isEmptyObject(myEmptyObj));
    });
    it('is null for a variable with a null value', () => {
      let nullObj = null;
      assert.ok(!isEmptyObject(nullObj));
    });
    it('is undefined for a variable of undefined value', () => {
      let undefinedObj;
      assert.ok(!isEmptyObject(undefinedObj));
    });
  });

  describe('is an Object', () => {
    test('can confirm an empty object is an object', () => {
      assert.ok(isObject({}));
    });
    test('can confirm a populated object is an object', () => {
      assert.ok(isObject({ message: 'Hello World' }));
    });
    test('can confirm undefined is not an object', () => {
      assert.ok(!isObject(undefined));
    });
    test('can confirm null is not an object', () => {
      assert.ok(!isObject(null));
    });
    test('can confirm false is not an object', () => {
      assert.ok(!isObject(false));
    });
    test('can confirm true is not an object', () => {
      assert.ok(!isObject(true));
    });
    test('can confirm zero is not an object', () => {
      assert.ok(!isObject(0));
    });
    test('can confirm one is not an object', () => {
      assert.ok(!isObject(1));
    });
    test('can confirm minus one is not an object', () => {
      assert.ok(!isObject(-1));
    });
    test('can confirm an empty string is not an object', () => {
      assert.ok(!isObject(''));
    });
    test('can confirm a populated string is not an object', () => {
      assert.ok(!isObject('42'));
    });
    test('can confirm an empty array is not an object', () => {
      const testCase = [];
      assert.ok(!isObject(testCase));
    });
  });

  describe('Object Equality', () => {
    it('can compare primitive strings (true)', () => {
      assert.ok(objectEquality('42', '42'));
    });
    it('can compare primitive strings (false)', () => {
      assert.ok(!objectEquality('42', '_42_'));
    });
    it('can compare arrays (of strings) (true)', () => {
      assert.ok(objectEquality(['42'], ['42']));
    });
    it('can compare arrays (of strings) (false)', () => {
      assert.ok(!objectEquality(['42'], ['_42_']));
    });
    it('can compare simple matching objects', () => {
      assert.ok(objectEquality({ val: '42' }, { val: '42' }));
    });
    it('can compare simple non-matching objects (property)', () => {
      assert.ok(!objectEquality({ val: '42' }, { val_: '42' }));
    });
    it('can compare simple non-matching objects (value)', () => {
      assert.ok(!objectEquality({ val: '42' }, { val: '_42_' }));
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

      assert.ok(objectEquality(obj1, obj2));
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

      assert.ok(objectEquality(obj1, obj2, true));
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

      assert.ok(objectEquality(obj1, obj2, true));
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

      assert.ok(!objectEquality(obj1, obj2, true));
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

      assert.ok(!objectEquality(obj1, obj2));
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

      assert.ok(!objectEquality(obj1, obj2));
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

      assert.ok(!objectEquality(obj1, obj2));
    });
  });

  describe('Object reducer', () => {
    test('reports an exception if there are no arguments', () => {
      const testException = () => reduceObject();

      assert.throws(
        testException,
        Error(
          'Error: reduceObject requires at least 1 property name as a parameter.',
        ),
      );
    });

    test('can handle and empty source object', () => {
      const testFn = reduceObject('alpha');
      assert.deepStrictEqual(testFn({}), {});
    });

    test('can handle a complete object mapping', () => {
      const testFn = reduceObject('alpha');
      assert.deepStrictEqual(testFn({ alpha: 'A' }), { alpha: 'A' });
    });

    test('can handle a partial object mapping', () => {
      const testFn = reduceObject('alpha');
      assert.notStrictEqual(testFn({ alpha: 'A', beta: 'B' }), { alpha: 'A' });
    });

    test('can handle a mismatched object mapping', () => {
      const testFn = reduceObject('alpha');
      assert.notStrictEqual(testFn({ beta: 'B' }), {});
    });
  });

  describe('Object referencedClone', () => {
    test('can accept null', () => {
      const testObject = null;
      let result = referencedClone(testObject);
      assert.ok(!result);
      assert.equal(result, testObject);
    });

    test('can accept an array', () => {
      const testObject = [];
      let result = referencedClone(testObject);
      assert.deepStrictEqual(result, []);
      assert.equal(result, testObject);
    });

    test('can accept an empty object', () => {
      const testObject = {};
      let result = referencedClone(testObject);
      assert.deepStrictEqual(result, {});
      assert.ok(result !== testObject);
    });

    test('can accept an object containing array and object properties', () => {
      const testObject = {
        arr: [],
        obj: {},
      };
      let result = referencedClone(testObject);
      assert.deepStrictEqual(result, testObject);
      assert.strictEqual(result.arr, testObject.arr);
      assert.strictEqual(result.obj, testObject.obj);
    });

    test('can accept an object with primitive properties', () => {
      const testObject = {
        bool: true,
        num: 42,
        str: 'Hello, World!',
        bigInt: 42n,
      };
      let result = referencedClone(testObject);
      assert.deepStrictEqual(result, testObject);

      result.bool = false;
      result.num = 666;
      result.str = 'Goodbye cruel world';
      result.bigInt = 666n;

      assert.ok(!testObject.bool);
      assert.equal(testObject.num, 666);
      assert.equal(testObject.str, 'Goodbye cruel world');
      assert.equal(testObject.bigInt, 666n);
    });

    test('can exclude properties', () => {
      const testObject = {
        bool: true,
        num: 42,
        str: 'Hello, World!',
        bigInt: 42n,
      };
      let result = referencedClone(testObject, ['str']);
      assert.notStrictEqual(result, testObject);

      const includedKeys = Object.keys(result);
      assert.equal(includedKeys.length, 3);
      assert.ok(!includedKeys.includes('str'));
    });

    test('can include properties', () => {
      const testObject = {
        bool: true,
        num: 42,
        str: 'Hello, World!',
        bigInt: 42n,
      };
      let result = referencedClone(testObject, ['str'], true);
      assert.notStrictEqual(result, testObject);

      const includedKeys = Object.keys(result);
      assert.equal(includedKeys.length, 1);
      assert.ok(includedKeys.includes('str'));
    });
  });
});
