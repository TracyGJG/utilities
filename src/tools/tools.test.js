/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals';

import {
  copyText,
  decolour,
  enumerate,
  generateEnums,
  match,
  pasteText,
  sleep,
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

  describe('Decolour', () => {
    let result = '';

    async function asyncFn() {
      await sleep(50);
      return `Hello,`;
    }
    function syncFn(greet = 'Goodbye cruel') {
      result = `${greet} World!`;
    }

    it('converts an async operation to sync', async () => {
      expect(result).toBe('');

      decolour(asyncFn, syncFn);

      await sleep(60);
      expect(result).toBe(`Hello, World!`);
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

  describe('Match', () => {
    test('matching value', () => {
      const lookup = match(
        { alpha: 'ALPHA' },
        { beta: 'BETA' },
        { gamma: 'GAMMA' }
      );
      expect(lookup('beta')).toBe('BETA');
    });

    test('non-matching value', () => {
      const lookup = match(
        { alpha: 'ALPHA' },
        { beta: 'BETA' },
        { gamma: 'GAMMA' }
      );
      expect(lookup('delta')).toBe('ALPHA');
    });

    test('matching function', () => {
      const lookup = match(
        { alpha: () => 'ALPHA' },
        { beta: () => 'BETA' },
        { gamma: () => 'GAMMA' }
      );
      const result = lookup('beta');
      expect(typeof result).toBe('function');
      expect(result()).toBe('BETA');
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
});
