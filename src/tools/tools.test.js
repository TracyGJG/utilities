import { describe, it, test, beforeEach, afterEach, mock } from 'node:test';
import assert from 'node:assert/strict';

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
    const mockReadText = mock.fn(() => Promise.resolve('mockReadText'));
    const mockWriteText = mock.fn(() => {});
    beforeEach(() => {
      navigator.clipboard = {
        readText: mockReadText,
        writeText: mockWriteText,
      };
    });

    afterEach(() => {
      mockReadText.mock.resetCalls();
      mockWriteText.mock.resetCalls();
    });

    test('Copy Text', () => {
      assert.strictEqual(mockWriteText.mock.callCount(), 0);
      copyText('mockReadText');

      assert.strictEqual(mockWriteText.mock.callCount(), 1);
      assert.deepStrictEqual(mockWriteText.mock.calls[0].arguments, [
        'mockReadText',
      ]);
    });

    test('Paste Text', async () => {
      assert.strictEqual(mockReadText.mock.callCount(), 0);
      const result = await pasteText();
      assert.strictEqual(mockReadText.mock.callCount(), 1);
      assert.equal(result, 'mockReadText');
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
      assert.equal(result, '');

      decolour(asyncFn, syncFn);

      await sleep(60);
      assert.equal(result, `Hello, World!`);
    });
  });

  describe('Enumerate', () => {
    describe('will throw an exception then called with', () => {
      it('a source parameter other than an Array or Object (E-IS)', () => {
        const exceptionTest = () =>
          Object.keys(enumerate('INVALID SOURCE ARGUMENT'));
        assert.throws(
          exceptionTest,
          Error(
            'Error: E-IS The source argument supplied is not an Array or an Object.',
          ),
        );
      });

      it('a source parameter of null (E-IS)', () => {
        const exceptionTest = () => Object.keys(enumerate(null));
        assert.throws(
          exceptionTest,
          Error(
            'Error: E-IS The source argument supplied is not an Array or an Object.',
          ),
        );
      });

      it('a source parameter of undefined (E-IS)', () => {
        const exceptionTest = () => Object.keys(enumerate(undefined));
        assert.throws(
          exceptionTest,
          Error(
            'Error: E-IS The source argument supplied is not an Array or an Object.',
          ),
        );
      });

      it('an empty Object as source argument (E-NS)', () => {
        const exceptionTest = () => Object.keys(enumerate({}));
        assert.throws(
          exceptionTest,
          Error(
            'Error: E-NS The source argument supplied is not populated with string keys.',
          ),
        );
      });

      it('an empty Array as source argument (E-NS)', () => {
        const exceptionTest = () => Object.keys(enumerate([]));
        assert.throws(
          exceptionTest,
          Error(
            'Error: E-NS The source argument supplied is not populated with string keys.',
          ),
        );
      });

      it('a source argument Array populated with non-string data (E-NS)', () => {
        const exceptionTest = () => Object.keys(enumerate([42, false]));
        assert.throws(
          exceptionTest,
          Error(
            'Error: E-NS The source argument supplied is not populated with string keys.',
          ),
        );
      });

      it('an unrecognised options (E-NR)', () => {
        const exceptionTest = () =>
          enumerate(['alpha', 'beta'], {
            unrecognisedOption: true,
          });
        assert.throws(
          exceptionTest,
          Error(
            `Error: E-NR The option 'unrecognisedOption' is not a recognised option.`,
          ),
        );
      });

      it('non-Boolean options (E-NB)', () => {
        const exceptionTest = () =>
          enumerate(['alpha', 'beta'], {
            numericValues: 0,
          });
        assert.throws(
          exceptionTest,
          Error(
            `Error: E-NB The option 'numericValues' is not a Boolean value.`,
          ),
        );
      });
    });

    describe('will return an object of Enumerated keys', () => {
      it('using a populated source string array', () => {
        const result = enumerate(['alpha', 'beta', 'deltaGamma']);
        assert.equal(Object.keys(result).length, 3);
        assert.equal(result.alpha, 'alpha');
        assert.equal(result.beta, 'beta');
        assert.equal(result.deltaGamma, 'deltaGamma');
      });

      it('using a populated source object', () => {
        const result = enumerate({
          alpha: 'a',
          beta: 'b',
          deltaGamma: 'dG',
        });
        assert.equal(Object.keys(result).length, 3);
        assert.equal(result.alpha, 'alpha');
        assert.equal(result.beta, 'beta');
        assert.equal(result.deltaGamma, 'deltaGamma');
      });

      it('with numeric values, using a populated source array', () => {
        const result = enumerate(['alpha', 'beta', 'deltaGamma'], {
          numericValues: true,
        });
        assert.equal(Object.keys(result).length, 3);
        assert.equal(result.alpha, 0);
        assert.equal(result.beta, 1);
        assert.equal(result.deltaGamma, 2);
      });

      it('with numeric values, using a populated source object', () => {
        const result = enumerate(
          { alpha: 'a', beta: 'b', deltaGamma: 'dG' },
          { numericValues: true },
        );
        assert.equal(Object.keys(result).length, 3);
        assert.equal(result.alpha, 0);
        assert.equal(result.beta, 1);
        assert.equal(result.deltaGamma, 2);
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
          },
        );
        assert.equal(Object.keys(result).length, 7);
        assert.equal(result.ALPHA, 'alpha');
        assert.equal(result.BETA, 'BETA');
        assert.equal(result.DELTA_GAMMA, 'deltaGamma');
        assert.equal(result.EPSILON_ZETA, 'Epsilon zeta');
        assert.equal(result.ETA_THETA, 'EtaTheta');
        assert.equal(result.__IOTA__, '  Iota  ');
        assert.equal(result.KAPPA_LAMBDA, 'Kappa_Lambda');
      });
    });
  });

  describe('Match', () => {
    test('matching value', () => {
      const lookup = match(
        { alpha: 'ALPHA' },
        { beta: 'BETA' },
        { gamma: 'GAMMA' },
      );
      assert.equal(lookup('beta'), 'BETA');
    });

    test('non-matching value', () => {
      const lookup = match(
        { alpha: 'ALPHA' },
        { beta: 'BETA' },
        { gamma: 'GAMMA' },
      );
      assert.equal(lookup('delta'), 'ALPHA');
    });

    test('matching function', () => {
      const lookup = match(
        { alpha: () => 'ALPHA' },
        { beta: () => 'BETA' },
        { gamma: () => 'GAMMA' },
      );
      const result = lookup('beta');
      assert.equal(typeof result, 'function');
      assert.equal(result(), 'BETA');
    });
  });

  describe('Sleep', () => {
    it('can delay progress by a given interval (within a period)', async () => {
      const timeStamp1 = new Date();
      await sleep(1000);
      const timeStamp2 = new Date();
      assert.ok(timeStamp2 - timeStamp1 < 1021);
    });

    it('can delay progress by a given interval (greater than period)', async () => {
      const timeStamp1 = new Date();
      await sleep(1000);
      const timeStamp2 = new Date();
      assert.ok(timeStamp2 - timeStamp1 > 999);
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
      assert.notEqual(result, undefined);
      assert.notEqual(result.shortDays, undefined);
      assert.notEqual(result.longDays, undefined);

      const { shortDays, longDays } = result;
      assert.equal(Object.keys(shortDays).length, 7);
      assert.equal(Object.keys(longDays).length, 7);
    });
  });
});
