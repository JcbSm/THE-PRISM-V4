import { PrismListener } from "#structs/PrismListener";
import { GuildMember } from "discord.js";
export default class extends PrismListener {
    run(member: GuildMember, level: number): Promise<void>;
    private levelRoles;
    private levelUpMessage;
}
//# sourceMappingURL=memberLevelUp.d.ts.map