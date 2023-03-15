let _document = document;
const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

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

export function ace(parentElement, childElement) {
	parentElement.appendChild(childElement);
}

export function qs(selector, parent = _document) {
	return parent.querySelector(selector);
}

export function qsa(selector, parent = _document) {
	return [...parent.querySelectorAll(selector)];
}

export function ael(type, selector, callback, options, parent = _document) {
	parent.addEventListener(
		type,
		evt => evt.target.matches(selector) && callback(evt),
		options
	);
}
