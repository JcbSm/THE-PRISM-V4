import { PrismCommand } from "#structs/PrismCommand";
import { ApplyOptions } from "@sapphire/decorators"
import type { ChatInputCommand } from "@sapphire/framework";

@ApplyOptions<PrismCommand.Options>({

})

export class PingCommand extends PrismCommand {

    public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
        registry.registerChatInputCommand(
            (builder) => builder
                .setName('ping')
                .setDescription('Ping the bot.'));
    }

    public async chatInputRun(interaction: PrismCommand.ChatInputInteraction): Promise<unknown> {

        await interaction.reply({ content: `Pinging...`, ephemeral: true, fetchReply: true });
        return interaction.editReply(`**Pong! 🏓**\nHeartbeat: \`${this.container.client.ws.ping} ms\`.`)

    }

}