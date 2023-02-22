import {
	base64Decode,
	base64Encode,
	longDay,
	longMonth,
	shortDay,
	shortMonth,
} from './index.js';

describe('Converters', () => {
	describe('Base 64', () => {
		const rawData = 'Hello World!';
		const base64Data = 'SGVsbG8gV29ybGQh';
		it('can encode', () => {
			expect(base64Encode(rawData)).toEqual(base64Data);
		});
		it('can decode', () => {
			expect(base64Decode(base64Data)).toEqual(rawData);
		});
	});
	describe('Date Strings', () => {
		it('can produce the short form of the British day for Wednesday (day 3)', () => {
			expect(shortDay()(3)).toEqual('Wed');
			expect(shortDay('gb-GB', 3)).toEqual('Wed');
		});
		it('can produce the long form of the French day for Wednesday (day 3)', () => {
			expect(longDay('fr-FR', 3)).toEqual('mercredi');
			expect(longDay()(3)).toEqual('Wednesday');
		});
		it('can produce the short form of the German month for October (Month 9)', () => {
			expect(shortMonth('de-DE', 9)).toEqual('Okt');
			expect(shortMonth()(9)).toEqual('Oct');
		});
		it('can produce the long form of the British day for October (Month 9)', () => {
			expect(longMonth()(9)).toEqual('October');
			expect(longMonth('gb-GB', 9)).toEqual('October');
		});
	});
});
