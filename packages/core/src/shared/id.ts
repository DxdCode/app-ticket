import { ulid } from "ulid";

export const prefixes = {
    user: "usr",
    ticket: "tck",
    message: "msg",
    aiLog: "ail",
} as const;

export function createID(prefix: keyof typeof prefixes): string {
    return [prefixes[prefix], ulid()].join("_");
}