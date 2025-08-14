import { base64Decode, base64Encode } from './index.js';

describe('Converters', () => {
  describe('Base 64', () => {
    const rawData = 'Hello World!';
    const encodedData = 'SGVsbG8gV29ybGQh';
    it('can encode', () => {
      expect(base64Encode(rawData)).toEqual(encodedData);
    });
    it('can decode', () => {
      expect(base64Decode(encodedData)).toEqual(rawData);
    });
  });
});
