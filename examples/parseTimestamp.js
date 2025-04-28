const { parseTimestamp, MONTHS } = require('../parser-utils.js');
const TEST_CASES = require('../test/array.js');

const isApproximatelyNow = ts => {
	const now = Date.now();
	const parsed = Date.parse(ts);
	return !isNaN(parsed) && Math.abs(parsed - now) < 3000 && ts.endsWith('Z');
};

const isSyslogMatching = (input, ts) => {
	const match = input.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2})\s+(\d{2}):(\d{2})(?::(\d{2}))?/);
	if (!match) return false;

	const [, monthStr, day, hour, minute, second = '00'] = match;
	const now = new Date();
	const expected = `${now.getUTCFullYear()}-${MONTHS[monthStr]}-${day.padStart(2, '0')}T${hour.padStart(2, '0')}:${minute.padStart(2, '0')}:${second.padStart(2, '0')}Z`;
	return ts === expected;
};

let passedCount = 0;
const failedTests = [];

TEST_CASES.forEach(({ input, expected }) => {
	const result = parseTimestamp(input);
	const passed =
        expected === 'now' ? isApproximatelyNow(result) :
        	expected === 'syslog' ? isSyslogMatching(input, result) :
        		result === expected;

	if (passed) {
		console.log(`[PASS] ${input} -> ${result}`);
		passedCount++;
	} else {
		console.log(`[FAIL] ${input} -> ${result} (expected: ${expected})`);
		failedTests.push({ input, expected, actual: result });
	}
});

console.log(`\nSummary: ${passedCount}/${TEST_CASES.length} tests passed`);

if (failedTests.length > 0) {
	console.log('\nFailed tests:');
	failedTests.forEach(({ input, expected, actual }) => {
		console.log(`- Input: ${input}`);
		console.log(`  Expected: ${expected}`);
		console.log(`  Received: ${actual}\n`);
	});
}