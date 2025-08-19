const { parseTimestamp } = require('../utils.js');

describe('parseTimestamp() with timezones', () => {
	it('parses ISO 8601 with +09:30 offset', () => {
		const line = 'twooooooo 2025-03-18T21:28:44+09:30 catsssssssssssssssss';
		const result = parseTimestamp(line);
		expect(result).toBe('2025-03-18T11:58:44.000Z');
	});

	it('parses ISO 8601 with -05:00 offset', () => {
		const line = '2025-03-18T21:28:44-05:00 some text';
		const result = parseTimestamp(line);
		expect(result).toBe('2025-03-19T02:28:44.000Z');
	});

	it('parses ISO 8601 with Z (UTC)', () => {
		const line = '2025-03-18T21:28:44Z cat';
		const result = parseTimestamp(line);
		expect(result).toBe('2025-03-18T21:28:44.000Z');
	});

	it('parses syslog with local timezone', () => {
		const line = 'Mar 18 21:28:44 keyboard cat';
		const result = parseTimestamp(line);
		expect(result).toMatch(/^\d{4}-03-18T\d{2}:28:44\.000Z$/);
	});

	it('parses syslog without seconds', () => {
		const line = 'Mar 18 21:28 some-service';
		const result = parseTimestamp(line);
		expect(result).toMatch(/^\d{4}-03-18T\d{2}:28:00\.000Z$/);
	});
});