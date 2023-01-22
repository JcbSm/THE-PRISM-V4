import { __decorate } from "tslib";
import { PrismCommand } from "#structs/PrismCommand";
import { ApplyOptions } from "@sapphire/decorators";
let PokerCommand = class PokerCommand extends PrismCommand {
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand(command => command //
            .setName(this.name)
            .setDescription(this.description));
    }
    async chatInputRun(interaction) {
        await interaction.deferReply();
    }
};
PokerCommand = __decorate([
    ApplyOptions({
        name: 'blackjack',
        description: 'Play a game of blackjack'
    })
], PokerCommand);
export { PokerCommand };
//# sourceMappingURL=blackjack.js.map