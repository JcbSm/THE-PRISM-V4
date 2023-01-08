import { PrismPrecondition } from "#structs/PrismPrecondition";
import { ApplyOptions } from "@sapphire/decorators";
import type { ChatInputCommandInteraction, ContextMenuCommandInteraction, GuildMember, Message } from "discord.js";

@ApplyOptions<PrismPrecondition.Options>({
    name: 'Administrator'
})

export class AdministratorPrecondition extends PrismPrecondition {
    public override async messageRun(message: Message) {
        return message.member ? this.isAdmin(message.member) : this.ok()
    }

    public async chatInputRun(interaction: ChatInputCommandInteraction) {
        if (!interaction.inCachedGuild()) 
            return this.error({ message: 'No' })
        return this.isAdmin(interaction.member)
    }

    public async contextMenuRun(interaction: ContextMenuCommandInteraction) {
        if (!interaction.inCachedGuild()) 
            return this.error({ message: 'No' })
        return this.isAdmin(interaction.member)
    }

    private isAdmin(member: GuildMember ) {
        return member.permissions.has('Administrator') ? this.ok() : this.error({ message: 'Administrator permissions are required for this command.' });
    }
}

declare module '@sapphire/framework' {
    interface Preconditions {
        Administrator: never;
    }
}