/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals';

import {
	acc,
	ace,
	ael,
	cde,
	cse,
	dce,
	qs,
	qsa,
	sui,
	debounce,
	throttle,
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

function mockTimerFunctions() {
	const timers = {};

	return {
		clearTimeout,
		setTimeout,
	};

	function clearTimeout(timerRef) {
		delete timers.timer;
	}
	function setTimeout(callBack, duration) {
		const timer = Date.now();
		timers[timer];
		sleep(duration).then(_ => timers?.timer && callback());
	}
}

describe('DOM utilities', () => {
	afterAll(() => {
		jest.resetAllMocks();
	});

	describe('add CSS Class (acc)', () => {
		test('can be performed using a parent element', () => {
			let callResult = '';
			const parent = {
				querySelector(_domElement) {
					return {
						classList: {
							add(className) {
								callResult = className;
							},
						},
					};
				},
			};
			expect(callResult).toBe('');

			const result = acc(null, 'testCssClass', parent);

			expect(callResult).toBe('testCssClass');
		});
		test('can be performed using the default document', () => {
			const main = document.createElement('main');
			ace(main);
			expect(main.outerHTML).toBe('<main></main>');

			acc('main', 'testCssClass');
			expect(main.outerHTML).toBe('<main class="testCssClass"></main>');
		});
	});

	describe('append Child to element (ace)', () => {
		test('can append a child element to a parent', () => {
			const parent = document.createElement('div');
			const child = document.createElement('span');
			const spyParentAppendChild = jest.spyOn(parent, 'appendChild');

			expect(parent.children.length).toBe(0);
			ace(child, parent);

			expect(parent.children.length).toBe(1);
			expect(spyParentAppendChild).toHaveBeenCalledTimes(1);
		});
	});

	describe('add Event Listener (ael)', () => {
		test('for multiple elements', () => {
			const buttonElement = document.createElement('button');
			const callback = jest.fn();

			const evt = new MouseEvent('click', {
				bubbles: true,
				cancelable: true,
				view: window,
			});

			ace(buttonElement);
			ael('click', callback, 'button', { once: true });
			expect(callback).toHaveBeenCalledTimes(0);

			buttonElement.dispatchEvent(evt);
			expect(callback).toHaveBeenCalledTimes(1);
		});

		test('for a single element', () => {
			const buttonElement = document.createElement('button');
			const callback = jest.fn();

			const evt = new MouseEvent('click', {
				bubbles: true,
				cancelable: true,
				view: window,
			});

			ace(buttonElement);
			ael('click', callback);
			expect(callback).toHaveBeenCalledTimes(0);

			buttonElement.dispatchEvent(evt);
			expect(callback).toHaveBeenCalledTimes(1);
		});

		test('for the document', () => {
			const buttonElement = document.createElement('button');
			const callback = jest.fn();

			const evt = new MouseEvent('click', {
				bubbles: true,
				cancelable: true,
				view: window,
			});

			ace(buttonElement);
			ael('click', callback, 'button', undefined, buttonElement);
			expect(callback).toHaveBeenCalledTimes(0);

			buttonElement.dispatchEvent(evt);
			expect(callback).toHaveBeenCalledTimes(1);
		});
	});

	describe('create DOM element (cde)', () => {
		beforeEach(() => {
			document.body.innerHTML = '';
		});

		test('with default parameters', () => {
			const domElement = cde('button');

			expect(domElement).toBeDefined();
			expect(domElement.outerHTML).toBe('<button></button>');
			expect(domElement.tagName).toBe('BUTTON');
		});

		test('with custom parameters', () => {
			const domElement = cde(
				'button',
				{
					class: 'accept',
					dataset: {
						one: 'ONE',
						two: 'TWO',
					},
					text: 'Accept',
					title: 'test',
				},
				document
			);
			ace(domElement);

			expect(domElement).toBeDefined();
			expect(document.body.outerHTML).toBe(
				'<body><button class="accept" data-one="ONE" data-two="TWO" title="test">Accept</button></body>'
			);
			expect(domElement.tagName).toBe('BUTTON');
			expect(domElement.className).toBe('accept');
			expect(domElement.title).toBe('test');
			expect(domElement.dataset.one).toBe('ONE');
			expect(domElement.dataset.two).toBe('TWO');
			expect(domElement.textContent).toBe('Accept');
		});
	});

	describe('create SVG element (cse)', () => {
		beforeEach(() => {
			document.body.innerHTML = '';
		});

		test('with default parameters', () => {
			const domElement = cse('svg');

			expect(domElement).toBeDefined();
			expect(domElement.outerHTML).toBe('<svg></svg>');
			expect(domElement.tagName).toBe('svg');
		});

		test('with custom parameters', () => {
			const domElement = cse('svg', { viewBox: '0 0 200 100' }, document);
			ace(domElement);

			expect(domElement).toBeDefined();
			expect(document.body.outerHTML).toBe(
				'<body><svg viewBox="0 0 200 100"></svg></body>'
			);
			expect(domElement.tagName).toBe('svg');
			expect(domElement.attributes.viewBox.nodeValue).toBe('0 0 200 100');
			expect(domElement.namespaceURI).toBe('http://www.w3.org/2000/svg');
		});
	});

	describe('delete child elements (dce)', () => {
		test('from a parent element', () => {
			const parent = document.createElement('main');
			const child = document.createElement('div');
			const gchild = document.createElement('span');
			ace(child, parent);
			ace(gchild, child);

			expect(parent.children.length).toBe(1);
			expect(parent.children[0].children.length).toBe(1);

			dce(parent);
			expect(parent.children.length).toBe(0);
		});
	});

	describe('query Selector (qs)', () => {
		test('can select a child element from a parent', () => {
			const parent = document.createElement('div');
			const child = document.createElement('span');
			ace(child, parent);

			const result = qs('span');

			expect(result).toBeDefined();
		});
	});

	describe('query Selector All (qsa)', () => {
		test('can select multiple child elements from a parent', () => {
			const parent = document.createElement('div');
			const child = document.createElement('span');
			ace(child, parent);

			const result = qsa('span', parent);

			expect(result).toBeDefined();
			expect(result.length).toBe(1);
		});

		test('can select multiple child elements from the Document', () => {
			const parent = document.createElement('div');
			const child = document.createElement('span');
			ace(child, parent);
			ace(child);

			const result = qsa('span');

			expect(result).toBeDefined();
			expect(result.length).toBe(1);
		});
	});

	describe('sanitize user/untrusted input (sui)', () => {
		test('can be performed using a parent element', () => {
			const parent = {
				createElement(_domElement) {
					return {
						textContent: '',
						innerHTML: 'Sanitised Text',
					};
				},
			};

			const result = sui(untrustedText, parent);

			expect(result).toBeDefined();
			expect(result.length).toBe(14);
			expect(result).toBe('Sanitised Text');
		});

		test('can be performed using the default Document', () => {
			const result = sui(untrustedText);

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
		const { clearTimeout, setTimeout } = mockTimerFunctions();

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
		const { setTimeout } = mockTimerFunctions();

		beforeEach(() => {
			callCount = 0;
		});

		test('will only be called once every default 1 second', async () => {
			const throttled = throttle(incCount);
			expect(callCount).toBe(0);

			throttled();
			expect(callCount).toBe(1);

			throttled();
			expect(callCount).toBe(1);
			await sleep(1200);

			expect(callCount).toBe(1);
			throttled();
			expect(callCount).toBe(2);
		});

		test('will only be called once every stipulated 2 second', async () => {
			const throttled = throttle(incCount, 2000);
			expect(callCount).toBe(0);

			throttled();
			expect(callCount).toBe(1);

			throttled();
			expect(callCount).toBe(1);
			await sleep(1200);

			expect(callCount).toBe(1);
			throttled();
			expect(callCount).toBe(1);

			await sleep(1200);
			throttled();
			expect(callCount).toBe(2);
		});
	});
});
