/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals';

import {
  compose,
  copyText,
  curry,
  enumerate,
  escapeRegExp,
  generateEnums,
  isRegExpPattern,
  lens,
  lensFn,
  memoize,
  parseJson,
  pasteText,
  regExpString,
  regExpTemplate,
  simd,
  sleep,
  stringifyJson,
} from './index.js';

describe('Tools', () => {
  describe('Clipboard Operations', () => {
    const mockReadText = jest.fn(() => Promise.resolve('Hello, World!'));
    beforeEach(() => {
      navigator.clipboard = {
        readText: mockReadText,
        writeText: jest.fn(),
      };
    });

    test('Copy Text', () => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(0);
      copyText('Hello, World!');

      expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
      expect(navigator.clipboard.writeText).toHaveBeenLastCalledWith(
        'Hello, World!'
      );
    });
    test('Paste Text', async () => {
      expect.assertions(3);
      expect(navigator.clipboard.readText).toHaveBeenCalledTimes(0);
      const result = await pasteText();
      expect(navigator.clipboard.readText).toHaveBeenCalledTimes(1);
      expect(result).toBe('Hello, World!');
    });
  });

  describe('Compose', () => {
    it('can combine functions', () => {
      function plusNine(int) {
        return int + 9;
      }
      const timesTweleve = int => int * 12;

      const composedFn = compose(
        plusNine,
        timesTweleve,
        function minusSix(int) {
          return int - 6;
        },
        int => int / 3
      );
      expect(((2 + 9) * 12 - 6) / 3).toBe(42);
      expect(composedFn(2)).toBe(42);
    });

    it('can provide the identify function by default ', () => {
      const composedFn = compose();
      expect(composedFn(42)).toBe(42);
    });
  });

  describe('Curry', () => {
    function cube(x, y, z) {
      return x * y * z;
    }

    describe('with no predefined args', () => {
      const cube_ = curry(cube);

      it('can create a curried function that will accept, all args all at once', () => {
        expect(cube_(2, 3, 7)).toBe(42);
      });

      it('can create a curried function that will accept, an arg followed by last two', () => {
        expect(cube_(2)(3, 7)).toBe(42);
        const cube_one = cube_(2);
        expect(cube_one(3, 7)).toBe(42);
      });

      it('can create a curried function that will accept, two args then last', () => {
        expect(cube_(2, 3)(7)).toBe(42);
        const cube_two = cube_(2, 3);
        expect(cube_two(7)).toBe(42);
      });

      it('can create a curried function that will accept, all args one at a time', () => {
        expect(cube_(2)(3)(7)).toBe(42);
        const cube_one = cube_(2);
        const cube_two = cube_one(3);
        expect(cube_two(7)).toBe(42);
      });
    });

    describe('with a single argument', () => {
      const cube2_ = curry(cube, 2);

      it('can create a curried function that will accept, all remaining args at once', () => {
        expect(cube2_(3, 7)).toBe(42);
      });

      it('can create a curried function that will accept, remaining args in subsequent calls', () => {
        expect(cube2_(3)(7)).toBe(42);
      });
    });

    describe('with a couple of arguments', () => {
      const cube2_3_ = curry(cube, 2, 3);

      it('can create a curried function that will accept, the remaining arg in the subsequent call', () => {
        expect(cube2_3_(7)).toBe(42);
      });
    });
  });

  describe('Enumerate', () => {
    describe('will throw an exception then called with', () => {
      it('a source parameter other than an Array or Object (E-IS)', () => {
        const exceptionTest = () =>
          Object.keys(enumerate('INVALID SOURCE ARGUMENT'));
        expect(exceptionTest).toThrow(
          'Error: E-IS The source argument supplied is not an Array or an Object.'
        );
      });

      it('a source parameter of null (E-IS)', () => {
        const exceptionTest = () => Object.keys(enumerate(null));
        expect(exceptionTest).toThrow(
          'Error: E-IS The source argument supplied is not an Array or an Object.'
        );
      });

      it('a source parameter of undefined (E-IS)', () => {
        const exceptionTest = () => Object.keys(enumerate(undefined));
        expect(exceptionTest).toThrow(
          'Error: E-IS The source argument supplied is not an Array or an Object.'
        );
      });

      it('an empty Object as source argument (E-NS)', () => {
        const exceptionTest = () => Object.keys(enumerate({}));
        expect(exceptionTest).toThrow(
          'Error: E-NS The source argument supplied is not populated with string keys.'
        );
      });

      it('an empty Array as source argument (E-NS)', () => {
        const exceptionTest = () => Object.keys(enumerate([]));
        expect(exceptionTest).toThrow(
          'Error: E-NS The source argument supplied is not populated with string keys.'
        );
      });

      it('a source argument Array populated with non-string data (E-NS)', () => {
        const exceptionTest = () => Object.keys(enumerate([42, false]));
        expect(exceptionTest).toThrow(
          'Error: E-NS The source argument supplied is not populated with string keys.'
        );
      });

      it('an unrecognised options (E-NR)', () => {
        const exceptionTest = () =>
          enumerate(['alpha', 'beta'], {
            unrecognisedOption: true,
          });
        expect(exceptionTest).toThrow(
          `Error: E-NR The option 'unrecognisedOption' is not a recognised option.`
        );
      });

      it('non-Boolean options (E-NB)', () => {
        const exceptionTest = () =>
          enumerate(['alpha', 'beta'], {
            numericValues: 0,
          });
        expect(exceptionTest).toThrow(
          `Error: E-NB The option 'numericValues' is not a Boolean value.`
        );
      });
    });

    describe('will return an object of Enumerated keys', () => {
      it('using a populated source string array', () => {
        const result = enumerate(['alpha', 'beta', 'deltaGamma']);
        expect(Object.keys(result).length).toBe(3);
        expect(result.alpha).toBe('alpha');
        expect(result.beta).toBe('beta');
        expect(result.deltaGamma).toBe('deltaGamma');
      });

      it('using a populated source object', () => {
        const result = enumerate({
          alpha: 'a',
          beta: 'b',
          deltaGamma: 'dG',
        });
        expect(Object.keys(result).length).toBe(3);
        expect(result.alpha).toBe('alpha');
        expect(result.beta).toBe('beta');
        expect(result.deltaGamma).toBe('deltaGamma');
      });

      it('with numeric values, using a populated source array', () => {
        const result = enumerate(['alpha', 'beta', 'deltaGamma'], {
          numericValues: true,
        });
        expect(Object.keys(result).length).toBe(3);
        expect(result.alpha).toBe(0);
        expect(result.beta).toBe(1);
        expect(result.deltaGamma).toBe(2);
      });

      it('with numeric values, using a populated source object', () => {
        const result = enumerate(
          { alpha: 'a', beta: 'b', deltaGamma: 'dG' },
          { numericValues: true }
        );
        expect(Object.keys(result).length).toBe(3);
        expect(result.alpha).toBe(0);
        expect(result.beta).toBe(1);
        expect(result.deltaGamma).toBe(2);
      });

      it('with constant properties, using a populated array', () => {
        const result = enumerate(
          [
            'alpha',
            'BETA',
            'deltaGamma',
            'Epsilon zeta',
            'EtaTheta',
            '  Iota  ',
            'Kappa_Lambda',
          ],
          {
            constantProperties: true,
          }
        );
        expect(Object.keys(result).length).toBe(7);
        expect(result.ALPHA).toBe('alpha');
        expect(result.BETA).toBe('BETA');
        expect(result.DELTA_GAMMA).toBe('deltaGamma');
        expect(result.EPSILON_ZETA).toBe('Epsilon zeta');
        expect(result.ETA_THETA).toBe('EtaTheta');
        expect(result.__IOTA__).toBe('  Iota  ');
        expect(result.KAPPA_LAMBDA).toBe('Kappa_Lambda');
      });
    });
  });

  describe('Lens', () => {
    const testObjects = {
      nullTest: null,
      emptyObject: {},
      emptyArray: [],

      simpleObject: { a: 42 },
      nestedObject: { a: { b: 42 } },
      complexObject: { a: { 'b c': 42 } },
      arrayInObject: { a: [42] },

      simpleArray: [42],
      nestedArray: [[42]],
      objectInArray: [{ b: 42 }],
    };
    describe('with missing item', () => {
      it('can be managed in a null object', () => {
        const lookup = lens('a');
        expect(lookup(testObjects.nullTest)).not.toBeDefined();
      });

      it('can be managed in an object', () => {
        const lookup = lens('a');
        expect(lookup(testObjects.emptyObject)).not.toBeDefined();
      });

      it('can be managed in an object (indirect args)', () => {
        const lookup = lens('a', 'c');
        expect(lookup(testObjects.emptyObject)).not.toBeDefined();
      });

      it('can be managed in an object (direct args)', () => {
        const lookup = lens('a.c');
        expect(lookup(testObjects.emptyObject)).not.toBeDefined();
      });

      it('can be managed in an object (optional args)', () => {
        const lookup = lens('a?.c');
        expect(lookup(testObjects.emptyObject)).not.toBeDefined();
      });

      it('can be managed in an array', () => {
        const lookup = lens(0);
        expect(lookup(testObjects.emptyArray)).not.toBeDefined();
      });
    });
    describe('locate an object property', () => {
      it('can be managed in an object', () => {
        const lookup = lens('a');
        expect(lookup(testObjects.simpleObject)).toBe(42);
      });

      it('can be managed in an object of an object (individual property args)', () => {
        const lookup = lens('a', 'b');
        expect(lookup(testObjects.nestedObject)).toBe(42);
      });

      it('can be managed in an object of an object (mandatory property args)', () => {
        const lookup = lens('a.b');
        expect(lookup(testObjects.nestedObject)).toBe(42);
      });

      it('can be managed in an object of an object (mandatory property args) (indirect combined)', () => {
        const lookup = lens('a["b c"]');
        expect(lookup(testObjects.complexObject)).toBe(42);
      });

      it('can be managed in an object of an object (mandatory property args) (indirect separate)', () => {
        const lookup = lens('a', '"b c"');
        expect(lookup(testObjects.complexObject)).toBe(42);
      });

      it('can be managed in an object of an object (optional property args)', () => {
        const lookup = lens('a?.b');
        expect(lookup(testObjects.nestedObject)).toBe(42);
      });

      it('can be managed in an array of an object (args)', () => {
        const lookup = lens('a', 0);
        expect(lookup(testObjects.arrayInObject)).toBe(42);
      });

      it('can be managed in an array of an object (string)', () => {
        const lookup = lens('a[0]');
        expect(lookup(testObjects.arrayInObject)).toBe(42);
      });

      it('can be managed in an object of an object (optional array args)', () => {
        const lookup = lens('a?.[0]');
        expect(lookup(testObjects.arrayInObject)).toBe(42);
      });
    });
    describe('locate an element of an array', () => {
      it('can be managed in an array', () => {
        const lookup = lens(0);
        expect(lookup(testObjects.simpleArray)).toBe(42);
      });

      it('can be managed in an object of an array (args)', () => {
        const lookup = lens(0, 'b');
        expect(lookup(testObjects.objectInArray)).toBe(42);
      });

      it('can be managed in an array of an array (string)', () => {
        const lookup = lens('[0][0]');
        expect(lookup(testObjects.nestedArray)).toBe(42);
      });

      it('can be managed in an array of an array (indexes)', () => {
        const lookup = lens(0, 0);
        expect(lookup(testObjects.nestedArray)).toBe(42);
      });
    });
  });

  describe('Lens Function', () => {
    const testData = {
      alpha: 'Hello, World!',
    };
    const ident = _ => _;

    it('does not execute the function when the property is undefined', () => {
      expect(lensFn(ident, 'beta')(testData)).not.toBeDefined();
    });

    it('does execute the function when the property is not undefined', () => {
      expect(lensFn(ident, 'alpha')(testData)).toBe('Hello, World!');
    });
  });

  describe('Memoise', () => {
    const mockDelayedCube = (x, y, z) => x * y * z;
    let delayedCube;

    beforeEach(() => {
      delayedCube = jest.fn(mockDelayedCube);
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('can increase globalCount for each call (not memoised)', () => {
      const callDelayedCube = () => delayedCube(2, 3, 7);
      expect(delayedCube).toHaveBeenCalledTimes(0);

      expect(callDelayedCube()).toBe(42);
      expect(delayedCube).toHaveBeenCalledTimes(1);

      expect(callDelayedCube()).toBe(42);
      expect(delayedCube).toHaveBeenCalledTimes(2);

      expect(callDelayedCube()).toBe(42);
      expect(delayedCube).toHaveBeenCalledTimes(3);
    });

    it('can increase globalCount just once for each call (memoised)', () => {
      const cache = new Map();
      const delayedCube_ = memoize(delayedCube, cache);
      const callDelayedCube = () => delayedCube_(2, 3, 7);
      expect(delayedCube).toHaveBeenCalledTimes(0);

      expect(callDelayedCube()).toBe(42);
      expect(delayedCube).toHaveBeenCalledTimes(1);

      expect(callDelayedCube()).toBe(42);
      expect(delayedCube).toHaveBeenCalledTimes(1);

      expect(callDelayedCube()).toBe(42);
      expect(delayedCube).toHaveBeenCalledTimes(1);
    });

    it('can increase globalCount just once for each call (memoised, default cache)', () => {
      const delayedCube_ = memoize(delayedCube);
      const callDelayedCube = () => delayedCube_(2, 3, 7);
      expect(delayedCube).toHaveBeenCalledTimes(0);

      expect(callDelayedCube()).toBe(42);
      expect(delayedCube).toHaveBeenCalledTimes(1);

      expect(callDelayedCube()).toBe(42);
      expect(delayedCube).toHaveBeenCalledTimes(1);

      expect(callDelayedCube()).toBe(42);
      expect(delayedCube).toHaveBeenCalledTimes(1);
    });
  });

  describe('SIMD', () => {
    async function is42({ title, args, func }) {
      const result = func(args);
      await sleep(500);
      if (result === 42) {
        return title;
      } else {
        throw Error(`${title} did not yield 42 but ${result}`);
      }
    }
    const is42Simd = simd(is42);

    test('examples', async () => {
      const results = await is42Simd(
        { title: 'identity true', args: 42, func: _ => _ },
        { title: 'identity false', args: 7, func: _ => _ }
      );
      expect(results.length).toBe(2);
      expect(results[0].status).toBe('fulfilled');
      expect(results[0].value).toBe('identity true');
      expect(results[1].status).toBe('rejected');
      expect(results[1].reason.message).toBe(
        'identity false did not yield 42 but 7'
      );
    });
  });

  describe('Sleep', () => {
    it('can delay progress by a given interval (within a period)', async () => {
      const timeStamp1 = new Date();
      await sleep(1000);
      const timeStamp2 = new Date();
      expect(timeStamp2 - timeStamp1).toBeLessThan(1021);
    });

    it('can delay progress by a given interval (greater than period)', async () => {
      const timeStamp1 = new Date();
      await sleep(1000);
      const timeStamp2 = new Date();
      expect(timeStamp2 - timeStamp1).toBeGreaterThan(999);
    });
  });

  describe('stringifyJson', () => {
    it('will return a data property containing a valid object as a JSON string', () => {
      expect(stringifyJson({ message: 'Hello, World!' })).toEqual({
        data: '{"message":"Hello, World!"}',
      });
    });
    it('will return an error property reporting the issue with an invalid object (circular structure)', () => {
      const obj1 = {};
      const obj2 = { obj1 };
      obj1.obj2 = obj2;

      const { error } = stringifyJson(obj2);
      expect(error).toBeDefined();
      expect(error).toEqual(`Converting circular structure to JSON
    --> starting at object with constructor 'Object'
    |     property 'obj1' -> object with constructor 'Object'
    --- property 'obj2' closes the circle`);
    });
    it('will return an error property reporting the issue with an invalid object (bigInt)', () => {
      const { error } = stringifyJson({ bigint: 42n });
      expect(error).toBeDefined();
      expect(error).toEqual(`Do not know how to serialize a BigInt`);
    });
  });

  describe('parseJson', () => {
    it('will return a data property containing a JSON string from a valid object', () => {
      expect(parseJson('{"message":"Hello, World!"}')).toEqual({
        data: { message: 'Hello, World!' },
      });
    });
    it('will return an error property reporting the issue with an invalid JSON string', () => {
      const { error } = parseJson(`{ "bigint": 42n }`);
      expect(error).toBeDefined();
      expect(error).toEqual(
        `Expected ',' or '}' after property value in JSON at position 14 (line 1 column 15)`
      );
    });
  });

  describe('generateEnums', () => {
    it('can generate enums from a compound object', () => {
      const result = generateEnums({
        shortDays: { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 },
        longDays: [
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
        ],
      });
      expect(result).toBeDefined();
      expect(result.shortDays).toBeDefined();
      expect(result.longDays).toBeDefined();

      const { shortDays, longDays } = result;
      expect(Object.keys(shortDays).length).toBe(7);
      expect(Object.keys(longDays).length).toBe(7);
    });
  });

  describe('escapeRegExp', () => {
    test('can leave an empty string unchanged', () => {
      expect(escapeRegExp()).toStrictEqual('');
    });
    test('can leave a normal string unchanged', () => {
      expect(escapeRegExp('Hello, World!')).toStrictEqual('Hello, World!');
    });
    test('can escape a valid regular expression pattern', () => {
      expect(escapeRegExp('^Hello,\\sWorld!?$')).toStrictEqual(
        '\\^Hello,\\\\sWorld!\\?\\$'
      );
    });
    test('can escape an invalid regular expression pattern', () => {
      expect(escapeRegExp('^[Hello,\\sWorld!?$')).toStrictEqual(
        '\\^\\[Hello,\\\\sWorld!\\?\\$'
      );
    });
  });

  describe('isRegExpPattern', () => {
    test('can reject an empty string', () => {
      expect(isRegExpPattern()).toStrictEqual(false);
    });
    test('can confirm a normal string', () => {
      expect(isRegExpPattern('Hello, World!')).toStrictEqual(true);
    });
    test('can confirm a valid regular expression pattern', () => {
      expect(isRegExpPattern('^Hello,\\sWorld!?$')).toStrictEqual(true);
    });
    test('can reject an invalid regular expression pattern', () => {
      expect(isRegExpPattern('^[Hello,\\sWorld!?$')).toStrictEqual(false);
    });
  });

  describe('regExpString', () => {
    test('can escape a template encoded regular expression', () => {
      expect(regExpString`^Hello,\sWorld!?$`).toStrictEqual(
        '^Hello,\\sWorld!?$'
      );
    });
  });

  describe('regExpTemplate', () => {
    it('can use an expanded pattern with default flags', () => {
      const testString = 'Hello, WorLd!';
      const testRETemplate = regExpTemplate();
      const testRegExp = testRETemplate`(
				[\sl]
			)`;

      const result = testString.split(testRegExp);
      expect(result.length).toBe(7);
    });

    it('can use an expanded pattern with custom flags', () => {
      const testString = 'Hello, WorLd!';
      const testRETemplate = regExpTemplate('i');
      const testRegExp = testRETemplate`(
				[\sl]
			)`;

      const result = testString.split(testRegExp);
      expect(result.length).toBe(9);
    });

    it('can use an expanded pattern with a full-line comments', () => {
      const testString = 'Hello, WorLd!';
      const testRETemplate = regExpTemplate();
      const testRegExp = testRETemplate`(
# Full-line comment
				[\sl] 
			)`;

      const result = testString.split(testRegExp);
      expect(result.length).toBe(7);
    });

    it('can use an expanded pattern with a mid-line comments', () => {
      const testString = 'Hello, WorLd!';
      const testRETemplate = regExpTemplate();
      const testRegExp = testRETemplate`(
				[\sl] # Mid-line comment
			)`;

      const result = testString.split(testRegExp);
      expect(result.length).toBe(7);
    });

    it('can use an expanded pattern with a escaped #', () => {
      const testString = 'Hello,#WorLd!';
      const testRETemplate = regExpTemplate();
      const testRegExp = testRETemplate`(
				[\#l] # Mid-line comment
			)`;

      const result = testString.split(testRegExp);
      expect(result.length).toBe(7);
    });
  });
});
