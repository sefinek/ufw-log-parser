const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { parseTimestamp, toUtcStringMs } = require('../utils.js');
const TEST_CASES = require('./array.js');

describe('parseTimestamp()', () => {
	TEST_CASES.forEach(({ input, expected }) => {
		it(`correctly parses: "${input}"`, () => {
			const result = parseTimestamp(input);

			if (expected === 'now') {
				const now = new Date();
				const parsed = new Date(result.timestamp);

				assert.equal(parsed.getUTCFullYear(), now.getUTCFullYear());
				assert.equal(parsed.getUTCMonth(), now.getUTCMonth());
				assert.equal(parsed.getUTCDate(), now.getUTCDate());
			} else if (expected === 'syslog') {
				assert.equal(typeof result, 'string');
				assert.match(result.timestamp, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
			} else {
				assert.equal(result.timestamp, expected);
			}
		});
	});
});

describe('toUtcStringMs()', () => {
	it('formats a given Date in UTC with milliseconds', () => {
		const d = new Date(Date.UTC(2025, 0, 2, 3, 4, 5, 6));
		assert.equal(toUtcStringMs(d), '2025-01-02T03:04:05.006Z');
	});

	it('matches ISO shape', () => {
		const s = toUtcStringMs(new Date());
		assert.match(s, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
	});
});