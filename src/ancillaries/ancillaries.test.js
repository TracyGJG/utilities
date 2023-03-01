import { accumulatedAverage, mapGetter, sum } from './index.js';

describe('Ancillaries', () => {
	describe('Accumulated Average', () => {
		it('can calculate with a single call', () => {
			const result1 = accumulatedAverage(9, 5)(9);
			expect(result1).toEqual(9);
			const result2 = accumulatedAverage(9, 5)(45);
			expect(result2).toEqual(15);
		});
		it('can calculate with incremental calls', () => {
			const newAverage = accumulatedAverage();
			expect(newAverage(1)).toEqual(1.0);
			expect(newAverage(2)).toEqual(1.5);
			expect(newAverage(3)).toEqual(2.0);
			expect(newAverage(4)).toEqual(2.5);
			expect(newAverage(5)).toEqual(3.0);
		});
		it('can re-calculate an average', () => {
			const newAverage = accumulatedAverage();
			expect(newAverage(45, 9, 6)).toEqual(15);
		});
	});

	describe('Map Getter', () => {
		const entityGetter = mapGetter(entityMap, (id, { who }) => ({
			id,
			who,
		}));

		it('can obtain a brand new entity', () => {
			const entityMap = new Map();
			expect(entityMap.has('hello')).toStrictEqual(false);

			const entity = entityGetter('hello', { who: 'World' });
			expect(entityMap.has('hello')).toStrictEqual(true);
			expect(entity.who).toBe('World');
		});

		it('can obtain a pre-existing entity', () => {
			const entityMap = new Map();
			expect(entityMap.has('hello')).toStrictEqual(false);

			entityMap.set('hello', {
				id: 'hello',
				who: 'World',
			});
			expect(entityMap.has('hello')).toStrictEqual(true);

			const entity = entityGetter('hello');
			expect(entity.who).toBe('World');
		});
	});

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
