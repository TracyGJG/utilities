import { compose, curry, enumerate, lens, memoize, sleep } from './index.js';

describe('Tools', () => {
	describe('Sleep', () => {
		it('can delay progress by a given interval (within a period)', async () => {
			const timeStamp1 = new Date();
			await sleep(1000);
			const timeStamp2 = new Date();
			expect(timeStamp2 - timeStamp1).toBeLessThan(1021);
		});

		it('can delay progress by a given interval (greater than period)', async () => {
			const timeStamp1 = new Date();
			await sleep(1000);
			const timeStamp2 = new Date();
			expect(timeStamp2 - timeStamp1).toBeGreaterThan(999);
		});
	});
	describe('Memoise', () => {
		let globalCount = 0;
		function delayedCube(x, y, z) {
			globalCount++;
			return x * y * z;
		}

		it('can increase globalCount for each call (not memoised)', () => {
			globalCount = 0;
			expect(delayedCube(2, 3, 7)).toBe(42);
			expect(globalCount).toBe(1);
			expect(delayedCube(2, 3, 7)).toBe(42);
			expect(globalCount).toBe(2);
			expect(delayedCube(2, 3, 7)).toBe(42);
			expect(globalCount).toBe(3);
		});

		it('can increase globalCount just once for each call (memoised)', () => {
			globalCount = 0;
			const delayedCube_ = memoize(delayedCube);
			expect(delayedCube_(2, 3, 7)).toBe(42);
			expect(globalCount).toBe(1);
			expect(delayedCube_(2, 3, 7)).toBe(42);
			expect(globalCount).toBe(1);
			expect(delayedCube_(2, 3, 7)).toBe(42);
			expect(globalCount).toBe(1);
		});
	});
	describe('Curry', () => {
		function cube(x, y, z) {
			return x * y * z;
		}

		describe('with no predefined args', () => {
			const cube_ = curry(cube);

			it('can create a curried function that will accept, all args all at once', () => {
				expect(cube_(2, 3, 7)).toBe(42);
			});

			it('can create a curried function that will accept, an arg followed by last two', () => {
				expect(cube_(2)(3, 7)).toBe(42);
				const cube_one = cube_(2);
				expect(cube_one(3, 7)).toBe(42);
			});

			it('can create a curried function that will accept, two args then last', () => {
				expect(cube_(2, 3)(7)).toBe(42);
				const cube_two = cube_(2, 3);
				expect(cube_two(7)).toBe(42);
			});

			it('can create a curried function that will accept, all args one at a time', () => {
				expect(cube_(2)(3)(7)).toBe(42);
				const cube_one = cube_(2);
				const cube_two = cube_one(3);
				expect(cube_two(7)).toBe(42);
			});
		});

		describe('with a single argument', () => {
			const cube2_ = curry(cube, 2);

			it('can create a curried function that will accept, all remaining args at once', () => {
				expect(cube2_(3, 7)).toBe(42);
			});

			it('can create a curried function that will accept, remaining args in subsequent calls', () => {
				expect(cube2_(3)(7)).toBe(42);
			});
		});

		describe('with a couple of arguments', () => {
			const cube2_3_ = curry(cube, 2, 3);

			it('can create a curried function that will accept, the remaining arg in the subsequent call', () => {
				expect(cube2_3_(7)).toBe(42);
			});
		});
	});
	describe('Lens', () => {
		const testObjects = {
			nullTest: null,
			emptyObject: {},
			emptyArray: [],

			simpleObject: { a: 42 },
			nestedObject: { a: { b: 42 } },
			arrayInObject: { a: [42] },

			simpleArray: [42],
			nestedArray: [[42]],
			objectInArray: [{ b: 42 }],
		};

		describe('with missing item', () => {
			it('can be managed in a null object', () => {
				const lookup = lens('a');
				expect(lookup(testObjects.nullTest)).not.toBeDefined();
			});

			it('can be managed in an object', () => {
				const lookup = lens('a');
				expect(lookup(testObjects.emptyObject)).not.toBeDefined();
			});

			it('can be managed in an object (indirect args)', () => {
				const lookup = lens('a', 'c');
				expect(lookup(testObjects.emptyObject)).not.toBeDefined();
			});

			it('can be managed in an object (direct args)', () => {
				const lookup = lens('a.c');
				expect(lookup(testObjects.emptyObject)).not.toBeDefined();
			});

			it('can be managed in an object (optional args)', () => {
				const lookup = lens('a?.c');
				expect(lookup(testObjects.emptyObject)).not.toBeDefined();
			});

			it('can be managed in an array', () => {
				const lookup = lens(0);
				expect(lookup(testObjects.emptyArray)).not.toBeDefined();
			});
		});

		describe('locate an object property', () => {
			it('can be managed in an object', () => {
				const lookup = lens('a');
				expect(lookup(testObjects.simpleObject)).toBe(42);
			});

			it('can be managed in an object of an object (individual property args)', () => {
				const lookup = lens('a', 'b');
				expect(lookup(testObjects.nestedObject)).toBe(42);
			});

			it('can be managed in an object of an object (mandatory property args)', () => {
				const lookup = lens('a.b');
				expect(lookup(testObjects.nestedObject)).toBe(42);
			});

			it('can be managed in an object of an object (optional property args)', () => {
				const lookup = lens('a?.b');
				expect(lookup(testObjects.nestedObject)).toBe(42);
			});

			it('can be managed in an array of an object (args)', () => {
				const lookup = lens('a', 0);
				expect(lookup(testObjects.arrayInObject)).toBe(42);
			});

			it('can be managed in an array of an object (string)', () => {
				const lookup = lens('a[0]');
				expect(lookup(testObjects.arrayInObject)).toBe(42);
			});

			it('can be managed in an object of an object (optional array args)', () => {
				const lookup = lens('a?.[0]');
				expect(lookup(testObjects.arrayInObject)).toBe(42);
			});
		});

		describe('locate an element of an array', () => {
			it('can be managed in an array', () => {
				const lookup = lens(0);
				expect(lookup(testObjects.simpleArray)).toBe(42);
			});

			it('can be managed in an object of an array (args)', () => {
				const lookup = lens(0, 'b');
				expect(lookup(testObjects.objectInArray)).toBe(42);
			});

			it('can be managed in an array of an array (string)', () => {
				const lookup = lens('[0][0]');
				expect(lookup(testObjects.nestedArray)).toBe(42);
			});

			it('can be managed in an array of an array (indexes)', () => {
				const lookup = lens(0, 0);
				expect(lookup(testObjects.nestedArray)).toBe(42);
			});
		});
	});
	describe('Compose', () => {
		it('can combine functions', () => {
			function plusNine(int) {
				return int + 9;
			}
			const timesTweleve = int => int * 12;

			const composedFn = compose(
				plusNine,
				timesTweleve,
				function minusSix(int) {
					return int - 6;
				},
				int => int / 3
			);
			expect(((2 + 9) * 12 - 6) / 3).toBe(42);
			expect(composedFn(2)).toBe(42);
		});

		it('can provide the identify function by default ', () => {
			const composedFn = compose();
			expect(composedFn(42)).toBe(42);
		});
	});
	describe('Enumerate', () => {
		describe('will throw an exception then called with', () => {
			it('a source parameter other than an Array or Object (E-IS)', () => {
				const exceptionTest = () =>
					Object.keys(enumerate('INVALID SOURCE ARGUMENT'));
				expect(exceptionTest).toThrow(
					'Error: E-IS The source argument supplied is not an Array or an Object.'
				);
			});

			it('a source parameter of null (E-IS)', () => {
				const exceptionTest = () => Object.keys(enumerate(null));
				expect(exceptionTest).toThrow(
					'Error: E-IS The source argument supplied is not an Array or an Object.'
				);
			});

			it('a source parameter of undefined (E-IS)', () => {
				const exceptionTest = () => Object.keys(enumerate(undefined));
				expect(exceptionTest).toThrow(
					'Error: E-IS The source argument supplied is not an Array or an Object.'
				);
			});

			it('an empty Object as source argument (E-NP)', () => {
				const exceptionTest = () => Object.keys(enumerate({}));
				expect(exceptionTest).toThrow(
					'Error: E-NP The source argument supplied is not populated.'
				);
			});

			it('an empty Array as source argument (E-NP)', () => {
				const exceptionTest = () => Object.keys(enumerate([]));
				expect(exceptionTest).toThrow(
					'Error: E-NP The source argument supplied is not populated.'
				);
			});

			it('a source argument Array populated with non-string data (E-NS)', () => {
				const exceptionTest = () => Object.keys(enumerate([42, false]));
				expect(exceptionTest).toThrow(
					'Error: E-NS The source argument supplied is not populated with string keys.'
				);
			});

			it('an unrecognised options (E-NR)', () => {
				const exceptionTest = () =>
					enumerate(['alpha', 'beta'], {
						unrecognisedOption: true,
					});
				expect(exceptionTest).toThrow(
					`Error: E-NR The option 'unrecognisedOption' is not a recognised option.`
				);
			});

			it('non-Boolean options (E-NB)', () => {
				const exceptionTest = () =>
					enumerate(['alpha', 'beta'], {
						numericValues: 0,
					});
				expect(exceptionTest).toThrow(
					`Error: E-NB The option 'numericValues' is not a Boolean value.`
				);
			});
		});

		describe('will return an object of Enumerated keys', () => {
			it('using a populated source string array', () => {
				const result = enumerate(['alpha', 'beta', 'deltaGamma']);
				expect(Object.keys(result).length).toBe(3);
				expect(result.alpha).toBe('alpha');
				expect(result.beta).toBe('beta');
				expect(result.deltaGamma).toBe('deltaGamma');
			});

			it('using a populated source object', () => {
				const result = enumerate({
					alpha: 'a',
					beta: 'b',
					deltaGamma: 'dG',
				});
				expect(Object.keys(result).length).toBe(3);
				expect(result.alpha).toBe('alpha');
				expect(result.beta).toBe('beta');
				expect(result.deltaGamma).toBe('deltaGamma');
			});

			it('with numeric values, using a populated source array', () => {
				const result = enumerate(['alpha', 'beta', 'deltaGamma'], {
					numericValues: true,
				});
				expect(Object.keys(result).length).toBe(3);
				expect(result.alpha).toBe(0);
				expect(result.beta).toBe(1);
				expect(result.deltaGamma).toBe(2);
			});

			it('with numeric values, using a populated source object', () => {
				const result = enumerate(
					{ alpha: 'a', beta: 'b', deltaGamma: 'dG' },
					{ numericValues: true }
				);
				expect(Object.keys(result).length).toBe(3);
				expect(result.alpha).toBe(0);
				expect(result.beta).toBe(1);
				expect(result.deltaGamma).toBe(2);
			});

			it('with constant properties, using a populated array', () => {
				const result = enumerate(
					[
						'alpha',
						'BETA',
						'deltaGamma',
						'Epsilon zeta',
						'EtaTheta',
						'  Iota  ',
						'Kappa_Lambda',
					],
					{
						constantProperties: true,
					}
				);
				expect(Object.keys(result).length).toBe(7);
				expect(result.ALPHA).toBe('alpha');
				expect(result.BETA).toBe('BETA');
				expect(result.DELTA_GAMMA).toBe('deltaGamma');
				expect(result.EPSILON_ZETA).toBe('Epsilon zeta');
				expect(result.ETA_THETA).toBe('EtaTheta');
				expect(result.__IOTA__).toBe('  Iota  ');
				expect(result.KAPPA_LAMBDA).toBe('Kappa_Lambda');
			});
		});
	});
});
