const _document = document;
const _body = document.body;
const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

export function acc(selector, className, dom = _document) {
	dom.querySelector(selector).classList.add(className);
}

export function ace(childElement, parent = _body) {
	parent.appendChild(childElement);
}

export function ael(
	eventType,
	callback,
	selector,
	options,
	parent = _document
) {
	parent.addEventListener(
		eventType,
		selector ? evt => evt.target.matches(selector) && callback(evt) : callback,
		options
	);
}

export const cde = (type, options = {}, parent = _document) =>
	_ce(type, options, parent);

export const cse = (type, options = {}, parent = _document) =>
	_ce(type, options, parent, SVG_NAMESPACE);

function _ce(type, options, parent, namespace) {
	const element = namespace
		? parent.createElementNS(namespace, type)
		: parent.createElement(type);
	const keyTypes = {
		class: value => element.classList.add(value),
		dataset: value =>
			Object.entries(value).forEach(([dataKey, dataValue]) => {
				element.dataset[dataKey] = dataValue;
			}),
		text: value => (element.textContent = value),
	};

	Object.entries(options).forEach(([key, value]) => {
		const fn = keyTypes?.[key];
		fn ? fn(value) : element.setAttribute(key, value);
	});

	return element;
}

export function dce(parentElement) {
	let child = parentElement.lastElementChild;
	while (child) {
		parentElement.removeChild(child);
		child = parentElement.lastElementChild;
	}
}

export function qs(selector, parent = _document) {
	return parent.querySelector(selector);
}

export function qsa(selector, parent = _document) {
	return [...parent.querySelectorAll(selector)];
}

export function sui(text, dom = _document) {
	const div = dom.createElement('div');
	div.textContent = text;
	return div.innerHTML;
}
