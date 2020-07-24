const Utilities = require('./utilities');

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
});
