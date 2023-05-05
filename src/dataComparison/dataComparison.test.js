import { jest } from '@jest/globals';

import {
	DATA_TYPES,
	cloneObject,
	compareObjectByProperty,
	dataType,
	duplicateObject,
	isBase,
	isEmptyObject,
	isObject,
	objectEquality,
} from './index.js';

describe('Comparison and Cloning', () => {
	describe('Object is empty', () => {
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
	describe('Object Duplication', () => {
		it('can return self if object is null', () => {
			const result = cloneObject(null);
			expect(result).toBeNull();
		});
		it('can return self if object is an array', () => {
			const result = cloneObject([]);
			expect(Array.isArray(result)).toBeTruthy();
		});
		it('can duplicate an empty object', () => {
			const result = cloneObject({});
			expect(typeof result).toBe('object');
			expect(Object.keys(result).length).toBe(0);
		});
		it('can duplicate an object containing a Date property', () => {
			const result = cloneObject({ dt: new Date() });
			expect(typeof result).toBe('object');
			expect(Object.keys(result).length).toBe(1);
			expect(result.dt instanceof Date).toBeTruthy();
		});
		it('can exclude inherited properties', () => {
			const baseObject = { dt: new Date() };
			const testObject = {};
			testObject.__proto__ = baseObject;
			expect(testObject.dt).toBeTruthy();

			const resultObject = cloneObject(testObject);
			expect(typeof resultObject).toBe('object');
			expect(Object.keys(resultObject).length).toBe(0);
			expect(resultObject.dt).toBeFalsy();
		});
		it('can duplicate complex objects properties', () => {
			function testFn() {
				return this.message;
			}
			const testFnWithMessage = testFn.bind({ message: 'Hello World' });

			const testObject = {
				arrayOfPrimitives: [
					true,
					42,
					'Fourty-Two',
					null,
					undefined,
					Symbol('Fourty-Two'),
					42n,
					NaN,
					Infinity,
				],
				objectOfProperties: {
					dt: new Date(),
					re: /^Hello World$/i,
					fn: testFnWithMessage,
				},
			};

			const resultObject = duplicateObject(testObject);
			expect(typeof resultObject).toBe('object');
			expect(Object.keys(resultObject).length).toBe(2);
			expect(resultObject.arrayOfPrimitives.length).toBe(9);
			expect(Object.keys(resultObject.objectOfProperties).length).toBe(3);
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
	describe('isBase', () => {
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
	describe('isObject', () => {
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
});
