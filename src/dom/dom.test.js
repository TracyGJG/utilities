/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals';

import { ace, ael, cde, cse, qs, qsa } from './index.js';

describe('DOM utilities', () => {
	afterAll(() => {
		jest.resetAllMocks();
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
		test('for an element', () => {
			const buttonElement = document.createElement('button');
			const callback = jest.fn();

			const evt = new MouseEvent('click', {
				bubbles: true,
				cancelable: true,
				view: window,
			});

			ace(buttonElement);
			ael('click', 'button', callback, { once: true });
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
			ael('click', 'button', callback, undefined, buttonElement);
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
});
