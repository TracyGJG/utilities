import { describe, it, test, beforeEach, afterEach, mock } from 'node:test';
import assert from 'node:assert/strict';

import { GlobalWindow, Window, KeyboardEvent } from 'happy-dom';

import { sleep } from '../tools/index.js';

describe('DOM utilities', async () => {
  const window = new GlobalWindow();
  globalThis.document = window.document;
  const {
    debounce,
    duplicateElementIds,
    mockIntervalFunctions,
    mockTimeoutFunctions,
    poller,
    reactivate,
    sanatise,
    throttle,
  } = await import('./index.js');

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

      assert.ok(result);
      assert.equal(result.length, 14);
      assert.equal(result, 'Sanitised Text');
    });

    test('can be performed using the default Document', () => {
      const result = sanatise(untrustedText);

      assert.ok(result);
      assert.equal(result.length, 79);
      assert.equal(result, trustedText);
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
      assert.equal(callCount, 0);

      debounced();
      await sleep(500);

      debounced();
      await sleep(500);
      assert.equal(callCount, 0);

      await sleep(600);
      assert.equal(callCount, 1);
    });

    test('will only be called after being idle for the stipulated 2 second', async () => {
      const debounced = debounce(incCount, 2000);
      assert.equal(callCount, 0);

      debounced();
      await sleep(500);

      debounced();
      await sleep(500);
      assert.equal(callCount, 0);

      await sleep(600);
      assert.equal(callCount, 0);

      await sleep(1000);
      assert.equal(callCount, 1);
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
      assert.equal(callCount, 0);

      throttled();
      assert.equal(callCount, 0);

      throttled();
      assert.equal(callCount, 0);
      await sleep(1200);

      assert.equal(callCount, 1);
      throttled();
      assert.equal(callCount, 1);
    });

    test('will only be called once every stipulated 2 second', async () => {
      const throttled = throttle(incCount, 2000);
      assert.equal(callCount, 0);

      throttled();
      assert.equal(callCount, 0);

      throttled();
      assert.equal(callCount, 0);
      await sleep(1200);

      assert.equal(callCount, 1);
      throttled();
      assert.equal(callCount, 1);

      await sleep(1200);
      throttled();
      assert.equal(callCount, 2);
    });
  });

  describe('poller', () => {
    let counter = 0;
    const checkCount = mock.fn(() => counter % 2);
    const incCount = mock.fn(() => counter++);
    const mockSetInterval = mock.fn(() => 'Set Interval');
    const mockClearInterval = mock.fn();

    globalThis.setInterval = mockSetInterval;
    globalThis.clearInterval = mockClearInterval;

    beforeEach(() => {
      counter = 0;
    });

    afterEach(() => {
      mockSetInterval.mock.resetCalls();
      mockClearInterval.mock.resetCalls();
    });

    test('can execute an action', () => {
      assert.equal(mockSetInterval.mock.callCount(), 0);
      assert.equal(mockClearInterval.mock.callCount(), 0);

      const result = poller(100, 5, checkCount, incCount);
      assert.ok(result);

      assert.equal(mockSetInterval.mock.callCount(), 1);
      assert.deepStrictEqual(mockSetInterval.mock.calls[0].arguments[1], 100);
      assert.equal(mockClearInterval.mock.callCount(), 0);

      const callbackFn = mockSetInterval.mock.calls[0].arguments[0];
      assert.equal(checkCount.mock.callCount(), 0);
      callbackFn();
      assert.equal(checkCount.mock.callCount(), 1);

      counter = 3;
      callbackFn();
      assert.equal(mockClearInterval.mock.callCount(), 1);
      assert.equal(checkCount.mock.callCount(), 2);
    });
  });

  describe('mockTimeoutFunctions', () => {
    let timeoutCallback;

    beforeEach(() => {
      timeoutCallback = mock.fn(() => 42);
    });
    afterEach(() => {
      timeoutCallback.mock.resetCalls();
    });

    test('exposes required methods', () => {
      const timeoutFunctions = mockTimeoutFunctions();

      assert.ok(timeoutFunctions);
      assert.ok(timeoutFunctions.clockTick);
      assert.ok(timeoutFunctions.setTimeout);
      assert.ok(timeoutFunctions.clearTimeout);

      assert.equal(typeof timeoutFunctions.clockTick, 'function');
      assert.equal(typeof timeoutFunctions.setTimeout, 'function');
      assert.equal(typeof timeoutFunctions.clearTimeout, 'function');
    });

    test('default behaviour (completed)', () => {
      const { clockTick, setTimeout } = mockTimeoutFunctions();

      assert.equal(timeoutCallback.mock.callCount(), 0);
      let timeout = setTimeout(timeoutCallback, 200);
      assert.ok(timeout);

      assert.equal(timeoutCallback.mock.callCount(), 0);
      assert.equal(clockTick(timeout, 100), null);

      assert.equal(timeoutCallback.mock.callCount(), 0);
      assert.equal(clockTick(timeout, 100), 42);

      assert.equal(timeoutCallback.mock.callCount(), 1);
      assert.equal(clockTick(timeout, 100), undefined);
    });

    test('default behaviour (cancelled)', () => {
      const { clockTick, setTimeout, clearTimeout } = mockTimeoutFunctions();

      assert.equal(timeoutCallback.mock.callCount(), 0);
      let timeout = setTimeout(timeoutCallback, 200);
      assert.ok(timeout);

      assert.equal(timeoutCallback.mock.callCount(), 0);
      assert.equal(clockTick(timeout, 100), null);

      assert.equal(timeoutCallback.mock.callCount(), 0);
      assert.ok(clearTimeout(timeout), true);

      assert.equal(timeoutCallback.mock.callCount(), 0);
      assert.equal(clockTick(timeout, 100), undefined);
    });
  });

  describe('mockIntervalFunctions', () => {
    let intervalCallback;

    beforeEach(() => {
      intervalCallback = mock.fn(() => 42);
    });

    afterEach(() => {
      intervalCallback.mock.resetCalls();
    });

    test('exposes required methods', () => {
      const intervalFunctions = mockIntervalFunctions();

      assert.ok(intervalFunctions);
      assert.ok(intervalFunctions.clockTick);
      assert.ok(intervalFunctions.setInterval);
      assert.ok(intervalFunctions.clearInterval);

      assert.equal(typeof intervalFunctions.clockTick, 'function');
      assert.equal(typeof intervalFunctions.setInterval, 'function');
      assert.equal(typeof intervalFunctions.clearInterval, 'function');
    });

    test('default behaviour', () => {
      const { clockTick, setInterval, clearInterval } = mockIntervalFunctions();

      assert.strictEqual(intervalCallback.mock.callCount(), 0);
      let timeout = setInterval(intervalCallback, 120);
      assert.ok(timeout);

      assert.equal(intervalCallback.mock.callCount(), 0);
      assert.equal(clockTick(timeout, 100), null);

      assert.equal(intervalCallback.mock.callCount(), 0);
      assert.equal(clockTick(timeout, 100), 42);

      assert.equal(intervalCallback.mock.callCount(), 1);
      assert.equal(clockTick(timeout, 200), 42);

      assert.equal(intervalCallback.mock.callCount(), 2);
      assert.strictEqual(clockTick(timeout, 100), null);

      assert.equal(intervalCallback.mock.callCount(), 2);
      assert.equal(clockTick(timeout, 100), 42);

      assert.equal(intervalCallback.mock.callCount(), 3);
      assert.strictEqual(clockTick(timeout, 100), null);

      assert.ok(clearInterval(timeout));
      assert.ok(!clockTick(timeout, 100));
      assert.ok(!clearInterval(timeout));
    });
  });

  describe('duplicateElementIds', () => {
    beforeEach(() => {
      document.body.innerHTML = '';
    });

    describe('in the default scope it returns', () => {
      test('an empty array when no elements have an id', () => {
        assert.equal(duplicateElementIds().length, 0);
      });
      test('an empty array when all elements have a unique id', () => {
        document.body.innerHTML = `<main>
            <div id="div1">One</div>
            <div id="div2">Two</div>
          </main>`;
        assert.equal(duplicateElementIds().length, 0);
      });
      test('an empty array when all elements have a dollar prefix', () => {
        document.body.innerHTML = `<main>
            <div id="$div1">One</div>
            <div id="$div2">Two</div>
          </main>`;
        assert.equal(duplicateElementIds({ isPrefixed: true }).length, 0);
      });
      test('a list when there are elements with duplicate ids', () => {
        document.body.innerHTML = `<main>
            <div id="div1">One</div>
            <div id="div1">Two</div>
          </main>`;
        assert.deepStrictEqual(duplicateElementIds(), ['div1']);
      });
      test('a list when there are elements with unprefixed ids', () => {
        document.body.innerHTML = `<main>
            <div id="$div1">One</div>
            <div id="div2">Two</div>
          </main>`;
        assert.deepStrictEqual(duplicateElementIds({ isPrefixed: true }), [
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
        assert.equal(duplicateElementIds({ target }).length, 0);
      });
      test('an empty array when there are only elements with unique id attributes', () => {
        document.body.innerHTML = `<main>
            <div id="div1">One</div>
            <div id="div2">Two</div>
          </main>`;
        const target = document.querySelector('main');
        assert.equal(duplicateElementIds({ target }).length, 0);
      });
      test('an empty array when all elements have a defined prefix', () => {
        document.body.innerHTML = `<main>
            <div id="$div1">One</div>
            <div id="$div2">Two</div>
          </main>`;
        const target = document.querySelector('main');
        assert.equal(
          duplicateElementIds({ target, isPrefixed: true }).length,
          0,
        );
      });
      test('a list when there are elements with duplicate ids', () => {
        document.body.innerHTML = `<main>
            <div id="div1">One</div>
            <div id="div2">Two</div>
            <div id="div2">Three</div>
          </main>`;
        const target = document.querySelector('main');
        assert.equal(duplicateElementIds({ target }).length, 1);
      });
      test('a list when there are elements with unprefixed ids', () => {
        document.body.innerHTML = `<main>
            <div id="div1">One</div>
            <div id="$div2">Two</div>
          </main>`;
        const target = document.querySelector('main');
        assert.equal(
          duplicateElementIds({ target, isPrefixed: true }).length,
          1,
        );
      });
    });
  });

  describe('reactivate', () => {
    let reactiv8;

    beforeEach(() => {
      document.body.innerHTML = /*html*/ `
          <main>
            <p data-reactive-content="reactiv8"></p>
            <input type="text" value="reactiv8" />
            <textarea value="reactiv8"></textarea>
            <select value="reactiv8">
              <option>Hello</option>
              <option>World</option>
              <option>Hello, World!</option>
            </select>
            <button id="$btn">Update</button>
          </main>
        `;
    });

    test('a list when there are elements with unprefixed ids', () => {
      reactiv8 = reactivate('reactiv8', 'Hello, World!');

      assert.equal(document.querySelector('p').textContent, 'Hello, World!');
      assert.equal(document.querySelector('input').value, 'Hello, World!');
      assert.equal(document.querySelector('textarea').value, 'Hello, World!');
      assert.equal(document.querySelector('select').selectedIndex, 2);

      reactiv8.value = 'Hello';

      assert.equal(document.querySelector('p').textContent, 'Hello');
      assert.equal(document.querySelector('input').value, 'Hello');
      assert.equal(document.querySelector('textarea').value, 'Hello');
      assert.equal(document.querySelector('select').selectedIndex, 0);
    });

    test('a list when there are elements with unprefixed ids', () => {
      reactiv8 = reactivate(
        'reactiv8',
        'Hello, World!',
        document.querySelector('main'),
      );

      assert.equal(document.querySelector('p').textContent, 'Hello, World!');
      assert.equal(document.querySelector('input').value, 'Hello, World!');
      assert.equal(document.querySelector('textarea').value, 'Hello, World!');
      assert.equal(document.querySelector('select').selectedIndex, 2);

      const $input = document.querySelector('input');
      $input.value = 'Hello';
      const userEvent = new KeyboardEvent('keyup');
      $input.dispatchEvent(userEvent);

      assert.equal(document.querySelector('p').textContent, 'Hello');
      assert.equal(document.querySelector('input').value, 'Hello');
      assert.equal(document.querySelector('textarea').value, 'Hello');
      assert.equal(document.querySelector('select').selectedIndex, 0);
    });
  });
});
