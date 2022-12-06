import { ChatInputCommand, Command } from "@sapphire/framework";

export class PingCommand extends Command {

    public constructor(context: Command.Context, options: Command.Options) {
        super(context, { ...options })
    }

    public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
        registry.registerChatInputCommand((builder) => builder.setName('ping').setDescription('Ping the bot.'));
    }

    public async chatInputRun(interaction: Command.ChatInputInteraction): Promise<unknown> {

        await interaction.reply({ content: `Pinging...`, ephemeral: true, fetchReply: true });
        return interaction.editReply(`**Pong! 🏓**\nHeartbeat: \`${this.container.client.ws.ping} ms\`.`)

        /*
        if (isMessageInstance(msg)) {
            const diff = msg.createdTimestamp - interaction.createdTimestamp;
            const ping = Math.round(this.container.client.ws.ping);
            return interaction.editReply(`**Pong! 🏓**\nRound-trip: \`${diff} ms\`\nHeartbeat: \`${ping} ms\`.`);
        }

        return interaction.editReply(`Unable to retrieve ping :(`)*/
    }

}