import { DATA_TYPES, dataType } from '../dataComparison/index.js';

export function adhocArray(length = 1, transform = _ => _) {
	if (dataType(length) !== DATA_TYPES.NUMBER)
		throw Error('Error: adhocArray parameter 1 needs to be of type Number.');
	if (length < 1)
		throw Error('Error: adhocArray parameter 1 needs to be greater than zero.');
	if (dataType(transform) !== DATA_TYPES.FUNCTION)
		throw Error('Error: adhocArray parameter 2 needs to be of type Function.');
	if (transform.length !== 1)
		throw Error('Error: adhocArray parameter 2 needs a single parameter.');

	return [...Array(length).keys()].map(transform);
}

export function consoleTable(arr) {
	function getHeading(row) {
		return Array.isArray(row)
			? row.map((_, idx) => `<th>${idx + 1}</th>`).join('')
			: typeof row === 'object'
			? Object.keys(row)
					.map(col => `<th>${col}</th>`)
					.join('')
			: `<th>Value</th>`;
	}
	function getData(row) {
		const htmlData = cell => `<td>${cell}</td>`;
		return Array.isArray(row)
			? row.map(htmlData).join('')
			: typeof row === 'object'
			? Object.values(row).map(htmlData).join('')
			: htmlData(row);
	}

	return arr.length
		? `<table border="1">
<tr><th>#</th>${getHeading(arr[0])}</tr>
${arr
	.map(
		(row, idx) => `<tr><td>${idx}</td>${getData(row)}</tr>
`
	)
	.join('')}</table>`
		: '';
}

export function exercise(expected, actual, id = '') {
	var expectedResult = JSON.stringify(expected);
	var actualResult = JSON.stringify(actual);
	var exerId = id ? ` ${id}` : '';
	if (expectedResult == actualResult) {
		console.info(
			`%cEXERCISE${exerId} - Passed:	Expected (${expectedResult}), Received (${actualResult}).`,
			'color: green;'
		);
		return true;
	}
	console.info(
		`%cEXERCISE${exerId} - Failed:	Expected (${expectedResult}), Received (${actualResult}).`,
		'color: red;'
	);
	return false;
}
