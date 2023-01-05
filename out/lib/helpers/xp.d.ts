/// <reference types="node" />
import type { PrismClient } from "#lib/PrismClient";
import type { GuildMember } from "discord.js";
export declare function getRequiredXP(level: number): number;
export declare function getLevel(xp: number): number;
export declare function card(member: GuildMember, client: PrismClient): Promise<Buffer>;
//# sourceMappingURL=xp.d.ts.map