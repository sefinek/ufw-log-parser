const { parseTimestamp } = require('../parser-utils.js');
const TEST_CASES = require('./array.js');

describe('parseTimestamp - timestamp parsing tests', () => {
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
				expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
			} else {
				expect(result).toBe(expected);
			}
		});
	});
});