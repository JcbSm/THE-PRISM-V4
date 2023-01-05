import { PrismListener } from "#structs/PrismListener";
import { GuildMember } from "discord.js";
export default class extends PrismListener {
    run(member: GuildMember, level: number): Promise<import("discord.js").Message<boolean> | undefined>;
}
//# sourceMappingURL=memberLevelUp.d.ts.map