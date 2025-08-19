const ISO_RE = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})?/;
const SYSLOG_RE = /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2}\s+\d{2}:\d{2}(?::\d{2})?/;
const MONTHS = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' };

const pad = n => n.toString().padStart(2, '0');
const pad3 = n => n.toString().padStart(3, '0');

const toUtcStringMs = d =>
	`${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}.${pad3(d.getUTCMilliseconds())}Z`;

const getCurrentUTC = () => toUtcStringMs(new Date());

const parseNumber = (str, regex) => {
	const m = str.match(regex);
	return m ? Number(m[1]) : null;
};

const parseTimestamp = str => {
	if (!str) return getCurrentUTC();

	const iso = str.match(ISO_RE);
	if (iso) {
		let ts = iso[0];
		if ((/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/).test(ts)) ts += ':00';
		if (!(/[+-]\d{2}:\d{2}|Z$/).test(ts)) ts += 'Z';
		const t = Date.parse(ts);
		if (isNaN(t) || t > Date.now()) return getCurrentUTC();
		return toUtcStringMs(new Date(t));
	}

	const sys = str.match(SYSLOG_RE);
	if (sys) {
		const raw = sys[0].replace(/\s+/g, ' ').trim();
		const [mon, dayS, time] = raw.split(' ');
		const month = MONTHS[mon];
		if (!month) return getCurrentUTC();
		const [hh, mm, ss] = (time.length === 5 ? `${time}:00` : time).split(':').map(Number);
		const year = new Date().getFullYear();
		const local = new Date(year, parseInt(month) - 1, parseInt(dayS, 10), hh, mm, ss || 0, 0);
		const utcMillis = local.getTime() - local.getTimezoneOffset() * 60000;
		return toUtcStringMs(new Date(utcMillis));
	}

	return getCurrentUTC();
};

module.exports = { parseNumber, parseTimestamp, MONTHS, toUtcStringMs };