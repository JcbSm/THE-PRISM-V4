import { PrismPrecondition } from "#structs/PrismPrecondition";
import type { ChatInputCommandInteraction, ContextMenuCommandInteraction, Message } from "discord.js";
export declare class AdministratorPrecondition extends PrismPrecondition {
    messageRun(message: Message): Promise<import("@sapphire/result").Result<unknown, import("@sapphire/framework").UserError>>;
    chatInputRun(interaction: ChatInputCommandInteraction): Promise<import("@sapphire/result").Result<unknown, import("@sapphire/framework").UserError>>;
    contextMenuRun(interaction: ContextMenuCommandInteraction): Promise<import("@sapphire/result").Result<unknown, import("@sapphire/framework").UserError>>;
    private isAdmin;
}
declare module '@sapphire/framework' {
    interface Preconditions {
        Administrator: never;
    }
}
//# sourceMappingURL=administrator.d.ts.map