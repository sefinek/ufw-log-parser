const { parseUfwLog } = require('../index.js');

const line = '2025-04-27T06:33:00.278063+02:00 sefinek-vps kernel: [UFW BLOCK] IN=ens3 OUT= MAC=00:d8:0f:6d:ab:20:50:87:89:68:26:73:08:00 SRC=172.70.240.4 DST=123.123.123 LEN=527 TOS=0x08 PREC=0x80 TTL=52 ID=36239 DF PROTO=TCP SPT=30962 DPT=443 WINDOW=12 RES=0x00 ACK PSH URGP=0';
const parsed = parseUfwLog(line);

console.log(parsed);