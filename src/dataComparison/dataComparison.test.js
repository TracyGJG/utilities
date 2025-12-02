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
      expect(testObjArray[0].name).toEqual('Alpha');
      expect(testObjArray[0].id).toEqual(1);
      expect(testObjArray[1].name).toEqual('Beta');
      expect(testObjArray[1].id).toEqual(3);
      expect(testObjArray[2].name).toEqual('Beta');
      expect(testObjArray[2].id).toEqual(5);
      expect(testObjArray[4].name).toEqual('Delta');
      expect(testObjArray[4].id).toEqual(4);
      expect(testObjArray[3].name).toEqual('Delta');
      expect(testObjArray[3].id).toEqual(6);
      expect(testObjArray[5].name).toEqual('Gamma');
      expect(testObjArray[5].id).toEqual(2);
    });

    it('can produce an object comparator using a given property name (descending)', () => {
      testObjArray.sort(compareObjectByProperty('name', false));
      expect(testObjArray[0].name).toEqual('Gamma');
      expect(testObjArray[0].id).toEqual(2);
      expect(testObjArray[1].name).toEqual('Delta');
      expect(testObjArray[1].id).toEqual(6);
      expect(testObjArray[2].name).toEqual('Delta');
      expect(testObjArray[2].id).toEqual(4);
      expect(testObjArray[3].name).toEqual('Beta');
      expect(testObjArray[3].id).toEqual(3);
      expect(testObjArray[4].name).toEqual('Beta');
      expect(testObjArray[4].id).toEqual(5);
      expect(testObjArray[5].name).toEqual('Alpha');
      expect(testObjArray[5].id).toEqual(1);
    });
  });

  describe('dataType', () => {
    describe('Enumerations', () => {
      it('has a values for 14 data types', () => {
        expect(Object.keys(DATA_TYPES).length).toBe(15);
      });

      it('has a value for the Array data type', () => {
        expect(DATA_TYPES.ARRAY).toBe('array');
      });

      it('has a value for the Undefined data type', () => {
        expect(DATA_TYPES.UNDEFINED).toBe('undefined');
      });
    });

    describe('Primitive Values', () => {
      it('can detect Undefined', () => {
        expect(dataType()).toEqual('undefined');
      });

      it('can detect Null', () => {
        expect(dataType(null)).toEqual('null');
      });

      it('can detect NaN (Not a Number) as a Number', () => {
        expect(dataType(NaN)).toEqual('number');
      });

      it('can detect Infinity as a Number', () => {
        expect(dataType(Infinity)).toEqual('number');
      });
    });

    describe('Booleans', () => {
      it('can detect a literal', () => {
        expect(dataType(false)).toEqual('boolean');
      });

      it('can detect an object', () => {
        expect(dataType(Boolean())).toEqual('boolean');
      });
    });

    describe('Numbers', () => {
      it('can detect a literal', () => {
        expect(dataType(42)).toEqual('number');
      });

      it('can detect an object', () => {
        expect(dataType(Number('42'))).toEqual('number');
      });
    });

    describe('Strings', () => {
      it('can detect a literal', () => {
        expect(dataType('fourty-two')).toEqual('string');
      });

      it('can detect a Template Literal', () => {
        expect(dataType(`fourty-two`)).toEqual('string');
      });

      it('can detect an object', () => {
        expect(dataType(String(42))).toEqual('string');
      });
    });

    describe('Regular Expressions', () => {
      it('can detect a literal', () => {
        expect(dataType(/42/)).toEqual('regexp');
      });

      it('can detect an object', () => {
        expect(dataType(RegExp('42'))).toEqual('regexp');
      });
    });

    describe('Objects', () => {
      it('can detect an Object', () => {
        expect(dataType({})).toEqual('object');
      });

      it('can detect an Array', () => {
        expect(dataType([])).toEqual('array');
      });

      it('can detect an Error', () => {
        expect(dataType(Error())).toEqual('error');
      });

      it('can detect a Symbol', () => {
        expect(dataType(Symbol())).toEqual('symbol');
      });
    });

    describe('Big Integers', () => {
      it('can detect a literal', () => {
        expect(dataType(42n)).toEqual('bigint');
      });

      it('can detect an object', () => {
        expect(dataType(BigInt('42'))).toEqual('bigint');
      });
    });

    describe('From constructor', () => {
      it('can detect a Date', () => {
        expect(dataType(new Date())).toEqual('date');
      });

      it('can detect a Set', () => {
        expect(dataType(new Set())).toEqual('set');
      });

      it('can detect a Map', () => {
        expect(dataType(new Map())).toEqual('map');
      });
    });
  });

  describe('Flatten Object', () => {
    test('an empty object', () => {
      const result = flattenObject({});
      expect(isObject(result)).toStrictEqual(true);
      expect(Object.keys(result).length).toEqual(0);
    });

    test('an object of primitives', () => {
      const result = flattenObject({
        alpha: true,
        beta: 42,
        gamma: 'Hello, World!',
      });
      expect(isObject(result)).toStrictEqual(true);
      expect(Object.keys(result).length).toEqual(3);
    });

    test('an object containing an array of primitives', () => {
      const result = flattenObject({
        delta: [true, 42, 'Hello, World!'],
      });
      expect(isObject(result)).toStrictEqual(true);
      expect(Object.keys(result).length).toEqual(3);
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
      expect(Object.keys(result).length).toEqual(3);
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
      expect(Object.keys(result).length).toEqual(3);
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
      expect(Object.keys(result).length).toEqual(3);
      expect(result['delta.epsilon[0]']).toStrictEqual(true);
      expect(result['delta.epsilon[1]']).toStrictEqual(42);
      expect(result['delta.epsilon[2]']).toStrictEqual('Hello, World!');
    });
  });

  describe('is Null or Undefined', () => {
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

  describe('is an Empty Object', () => {
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
      expect(isEmptyObject(nullObj)).toBeNull();
    });
    it('is undefined for a variable of undefined value', () => {
      let undefinedObj;
      expect(isEmptyObject(undefinedObj)).not.toBeDefined();
    });
  });

  describe('is an Object', () => {
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

  describe('Object Equality', () => {
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
        false
      );
    });
    it('can compare simple non-matching objects (value)', () => {
      expect(objectEquality({ val: '42' }, { val: '_42_' })).toStrictEqual(
        false
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

  describe('Object reducer', () => {
    test('reports an exception if there are no arguments', () => {
      const testException = () => reduceObject();

      expect(testException).toThrow(
        'Error: reduceObject requires at least 1 property name as a parameter.'
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

  describe('Object referencedClone', () => {
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
