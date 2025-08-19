const { parseTimestamp, toUtcStringMs } = require('../utils.js');
const TEST_CASES = require('./array.js');

describe('parseTimestamp()', () => {
	TEST_CASES.forEach(({ input, expected }) => {
		it(`correctly parses: "${input}"`, () => {
			const result = parseTimestamp(input);

			if (expected === 'now') {
				const now = new Date();
				const parsed = new Date(result);

				expect(parsed.getUTCFullYear()).toBe(now.getUTCFullYear());
				expect(parsed.getUTCMonth()).toBe(now.getUTCMonth());
				expect(parsed.getUTCDate()).toBe(now.getUTCDate());
			} else if (expected === 'syslog') {
				expect(typeof result).toBe('string');
				expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
			} else {
				expect(result).toBe(expected);
			}
		});
	});
});

describe('toUtcStringMs()', () => {
	it('formats a given Date in UTC with milliseconds', () => {
		const d = new Date(Date.UTC(2025, 0, 2, 3, 4, 5, 6));
		expect(toUtcStringMs(d)).toBe('2025-01-02T03:04:05.006Z');
	});

	it('matches ISO shape', () => {
		const s = toUtcStringMs(new Date());
		expect(s).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
	});
});