/// <reference types="node" />
import type { DatabaseClient } from "#lib/database/DatabaseClient";
import type { Message } from "discord.js";
export declare function getPollResults(db: DatabaseClient, message: Message): Promise<{
    optionValues: string[];
    results: number[];
    totalVotes: number;
}>;
export declare function resultsCanvas(options: string[], results: number[]): Buffer;
//# sourceMappingURL=polls.d.ts.map