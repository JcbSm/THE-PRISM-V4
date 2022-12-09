import { __decorate } from "tslib";
import { PrismCommand } from "#structs/PrismCommand";
import { ApplyOptions } from "@sapphire/decorators";
let PingCommand = class PingCommand extends PrismCommand {
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) => builder
            .setName('ping')
            .setDescription('Ping the bot.'), {
            // [dev, prod]
            idHints: ['868234547471462453', '1050050625771163688']
        });
    }
    async chatInputRun(interaction) {
        await interaction.reply({ content: `Pinging...`, ephemeral: true, fetchReply: true });
        return interaction.editReply(`**Pong! 🏓**\nHeartbeat: \`${this.container.client.ws.ping} ms\`.`);
    }
};
PingCommand = __decorate([
    ApplyOptions({})
], PingCommand);
export { PingCommand };
//# sourceMappingURL=ping.js.map