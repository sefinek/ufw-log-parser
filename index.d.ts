export interface UfwFlags {
    ack: boolean;
    syn: boolean;
    psh: boolean;
    urg: boolean;
    fin: boolean;
    rst: boolean;
}

export interface UfwLogEntry {
    timestamp: string;
    srcIp: string | null;
    dstIp: string | null;
    proto: string | null;
    spt: number | null;
    dpt: number | null;
    in: string | null;
    out: string | null;
    mac: string | null;
    len: number | null;
    ttl: number | null;
    id: number | null;
    tos: string | null;
    prec: string | null;
    res: string | null;
    window: number | null;
    urgp: number | null;
    flags: UfwFlags;
    df: boolean;
}

export function parseUfwLog(line: string): UfwLogEntry;
export function parseNumber(str: string, regex: RegExp): number | null;
export function parseTimestamp(str: string): string;
export const version: string;
