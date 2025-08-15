/**
 * @jest-environment jsdom
 */

import { afterEach, beforeEach, jest } from '@jest/globals';

import {
  sanatise,
  debounce,
  throttle,
  poller,
  mockTimeoutFunctions,
  mockIntervalFunctions,
  duplicateElementIds,
} from './index.js';

import { sleep } from '../tools';

const untrustedText = `<script>
	(() => {
		alert('Hello World')
	})();
</script>`;

const trustedText = `&lt;script&gt;
	(() =&gt; {
		alert('Hello World')
	})();
&lt;/script&gt;`;

describe('DOM utilities', () => {
  afterAll(() => {
    jest.resetAllMocks();
  });

  describe('sanitize user/untrusted input (sanatise)', () => {
    test('can be performed using a parent element', () => {
      const parent = {
        createElement(_domElement) {
          return {
            textContent: '',
            innerHTML: 'Sanitised Text',
          };
        },
      };

      const result = sanatise(untrustedText, parent);

      expect(result).toBeDefined();
      expect(result.length).toBe(14);
      expect(result).toBe('Sanitised Text');
    });

    test('can be performed using the default Document', () => {
      const result = sanatise(untrustedText);

      expect(result).toBeDefined();
      expect(result.length).toBe(73);
      expect(result).toBe(trustedText);
    });
  });

  describe('debounce a callback', () => {
    let callCount;
    function incCount() {
      callCount += 1;
    }

    beforeEach(() => {
      callCount = 0;
    });

    test('will only be called after being idle for the default 1 second', async () => {
      const debounced = debounce(incCount);
      expect(callCount).toBe(0);

      debounced();
      await sleep(500);

      debounced();
      await sleep(500);
      expect(callCount).toBe(0);

      await sleep(600);
      expect(callCount).toBe(1);
    });

    test('will only be called after being idle for the stipulated 2 second', async () => {
      const debounced = debounce(incCount, 2000);
      expect(callCount).toBe(0);

      debounced();
      await sleep(500);

      debounced();
      await sleep(500);
      expect(callCount).toBe(0);

      await sleep(600);
      expect(callCount).toBe(0);

      await sleep(1000);
      expect(callCount).toBe(1);
    });
  });

  describe('throttle a callback', () => {
    let callCount;
    function incCount() {
      callCount += 1;
    }

    beforeEach(() => {
      callCount = 0;
    });

    test('will only be called once every default 1 second', async () => {
      const throttled = throttle(incCount);
      expect(callCount).toBe(0);

      throttled();
      expect(callCount).toBe(0);

      throttled();
      expect(callCount).toBe(0);
      await sleep(1200);

      expect(callCount).toBe(1);
      throttled();
      expect(callCount).toBe(1);
    });

    test('will only be called once every stipulated 2 second', async () => {
      const throttled = throttle(incCount, 2000);
      expect(callCount).toBe(0);

      throttled();
      expect(callCount).toBe(0);

      throttled();
      expect(callCount).toBe(0);
      await sleep(1200);

      expect(callCount).toBe(1);
      throttled();
      expect(callCount).toBe(1);

      await sleep(1200);
      throttled();
      expect(callCount).toBe(2);
    });
  });

  describe('poller', () => {
    let counter = 0;
    const checkCount = jest.fn(() => counter % 2);
    const incCount = jest.fn(() => counter++);
    const mockSetInterval = jest.fn(() => 'Set Interval');
    const mockClearInterval = jest.fn();

    window.setInterval = mockSetInterval;
    window.clearInterval = mockClearInterval;

    beforeEach(() => {
      counter = 0;
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    test('can execute an action', () => {
      expect(mockSetInterval).toHaveBeenCalledTimes(0);
      expect(mockClearInterval).toHaveBeenCalledTimes(0);

      const result = poller(100, 5, checkCount, incCount);

      expect(result).toBeDefined();
      expect(mockSetInterval).toHaveBeenCalledTimes(1);
      expect(mockSetInterval.mock.calls[0][1]).toBe(100);
      expect(mockClearInterval).toHaveBeenCalledTimes(0);

      const callbackFn = mockSetInterval.mock.calls[0][0];
      expect(checkCount).toHaveBeenCalledTimes(0);
      callbackFn();
      expect(checkCount).toHaveBeenCalledTimes(1);

      counter = 3;
      callbackFn();
      expect(mockClearInterval).toHaveBeenCalledTimes(1);
      expect(checkCount).toHaveBeenCalledTimes(2);
    });
  });

  describe('mockTimeoutFunctions', () => {
    let timeoutCallback;

    beforeEach(() => {
      timeoutCallback = jest.fn(() => 42);
    });
    afterEach(() => {
      jest.resetAllMocks();
    });

    test('exposes required methods', () => {
      const timeoutFunctions = mockTimeoutFunctions();

      expect(timeoutFunctions).toBeDefined();
      expect(timeoutFunctions.clockTick).toBeDefined();
      expect(timeoutFunctions.setTimeout).toBeDefined();
      expect(timeoutFunctions.clearTimeout).toBeDefined();

      expect(typeof timeoutFunctions.clockTick).toBe('function');
      expect(typeof timeoutFunctions.setTimeout).toBe('function');
      expect(typeof timeoutFunctions.clearTimeout).toBe('function');
    });

    test('default behaviour (completed)', () => {
      const { clockTick, setTimeout } = mockTimeoutFunctions();

      expect(timeoutCallback).toHaveBeenCalledTimes(0);
      let timeout = setTimeout(timeoutCallback, 200);
      expect(timeout).toBeDefined();

      expect(timeoutCallback).toHaveBeenCalledTimes(0);
      expect(clockTick(timeout, 100)).toStrictEqual(null);

      expect(timeoutCallback).toHaveBeenCalledTimes(0);
      expect(clockTick(timeout, 100)).toStrictEqual(42);

      expect(timeoutCallback).toHaveBeenCalledTimes(1);
      expect(clockTick(timeout, 100)).toStrictEqual(undefined);
    });

    test('default behaviour (cancelled)', () => {
      const { clockTick, setTimeout, clearTimeout } = mockTimeoutFunctions();

      expect(timeoutCallback).toHaveBeenCalledTimes(0);
      let timeout = setTimeout(timeoutCallback, 200);
      expect(timeout).toBeDefined();

      expect(timeoutCallback).toHaveBeenCalledTimes(0);
      expect(clockTick(timeout, 100)).toStrictEqual(null);

      expect(timeoutCallback).toHaveBeenCalledTimes(0);
      expect(clearTimeout(timeout)).toStrictEqual(true);

      expect(timeoutCallback).toHaveBeenCalledTimes(0);
      expect(clockTick(timeout, 100)).toStrictEqual(undefined);
    });
  });

  describe('mockIntervalFunctions', () => {
    let intervalCallback;

    beforeEach(() => {
      intervalCallback = jest.fn(() => 42);
    });
    afterEach(() => {
      jest.resetAllMocks();
    });

    test('exposes required methods', () => {
      const intervalFunctions = mockIntervalFunctions();

      expect(intervalFunctions).toBeDefined();
      expect(intervalFunctions.clockTick).toBeDefined();
      expect(intervalFunctions.setInterval).toBeDefined();
      expect(intervalFunctions.clearInterval).toBeDefined();

      expect(typeof intervalFunctions.clockTick).toBe('function');
      expect(typeof intervalFunctions.setInterval).toBe('function');
      expect(typeof intervalFunctions.clearInterval).toBe('function');
    });

    test('default behaviour', () => {
      const { clockTick, setInterval, clearInterval } = mockIntervalFunctions();

      expect(intervalCallback).toHaveBeenCalledTimes(0);
      let timeout = setInterval(intervalCallback, 120);
      expect(timeout).toBeDefined();

      expect(intervalCallback).toHaveBeenCalledTimes(0);
      expect(clockTick(timeout, 100)).toStrictEqual(null);

      expect(intervalCallback).toHaveBeenCalledTimes(0);
      expect(clockTick(timeout, 100)).toStrictEqual(42);

      expect(intervalCallback).toHaveBeenCalledTimes(1);
      expect(clockTick(timeout, 200)).toStrictEqual(42);

      expect(intervalCallback).toHaveBeenCalledTimes(2);
      expect(clockTick(timeout, 100)).toStrictEqual(null);

      expect(intervalCallback).toHaveBeenCalledTimes(2);
      expect(clockTick(timeout, 100)).toStrictEqual(42);

      expect(intervalCallback).toHaveBeenCalledTimes(3);
      expect(clockTick(timeout, 100)).toStrictEqual(null);

      expect(clearInterval(timeout)).toStrictEqual(true);
      expect(clockTick(timeout, 100)).toStrictEqual(undefined);
      expect(clearInterval(timeout)).toStrictEqual(false);
    });
  });

  describe('duplicateElementIds', () => {
    beforeEach(() => {
      document.body.innerHTML = '';
    });

    describe('in the default scope it returns', () => {
      test('an empty array when no elements have an id', () => {
        expect(duplicateElementIds().length).toBe(0);
      });
      test('an empty array when all elements have a unique id', () => {
        document.body.innerHTML = `<main>
          <div id="div1">One</div>
          <div id="div2">Two</div>
        </main>`;
        expect(duplicateElementIds().length).toBe(0);
      });
      test('an empty array when all elements have a dollar prefix', () => {
        document.body.innerHTML = `<main>
          <div id="$div1">One</div>
          <div id="$div2">Two</div>
        </main>`;
        expect(duplicateElementIds({ isPrefixed: true }).length).toBe(0);
      });
      test('a list when there are elements with duplicate ids', () => {
        document.body.innerHTML = `<main>
          <div id="div1">One</div>
          <div id="div1">Two</div>
        </main>`;
        expect(duplicateElementIds()).toStrictEqual(['div1']);
      });
      test('a list when there are elements with unprefixed ids', () => {
        document.body.innerHTML = `<main>
          <div id="$div1">One</div>
          <div id="div2">Two</div>
        </main>`;
        expect(duplicateElementIds({ isPrefixed: true })).toStrictEqual([
          'div2',
        ]);
      });
    });

    describe('in the defined scope it returns', () => {
      test('an empty array when there are no elements with id attributes', () => {
        document.body.innerHTML = `<main>
          <div>One</div>
          <div>Two</div>
        </main>`;
        const target = document.querySelector('main');
        expect(duplicateElementIds({ target }).length).toBe(0);
      });
      test('an empty array when there are only elements with unique id attributes', () => {
        document.body.innerHTML = `<main>
          <div id="div1">One</div>
          <div id="div2">Two</div>
        </main>`;
        const target = document.querySelector('main');
        expect(duplicateElementIds({ target }).length).toBe(0);
      });
      test('an empty array when all elements have a defined prefix', () => {
        document.body.innerHTML = `<main>
          <div id="$div1">One</div>
          <div id="$div2">Two</div>
        </main>`;
        const target = document.querySelector('main');
        expect(duplicateElementIds({ target, isPrefixed: true }).length).toBe(
          0
        );
      });
      test('a list when there are elements with duplicate ids', () => {
        document.body.innerHTML = `<main>
          <div id="div1">One</div>
          <div id="div2">Two</div>
          <div id="div2">Three</div>
        </main>`;
        const target = document.querySelector('main');
        expect(duplicateElementIds({ target }).length).toBe(1);
      });
      test('a list when there are elements with unprefixed ids', () => {
        document.body.innerHTML = `<main>
          <div id="div1">One</div>
          <div id="$div2">Two</div>
        </main>`;
        const target = document.querySelector('main');
        expect(duplicateElementIds({ target, isPrefixed: true }).length).toBe(
          1
        );
      });
    });
  });
});
