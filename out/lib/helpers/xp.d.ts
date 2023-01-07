/// <reference types="node" />
import type { PrismClient } from "#lib/PrismClient";
import type { Guild, GuildMember } from "discord.js";
import type { DatabaseMember } from "#lib/database/DatabaseMember";
export declare function getRequiredXP(level: number): number;
export declare function getLevel(xp: number): number;
export declare function card(member: GuildMember, client: PrismClient): Promise<Buffer>;
export declare function leaderboard(members: DatabaseMember[], page: number, guild: Guild, client: PrismClient): Promise<Buffer>;
//# sourceMappingURL=xp.d.ts.map