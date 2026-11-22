const { describe, test } = require('node:test');
const assert = require('node:assert/strict');
const { parseUfwLog } = require('../index.js');

describe('parseUfwLog()', () => {
	const samples = [
		{
			desc: 'Basic TCP SYN packet',
			line: '2025-04-28T04:26:10.353484+02:00 nyc-vps-01 kernel: [UFW BLOCK] IN=ens3 OUT= MAC=00:d8:0f:6d:ab:20 SRC=104.21.23.5 DST=172.67.16.8 LEN=40 TOS=0x00 PREC=0x00 TTL=244 ID=27667 PROTO=TCP SPT=8080 DPT=3324 WINDOW=1024 RES=0x00 SYN URGP=0',
			expected: {
				srcIp: '104.21.23.5',
				dstIp: '172.67.16.8',
				proto: 'TCP',
				spt: 8080,
				dpt: 3324,
				in: 'ens3',
				out: null,
				mac: '00:d8:0f:6d:ab:20',
				len: 40,
				ttl: 244,
				id: 27667,
				urgp: 0,
				flags: { syn: true, ack: false, psh: false, urg: false, fin: false, rst: false },
				df: false,
			},
		},
		{
			desc: 'UDP packet, no TCP flags',
			line: '2025-04-27T07:32:12.419185+02:00 frankfurt-vps kernel: [UFW BLOCK] IN=ens3 OUT= MAC=fa:16:3e SRC=64.62.156.116 DST=139.99.56.17 LEN=48 TOS=0x00 PREC=0x00 TTL=34 ID=3543 DF PROTO=UDP SPT=25997 DPT=523 LEN=28',
			expected: {
				srcIp: '64.62.156.116',
				dstIp: '139.99.56.17',
				proto: 'UDP',
				spt: 25997,
				dpt: 523,
				in: 'ens3',
				out: null,
				mac: 'fa:16:3e',
				len: 48,
				ttl: 34,
				id: 3543,
				urgp: null,
				flags: { syn: false, ack: false, psh: false, urg: false, fin: false, rst: false },
				df: true,
			},
		},
		{
			desc: 'TCP packet with RST flag',
			line: '2025-04-28T11:00:00.111111+02:00 lon-edge-01 kernel: [UFW BLOCK] IN=eth0 OUT= MAC=de:ad:be:ef SRC=8.8.8.8 DST=1.1.1.1 LEN=60 TOS=0x00 PREC=0x00 TTL=55 ID=7777 PROTO=TCP SPT=1234 DPT=443 WINDOW=0 RES=0x00 RST URGP=0',
			expected: {
				srcIp: '8.8.8.8',
				dstIp: '1.1.1.1',
				proto: 'TCP',
				spt: 1234,
				dpt: 443,
				in: 'eth0',
				out: null,
				mac: 'de:ad:be:ef',
				len: 60,
				ttl: 55,
				id: 7777,
				urgp: 0,
				flags: { syn: false, ack: false, psh: false, urg: false, fin: false, rst: true },
				df: false,
			},
		},
		{
			desc: 'TCP packet with FIN and URG flags',
			line: '2025-04-28T12:00:00.222222+02:00 singapore-vm1 kernel: [UFW BLOCK] IN=ens6 OUT= MAC=aa:bb:cc:dd:ee SRC=45.83.192.1 DST=103.21.244.1 LEN=52 TOS=0x10 PREC=0x00 TTL=128 ID=5555 PROTO=TCP SPT=2222 DPT=80 WINDOW=29200 RES=0x00 FIN URG URGP=1',
			expected: {
				srcIp: '45.83.192.1',
				dstIp: '103.21.244.1',
				proto: 'TCP',
				spt: 2222,
				dpt: 80,
				in: 'ens6',
				out: null,
				mac: 'aa:bb:cc:dd:ee',
				len: 52,
				ttl: 128,
				id: 5555,
				urgp: 1,
				flags: { syn: false, ack: false, psh: false, urg: true, fin: true, rst: false },
				df: false,
			},
		},
		{
			desc: 'Minimal UDP log without OUT & MAC',
			line: '2025-04-28T13:00:00.333333+02:00 warsaw-node-1 kernel: [UFW BLOCK] IN=ens7 SRC=178.128.200.1 DST=95.216.24.232 PROTO=UDP SPT=5000 DPT=5001 LEN=28',
			expected: {
				srcIp: '178.128.200.1',
				dstIp: '95.216.24.232',
				proto: 'UDP',
				spt: 5000,
				dpt: 5001,
				in: 'ens7',
				out: null,
				mac: null,
				len: 28,
				ttl: null,
				id: null,
				urgp: null,
				flags: { syn: false, ack: false, psh: false, urg: false, fin: false, rst: false },
				df: false,
			},
		},
	];

	for (const { desc, line, expected } of samples) {
		test(desc, () => {
			const result = parseUfwLog(line);

			assert.match(result.timestamp, /^2025-04-28T|2025-04-27T/);
			assert.equal(result.srcIp, expected.srcIp);
			assert.equal(result.dstIp, expected.dstIp);
			assert.equal(result.proto, expected.proto);
			assert.equal(result.spt, expected.spt);
			assert.equal(result.dpt, expected.dpt);
			assert.equal(result.in, expected.in);
			assert.equal(result.out, expected.out);

			if (expected.mac !== null) {
				assert.equal(result.mac?.startsWith(expected.mac), true);
			} else {
				assert.equal(result.mac, null);
			}

			if (expected.len !== null) {
				assert.ok(result.len > 0);
			} else {
				assert.equal(result.len, null);
			}

			if (expected.ttl !== null) {
				assert.ok(result.ttl > 0);
			} else {
				assert.equal(result.ttl, null);
			}

			if (expected.id !== null) {
				assert.ok(result.id > 0);
			} else {
				assert.equal(result.id, null);
			}

			if (expected.urgp !== undefined) {
				assert.equal(result.urgp, expected.urgp);
			}

			assert.deepEqual(result.flags, expected.flags);
			assert.deepEqual(result.df, expected.df);
		});
	}
});
