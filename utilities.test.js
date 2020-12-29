import Utilities from './utilities';

describe('Utilities', () => {
	describe('Accumulated Average', () => {
		it('can calculate with a single call', () => {
			var result1 = Utilities.accumulatedAverage(9, 5)(9);
			expect(result1).toEqual(9);
			var result2 = Utilities.accumulatedAverage(9, 5)(45);
			expect(result2).toEqual(15);
		});
		it('can calculate with incremental calls', () => {
			var newAverage = Utilities.accumulatedAverage();
			expect(newAverage(1)).toEqual(1.0);
			expect(newAverage(2)).toEqual(1.5);
			expect(newAverage(3)).toEqual(2.0);
			expect(newAverage(4)).toEqual(2.5);
			expect(newAverage(5)).toEqual(3.0);
		});
		it('can re-calculate an average', () => {
			var newAverage = Utilities.accumulatedAverage();
			expect(newAverage(45, 9, 6)).toEqual(15);
		});
	});
	describe('Clamp Range', () => {
		it('can clamp the range between 50 and 60', () => {
        var clampedRange = Utilities.clampRange(50, 60);
			expect(clampedRange(45)).toEqual(50);
			expect(clampedRange(50)).toEqual(50);
			expect(clampedRange(55)).toEqual(55);
			expect(clampedRange(60)).toEqual(60);
			expect(clampedRange(65)).toEqual(60);
		});
	});
	describe('Normalise Range', () => {
		it('can normalise the range between 50 and 60', () => {
        var normalisedRange = Utilities.normaliseRange(50, 60);
			expect(normalisedRange(45)).toEqual(-0.5);
			expect(normalisedRange(50)).toEqual(0);
			expect(normalisedRange(55)).toEqual(0.5);
			expect(normalisedRange(60)).toEqual(1);
			expect(normalisedRange(65)).toEqual(1.5);
		});
	});
	describe('Liniar Interpolate', () => {
		it('can liniarly interpolate the range between 50 and 60', () => {
        var liniarInterlopated = Utilities.liniarInterpolate(50, 60);
			expect(liniarInterlopated(0)).toEqual(50);
			expect(liniarInterlopated(0.25)).toEqual(52.5);
			expect(liniarInterlopated(0.5)).toEqual(55);
			expect(liniarInterlopated(0.75)).toEqual(57.5);
			expect(liniarInterlopated(1)).toEqual(60);
		});
	});
	describe('Map Ranges', () => {
		it('can map from a range between 50 and 60 to the range 80 to 100', () => {
        var mappedRanges = Utilities.mapRanges(50, 60, 80, 100);
			expect(mappedRanges(45)).toEqual(70);
			expect(mappedRanges(50)).toEqual(80);
			expect(mappedRanges(55)).toEqual(90);
			expect(mappedRanges(60)).toEqual(100);
			expect(mappedRanges(65)).toEqual(110);
		});

		it('can map Celsius to Fahrenheit', () => {
        var mappedRanges = Utilities.mapRanges(0, 100, 32, 212);
			expect(mappedRanges(-40).toFixed(0)).toEqual("-40");
			expect(mappedRanges(0)).toEqual(32);
			expect(mappedRanges(15)).toEqual(59);
			expect(mappedRanges(30)).toEqual(86);
			expect(mappedRanges(50)).toEqual(122);
			expect(mappedRanges(100)).toEqual(212);
		});
	});
	describe('Ranges Between', () => {
		it('can generate a range of 10 values between 10 and 20', () => {
			Utilities.rangeBetween(10, 20).forEach((value, index) => {
				expect(value).toEqual(10 + index);
			});
		})
		it('can generate a range of 10 values between 10 and 20, in steps of 2', () => {
			Utilities.rangeBetween(10, 20, 2).forEach((value, index) => {
				expect(value).toEqual(10 + 2 * index);
			});
		})
	});
	describe('Ranges From', () => {
		it('can generate a range - no arguments', () => {
			expect(Utilities.rangeFrom().length).toEqual(1);
			expect(Utilities.rangeFrom()[0]).toEqual(0);
		})
		it('can generate a range - single argument', () => {
			expect(Utilities.rangeFrom(10).length).toEqual(1);
			expect(Utilities.rangeFrom(10)[0]).toEqual(10);
		})
		it('can generate a range - pair of arguments', () => {
			expect(Utilities.rangeFrom(10, 20).length).toEqual(20);
			expect(Utilities.rangeFrom(10, 20)[2]).toEqual(12);
			expect(Utilities.rangeFrom(10, 20)[19]).toEqual(29);
		})
		it('can generate a range - pair of arguments, with step value', () => {
			expect(Utilities.rangeFrom(10, 20, 2).length).toEqual(20);
			expect(Utilities.rangeFrom(10, 20, 2)[2]).toEqual(14);
			expect(Utilities.rangeFrom(10, 20, 2)[19]).toEqual(48);
		})
		it('can generate a range - pair of arguments, with step function', () => {
			var fn = _ => 2 ** _;
			expect(Utilities.rangeFrom(10, 20, fn).length).toEqual(20);
			expect(Utilities.rangeFrom(10, 20, fn)[2]).toEqual(14);
			expect(Utilities.rangeFrom(10, 20, fn)[19]).toEqual(524298);
		})
	});
	describe('In Range', () => {
		var inRange = Utilities.inRange(100,200);
		it('can identify points between 100 and 200', () => {
			expect(inRange(50)).toBeFalsy();
			expect(inRange(99)).toBeFalsy();
			expect(inRange(100)).toBeTruthy();
			expect(inRange(101)).toBeTruthy();
			expect(inRange(199)).toBeTruthy();
			expect(inRange(200)).toBeTruthy();
			expect(inRange(201)).toBeFalsy();
			expect(inRange(250)).toBeFalsy();
		})
		it('can identify ranges that overlap 100 and 200', () => {
			expect(inRange(0, 50)).toBeFalsy();
			expect(inRange(0, 99)).toBeFalsy();
			expect(inRange(50, 100)).toBeTruthy();
			expect(inRange(50, 150)).toBeTruthy();
			expect(inRange(50, 250)).toBeTruthy();
			expect(inRange(200, 250)).toBeTruthy();
			expect(inRange(201, 250)).toBeFalsy();
		})
		it('can throw an exception when supplied with invalid input', () => {
			var expectionTestNoArgs = () => {
				Utilities.inRange();
			};
			expect(expectionTestNoArgs).toThrow();
			var expectionTestOneArg = () => {
				Utilities.inRange(100);
			};
			expect(expectionTestNoArgs).toThrow();
			var expectionTestThreeArg = () => {
				Utilities.inRange(100, 200, 300);
			};
			expect(expectionTestThreeArg).toThrow();
		})
	});
	describe('Loop Range', () => {
		describe('(zero indexed)', () => {
			var zeroIndexed = Utilities.loopRange(9);
			it('can be increased', () => {
				var dir = 1;
				expect(zeroIndexed(4, dir)).toEqual(5);
				expect(zeroIndexed(8, dir)).toEqual(0);
			});
			it('can be decreased', () => {
				var dir = -1;
				expect(zeroIndexed(4, dir)).toEqual(3);
				expect(zeroIndexed(0, dir)).toEqual(8);
			});
		});
		describe('(one indexed)', () => {
			var oneIndexed = Utilities.loopRange(9, 1);
			it('can be increased', () => {
				var dir = 1;
				expect(oneIndexed(4, dir)).toEqual(5);
				expect(oneIndexed(9, dir)).toEqual(1);
			});
			it('can be decreased', () => {
				var dir = -1;
				expect(oneIndexed(4, dir)).toEqual(3);
				expect(oneIndexed(1, dir)).toEqual(9);
			});
		});
	});

	describe('Intersect Array', () => {
        var alpha = Utilities.rangeFrom(1, 4);
        var beta = Utilities.rangeFrom(2, 4);
        var delta = Utilities.rangeFrom(3, 4);
        var zeta = Utilities.rangeFrom(10, 4, 10);
        it('can intersect a single array', () => {
            expect(Utilities.intersectArrays(alpha).length).toEqual(4);
        });
        it('can intersect an array with an empty array', () => {
            expect(Utilities.intersectArrays(alpha, []).length).toEqual(0);
        });
        it('can intersect three arrays', () => {
            expect(Utilities.intersectArrays(alpha, beta, delta).length).toEqual(2);
        });
        it('can intersect two (non-intersecting arrays', () => {
            expect(Utilities.intersectArrays(alpha, zeta).length).toEqual(0);
        });
	});
	describe('Union Array', () => {
        var alpha = Utilities.rangeFrom(1, 4);
        var beta = Utilities.rangeFrom(2, 4);
        var delta = Utilities.rangeFrom(3, 4);
        var zeta = Utilities.rangeFrom(10, 4, 10);
        it('can union a single array', () => {
            expect(Utilities.unionArrays(alpha).length).toEqual(4);
            });
        it('can union an array with an empty array', () => {
            expect(Utilities.unionArrays(alpha, []).length).toEqual(4);
        });
        it('can union three arrays', () => {
            expect(Utilities.unionArrays(alpha, beta, delta).length).toEqual(6);
        });
        it('can union two (non-intersecting arrays', () => {
            expect(Utilities.unionArrays(alpha, zeta).length).toEqual(8);
        });
	});

    describe('Pure function Exercise', () => {
        it('can test without an id', () => {
            expect(Utilities.exercise([10], [10])).toBeTruthy();
            expect(Utilities.exercise([10], [1])).toBeFalsy();
        });
        it('can test with an id', () => {
            expect(Utilities.exercise([10], [10], 'Works')).toBeTruthy();
            expect(Utilities.exercise([10], [1], 'Errors')).toBeFalsy();
        });
    });

	describe('Base 64', () => {
		var rawData = 'Hello World!';
		var base64Data = 'SGVsbG8gV29ybGQh';
		it('can encode', () => {
			expect(Utilities.base64Encode(rawData)).toEqual(base64Data);
		});
		it('can decode', () => {
			expect(Utilities.base64Decode(base64Data)).toEqual(rawData);
		});
	});
	describe('Date Strings', () => {
		it('can produce the short form of the British day for Wednesday (day 4)', () => {
			expect(Utilities.shortDay()(3)).toEqual('Wed');
			expect(Utilities.shortDay('gb-GB', 3)).toEqual('Wed');
		})
		it('can produce the long form of the French day for Wednesday (day 4)', () => {
			expect(Utilities.longDay('fr-FR', 3)).toEqual('mercredi');
			expect(Utilities.longDay()(3)).toEqual('Wednesday');
		})
		it('can produce the short form of the German month for October (Month 9)', () => {
			expect(Utilities.shortMonth('de-DE', 9)).toEqual('Okt');
			expect(Utilities.shortMonth()(9)).toEqual('Oct');
		})
		it('can produce the long form of the British day for October (Month 9)', () => {
			expect(Utilities.longMonth()(9)).toEqual('October');
			expect(Utilities.longMonth('gb-GB', 9)).toEqual('October');
		})
	});

	describe('Object Equality', () => {
		describe('can compare similar nested objects', () => {
			var obj1 = {
				strProp: 'Property 1',
				numProp: 2,
				blnProp: true,
				arrProp: [ 'alpha', 'beta', 'gamma'],
				objProp: {
					subProp: 'Sub Property'
				}
			};
			var obj2 = JSON.parse(JSON.stringify(obj1));

			expect(Utilities.objectEquality(obj1, obj2)).toBeTruthy();
		});

		describe('can compare objects that vary only be a single nested property value', () => {
			var obj1 = {
				strProp: 'Property 1',
				numProp: 2,
				blnProp: true,
				arrProp: [ 'alpha', 'beta', 'gamma'],
				objProp: {
					subProp: 'Sub Property'
				}
			};
			var obj2 = JSON.parse(JSON.stringify(obj1));
			obj2.objProp.subProp = 'Dif Property';

			expect(Utilities.objectEquality(obj1, obj2)).toBeFalsy();
		});

		describe('can compare objects that vary in structure by a single nested property', () => {
			var obj1 = {
				strProp: 'Property 1',
				numProp: 2,
				blnProp: true,
				arrProp: [ 'alpha', 'beta', 'gamma'],
				objProp: {
					subProp: 'Sub Property'
				}
			};
			var obj2 = JSON.parse(JSON.stringify(obj1));
			obj2.objProp.subProp2 = 'Additional Property';

			expect(Utilities.objectEquality(obj1, obj2)).toBeFalsy();
		});
	});

	describe('Case Converter', () => {
		var testText = 'This__is  an EXAMPLE test-case';

		it('can throw an exception for invalid case specification.', () => {
			var testExec = () => {
				var camelCase = Utilities.caseConverter();
			};

			expect(testExec).toThrowError('caseConverter: Invalid case specified. Must be one of the expected constants.');
		});

		it('can convert to camel case', () => {
			var camelCase = Utilities.caseConverter(Utilities.CAMEL);

			var result = camelCase(testText);

			expect(result).toEqual('thisIsAnExampleTestCase');
		});

		it('can convert to global case', () => {
			var globalCase = Utilities.caseConverter(Utilities.GLOBAL);

			var result = globalCase(testText);

			expect(result).toEqual('THIS_IS_AN_EXAMPLE_TEST_CASE');
		});

		it('can convert to title case', () => {
			var titleCase = Utilities.caseConverter(Utilities.TITLE);

			var result = titleCase(testText);

			expect(result).toEqual('This Is An EXAMPLE Test-case');
		});

		it('can convert to kabab case', () => {
			var kababCase = Utilities.caseConverter(Utilities.KABAB);

			var result = kababCase(testText);

			expect(result).toEqual('this-is-an-example-test-case');
		});

		it('can convert to lower case', () => {
			var lowerCase = Utilities.caseConverter(Utilities.LOWER);

			var result = lowerCase(testText);

			expect(result).toEqual('this_is an example test-case');
		});

		it('can convert to pascal case', () => {
			var pascalCase = Utilities.caseConverter(Utilities.PASCAL);

			var result = pascalCase(testText);

			expect(result).toEqual('ThisIsAnExampleTestCase');
		});

		it('can convert to title case', () => {
			var titleCase = Utilities.caseConverter(Utilities.TITLE);

			var result = titleCase(testText);

			expect(result).toEqual('This Is An EXAMPLE Test-case');
		});

		it('can convert to upper case', () => {
			var upperCase = Utilities.caseConverter(Utilities.UPPER);

			var result = upperCase(testText);

			expect(result).toEqual('THIS_IS AN EXAMPLE TEST-CASE');
		});
	});

	describe('console_table', () => {
		it('with an empty array', () => {
			const testData = [];
			const testTarget = { innerHTML: '' };
			const expectedResult = '';
			Utilities.consoleTable( testData, testTarget);
			expect(testTarget.innerHTML).toEqual(expectedResult);
		});

		it('with an array of values', () => {
			const testData = [1, 2, 3, 4, 5];
			const testTarget = { innerHTML: '' };
			const expectedResult = `<table border="1">
<tr><th>#</th><th>Value</th></tr>
<tr><td>0</td><td>1</td></tr>
<tr><td>1</td><td>2</td></tr>
<tr><td>2</td><td>3</td></tr>
<tr><td>3</td><td>4</td></tr>
<tr><td>4</td><td>5</td></tr>
</table>`;
			Utilities.consoleTable( testData, testTarget);
			expect(testTarget.innerHTML).toEqual(expectedResult);
		});

		it('with an array of arrays', () => {
			const testData = [
				[1, 2, 3, 4],
				[5, 6, 7, 8]
			];
			const testTarget = { innerHTML: '' };
			const expectedResult = `<table border="1">
<tr><th>#</th><th>1</th><th>2</th><th>3</th><th>4</th></tr>
<tr><td>0</td><td>1</td><td>2</td><td>3</td><td>4</td></tr>
<tr><td>1</td><td>5</td><td>6</td><td>7</td><td>8</td></tr>
</table>`;
			Utilities.consoleTable( testData, testTarget);
			expect(testTarget.innerHTML).toEqual(expectedResult);
		});

		it('with an array of object', () => {
			const testData = [
				{alpha: 1, beta: 2, gamma: 3, delta: 4},
				{alpha: 5, beta: 6, gamma: 7, delta: 8}
			];
			const testTarget = { innerHTML: '' };
			const expectedResult = `<table border="1">
<tr><th>#</th><th>alpha</th><th>beta</th><th>gamma</th><th>delta</th></tr>
<tr><td>0</td><td>1</td><td>2</td><td>3</td><td>4</td></tr>
<tr><td>1</td><td>5</td><td>6</td><td>7</td><td>8</td></tr>
</table>`;
			Utilities.consoleTable( testData, testTarget);
			expect(testTarget.innerHTML).toEqual(expectedResult);
		});
	})

	describe('dataType', () => {
		it('can detect Undefined', () => {
			expect(Utilities.dataType()).toEqual('undefined');
		});

		it('can detect Null', () => {
			expect(Utilities.dataType(null)).toEqual('null');
		});

		it('can detect Boolean', () => {
			expect(Utilities.dataType(false)).toEqual('boolean');
		});

		it('can detect Numbers', () => {
			expect(Utilities.dataType(42)).toEqual('number');
		});
		
		it('can detect Strings', () => {
			expect(Utilities.dataType('fourty-two')).toEqual('string');
		});
		
		it('can detect Template Literal as String', () => {
			expect(Utilities.dataType(`fourty-two`)).toEqual('string');
		});
		
		it('can detect Objects', () => {
			expect(Utilities.dataType({})).toEqual('object');
		});
		
		it('can detect Arrays', () => {
			expect(Utilities.dataType([])).toEqual('array');
		});
		
		it('can detect Regular Expressions', () => {
			expect(Utilities.dataType(/42/)).toEqual('regexp');
		});

		it('can detect Dates', () => {
			expect(Utilities.dataType(new Date())).toEqual('date');
		});
		
		it('can detect Errors', () => {
			expect(Utilities.dataType(new Error())).toEqual('error');
		});

		it('can detect Sets', () => {
			expect(Utilities.dataType(new Set())).toEqual('set');
		});

		it('can detect Maps', () => {
			expect(Utilities.dataType(new Map())).toEqual('map');
		});

		it('can detect Symbols', () => {
			expect(Utilities.dataType(Symbol())).toEqual('symbol');
		});

		it('can detect Big Integers', () => {
			expect(Utilities.dataType(42n)).toEqual('bigint');
		});
	})
});
