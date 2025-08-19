# UFW Log Parser
A lightweight and fast parser for UFW firewall logs, supporting TCP flags, timestamps, and detailed packet metadata.

## Installation
```bash
npm install ufw-log-parser
```

## Usage
```js
const { parseUfwLog } = require('ufw-log-parser');

const log = '2025-04-27T06:33:00.278063+02:00 sefinek-server kernel: [UFW BLOCK] IN=ens3 OUT= MAC=00:d8:0f:6d:ab:20:50:87:89:68:26:73:08:00 SRC=172.70.240.4 DST=104.21.23.5 LEN=527 TOS=0x08 PREC=0x80 TTL=52 ID=36239 DF PROTO=TCP SPT=30962 DPT=443 WINDOW=12 RES=0x00 ACK PSH URGP=0';
const parsed = parseUfwLog(log);

console.log(parsed);
```

## Output
```json
{
  "timestamp": "2025-04-27T04:33:00.278Z",
  "srcIp": "172.70.240.4",
  "dstIp": "104.21.23.5",
  "proto": "TCP",
  "spt": 30962,
  "dpt": 443,
  "in": "ens3",
  "out": null,
  "mac": "00:d8:0f:6d:ab:20:50:87:89:68:26:73:08:00",
  "len": 527,
  "ttl": 52,
  "id": 36239,
  "tos": "0x08",
  "prec": "0x80",
  "res": "0x00",
  "window": 12,
  "urgp": 0,
  "flags": {
    "ack": true,
    "syn": false,
    "psh": true,
    "urg": false,
    "fin": false,
    "rst": false
  },
  "df": true
}
```

## More Examples
See the [examples](examples) folder for more usage examples.


## API
### `parseUfwLog(line: string): UfwLogEntry`
Parses a single UFW log line and returns a structured object with all extracted fields.

### `parseNumber(str: string, regex: RegExp): number | null`
Extracts and converts a number from a string based on a regex pattern.

### `parseTimestamp(str: string): string`
Extracts a timestamp from a string and returns it in normalized ISO 8601 UTC format.


## License
MIT