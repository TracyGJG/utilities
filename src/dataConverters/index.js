export function base64Decode(b64) {
	return decodeURIComponent(
		[...b64.replace(/=*$/, '')]
			.map(char =>
				'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
					.indexOf(char)
					.toString(2)
					//@ts-ignore missing padStart method of String objects.
					.padStart(6, '0')
			)
			.join('')
			.match(/.{8}/g)
			.map(bin => `%${parseInt(bin, 2).toString(16).toUpperCase()}`)
			.join('')
	);
}

export function base64Encode(bin) {
	const BTOA = str => Buffer.from(str).toString('base64');
	return BTOA(
		encodeURIComponent(bin).replace(/%([\dA-F]{2})/g, (_, p1) =>
			String.fromCharCode(Number(`0x${p1}`))
		)
	);
}

export function longDay(lang = 'en-GB', idx) {
	var dateString = _ =>
		new Date(1970, 0, 4 + _).toLocaleString(lang, { weekday: 'long' });
	return arguments.length == 2 ? dateString(idx) : dateString;
}

export function longMonth(lang = 'en-GB', idx) {
	var dateString = _ =>
		new Date(1970, _, 1).toLocaleString(lang, { month: 'long' });
	return arguments.length == 2 ? dateString(idx) : dateString;
}

export function shortDay(lang = 'en-GB', idx) {
	var dateString = _ =>
		new Date(1970, 0, 4 + _).toLocaleString(lang, {
			weekday: 'short',
		});
	return arguments.length == 2 ? dateString(idx) : dateString;
}

export function shortMonth(lang = 'en-GB', idx) {
	var dateString = _ =>
		new Date(1970, _, 1).toLocaleString(lang, { month: 'short' });
	return arguments.length == 2 ? dateString(idx) : dateString;
}
