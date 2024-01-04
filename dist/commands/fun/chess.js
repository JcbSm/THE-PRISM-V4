import { __decorate } from "tslib";
import { PrismCommand } from "#structs/PrismCommand";
import { ApplyOptions } from "@sapphire/decorators";
let ChessCommand = class ChessCommand extends PrismCommand {
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((command) => command //
            .setName(this.name)
            .setDescription(this.description));
    }
    chatInputRun(interaction) {
        interaction.reply({ content: "BRUH" });
    }
};
ChessCommand = __decorate([
    ApplyOptions({
        name: 'chess',
        description: 'Play chess'
    })
], ChessCommand);
export { ChessCommand };
//# sourceMappingURL=chess.js.map