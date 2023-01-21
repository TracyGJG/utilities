import { sum } from './index.js';

describe('Ancillaries', () => {
	describe('sum', () => {
		test('will throw an exception is arguments include a non-numeric', () => {
			const exceptionTest = () => {
				sum('Not A Number');
			};
			expect(exceptionTest).toThrow(
				'Error: E-NN An argument supplied is not a Numeric value.'
			);
		});
		test('will return zero is no arguments are supplied', () => {
			expect(sum()).toBe(0);
		});
		test('will return the total if one or more arguments are supplied (positive)', () => {
			expect(sum(2, 4, 6, 8, 10, 12)).toBe(42);
		});
		test('will return the total if one or more arguments are supplied (negative)', () => {
			expect(sum(-2, -4, -6, -8, -10, -12)).toBe(-42);
		});
	});
});
