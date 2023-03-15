export function base64Decode(b64) {
	return decodeURIComponent(
		[...b64.replace(/=*$/, '')]
			.map(char =>
				'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
					.indexOf(char)
					.toString(2)
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

const dateString =
	(lang = 'en-GB', len, period) =>
	idx =>
		new Date(
			0,
			period === 'month' ? idx : 0,
			period === 'weekday' ? idx : 1
		).toLocaleString(lang, { [period]: len });

export function shortDay(lang) {
	return dateString(lang, 'short', 'weekday');
}

export function longDay(lang) {
	return dateString(lang, 'long', 'weekday');
}

export function shortMonth(lang) {
	return dateString(lang, 'short', 'month');
}

export function longMonth(lang) {
	return dateString(lang, 'long', 'month');
}
