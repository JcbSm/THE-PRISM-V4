import { Command } from "@sapphire/framework";
export class PingCommand extends Command {
    constructor(context, options) {
        super(context, { ...options });
    }
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) => builder.setName('ping').setDescription('Ping the bot.'));
    }
    async chatInputRun(interaction) {
        await interaction.reply({ content: `Pinging...`, ephemeral: true, fetchReply: true });
        return interaction.editReply(`**Pong! 🏓**\nHeartbeat: \`${this.container.client.ws.ping} ms\`.`);
        /*
        if (isMessageInstance(msg)) {
            const diff = msg.createdTimestamp - interaction.createdTimestamp;
            const ping = Math.round(this.container.client.ws.ping);
            return interaction.editReply(`**Pong! 🏓**\nRound-trip: \`${diff} ms\`\nHeartbeat: \`${ping} ms\`.`);
        }

        return interaction.editReply(`Unable to retrieve ping :(`)*/
    }
}
//# sourceMappingURL=ping.js.map