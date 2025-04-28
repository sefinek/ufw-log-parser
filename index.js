const { parseNumber, parseTimestamp } = require('./parser-utils.js');
const { version } = require('./package.json');

const parseUfwLog = line => {
	const match = (regex) => line.match(regex)?.[1] || null;
	const tcpFlags = line.match(/\b(ACK|SYN|PSH|URG|FIN|RST)\b/g) || [];

	return {
		timestamp: parseTimestamp(line),
		srcIp: match(/SRC=(\S+)/),
		dstIp: match(/DST=(\S+)/),
		proto: match(/PROTO=(\S+)/),
		spt: parseNumber(line, /SPT=(\d+)/),
		dpt: parseNumber(line, /DPT=(\d+)/),
		in: match(/IN=(\S+)/),
		out: match(/OUT=(\S+)/),
		mac: match(/MAC=([\w:]+)/),
		len: parseNumber(line, /LEN=(\d+)/),
		ttl: parseNumber(line, /TTL=(\d+)/),
		id: parseNumber(line, /ID=(\d+)/),
		tos: match(/TOS=(\S+)/),
		prec: match(/PREC=(\S+)/),
		res: match(/RES=(\S+)/),
		window: parseNumber(line, /WINDOW=(\d+)/),
		urgp: parseNumber(line, /URGP=(\d+)/),
		flags: {
			ack: tcpFlags.includes('ACK'),
			syn: tcpFlags.includes('SYN'),
			psh: tcpFlags.includes('PSH'),
			urg: tcpFlags.includes('URG'),
			fin: tcpFlags.includes('FIN'),
			rst: tcpFlags.includes('RST'),
		},
	};
};

module.exports = {
	parseUfwLog,
	utils: {
		parseNumber,
		parseTimestamp,
	},
	version,
};