import { adhocArray, consoleTable, exercise } from './index.js';

const expectedTableHtml = [
	`<table border="1">
<tr><th>#</th><th>Value</th></tr>
<tr><td>0</td><td>1</td></tr>
<tr><td>1</td><td>2</td></tr>
<tr><td>2</td><td>3</td></tr>
<tr><td>3</td><td>4</td></tr>
<tr><td>4</td><td>5</td></tr>
</table>`,
	`<table border="1">
<tr><th>#</th><th>1</th><th>2</th><th>3</th><th>4</th></tr>
<tr><td>0</td><td>1</td><td>2</td><td>3</td><td>4</td></tr>
<tr><td>1</td><td>5</td><td>6</td><td>7</td><td>8</td></tr>
</table>`,
	`<table border="1">
<tr><th>#</th><th>alpha</th><th>beta</th><th>gamma</th><th>delta</th></tr>
<tr><td>0</td><td>1</td><td>2</td><td>3</td><td>4</td></tr>
<tr><td>1</td><td>5</td><td>6</td><td>7</td><td>8</td></tr>
</table>`,
];

describe('Exercising', () => {
	describe('ad-hoc array', () => {
		test('reports an exception if the first argument is not a number', () => {
			const testException = () => adhocArray('X');

			expect(testException).toThrow(
				'Error: adhocArray parameter 1 needs to be of type Number.'
			);
		});

		test('reports an exception if the first argument is less than one', () => {
			const testException = () => adhocArray(-1);

			expect(testException).toThrow(
				'Error: adhocArray parameter 1 needs to be greater than zero.'
			);
		});

		test('reports an exception if the second argument is not a function', () => {
			const testException = () => adhocArray(1, 'X');

			expect(testException).toThrow(
				'Error: adhocArray parameter 2 needs to be of type Function.'
			);
		});

		test('reports an exception if the second argument is a function with no parameters', () => {
			const testException = () => adhocArray(1, () => {});

			expect(testException).toThrow(
				'Error: adhocArray parameter 2 needs a single parameter.'
			);
		});

		test('reports an exception if the second argument is a function with more than one parameters', () => {
			const testException = () => adhocArray(1, (a, b) => {});

			expect(testException).toThrow(
				'Error: adhocArray parameter 2 needs a single parameter.'
			);
		});

		test('Using the default parameters yields [0]', () => {
			const result = adhocArray();

			expect(result.length).toBe(1);
			expect(result[0]).toBe(0);
		});

		test('Using the default transform yields [0, 1, 2, 3, 4]', () => {
			const result = adhocArray(5);

			expect(result.length).toBe(5);
			expect(result[0]).toBe(0);
			expect(result[4]).toBe(4);
		});

		test('Using custom transform yields [2, 4, 6, 8, 10]', () => {
			const result = adhocArray(5, i => (i + 1) * 2);

			expect(result.length).toBe(5);
			expect(result[0]).toBe(2);
			expect(result[4]).toBe(10);
		});

		test('Using the default transform with a filter yields [2, 12, 20, 21, 22, 23, 24]', () => {
			const result = adhocArray(25);
			const filteredResult = result.filter(i => `${i}`.includes('2'));

			expect(result.length).toBe(25);
			expect(result[0]).toBe(0);
			expect(result[24]).toBe(24);
			expect(filteredResult.length).toBe(7);
			expect(filteredResult[0]).toBe(2);
			expect(filteredResult[6]).toBe(24);
		});

		test('Using custom transform with a reducer yields 42', () => {
			const result = adhocArray(6, i => (i + 1) * 2);
			const reducedResult = result.reduce((total, value) => total + value, 0);

			expect(result.length).toBe(6);
			expect(reducedResult).toBe(42);
		});
	});

	describe('consoleTable', () => {
		it('with an empty array', () => {
			const testData = [];
			const expectedResult = '';
			const actualResult = consoleTable(testData);
			expect(actualResult).toEqual(expectedResult);
		});

		it('with an array of values', () => {
			const testData = [1, 2, 3, 4, 5];
			const expectedResult = expectedTableHtml[0];
			const actualResult = consoleTable(testData);
			expect(actualResult).toEqual(expectedResult);
		});

		it('with an array of arrays', () => {
			const testData = [
				[1, 2, 3, 4],
				[5, 6, 7, 8],
			];
			const expectedResult = expectedTableHtml[1];
			const actualResult = consoleTable(testData);
			expect(actualResult).toEqual(expectedResult);
		});

		it('with an array of object', () => {
			const testData = [
				{ alpha: 1, beta: 2, gamma: 3, delta: 4 },
				{ alpha: 5, beta: 6, gamma: 7, delta: 8 },
			];
			const expectedResult = expectedTableHtml[2];
			const actualResult = consoleTable(testData);
			expect(actualResult).toEqual(expectedResult);
		});
	});
	
	describe('Pure function Exercise', () => {
		it('can test without an id', () => {
			expect(exercise([10], [10])).toBeTruthy();
			expect(exercise([10], [1])).toBeFalsy();
		});
		it('can test with an id', () => {
			expect(exercise([10], [10], 'Works')).toBeTruthy();
			expect(exercise([10], [1], 'Errors')).toBeFalsy();
		});
	});
});
