const REGEX = /(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})?)|((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2}\s+\d{2}:\d{2}(?::\d{2})?)/;
const MONTHS = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' };

exports.parseNumber = (str, regex) => {
	const parsed = str.match(regex)?.[1];
	return parsed !== undefined ? Number(parsed) : null;
};

const pad = n => n.toString().padStart(2, '0');

const getCurrentUTC = () => {
	const d = new Date();
	return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}Z`;
};

exports.parseTimestamp = str => {
	const match = str?.match(REGEX);
	if (!match) return getCurrentUTC();

	let ts = match[0];

	if (!ts.includes('T')) {
		const parts = ts.trim().split(/\s+/);
		if (parts.length < 2) return getCurrentUTC();

		const [monthName, day, time] = parts;
		const month = MONTHS[monthName];
		if (!month) return getCurrentUTC();

		const now = new Date();
		const year = now.getUTCFullYear();
		const correctedTime = time.length === 5 ? time + ':00' : time; // HH:mm → HH:mm:ss

		ts = `${year}-${month}-${pad(day)}T${correctedTime}Z`;
	}

	if (!(/[+-]\d{2}:\d{2}|Z$/).test(ts)) {
		ts += 'Z';
	}

	const parsed = Date.parse(ts);
	if (isNaN(parsed) || parsed > Date.now()) return getCurrentUTC();

	const d = new Date(parsed);
	return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}Z`;
};

exports.MONTHS = MONTHS;