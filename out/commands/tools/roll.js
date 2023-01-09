import { __decorate } from "tslib";
import { rng } from "#helpers/numbers";
import { PrismCommand } from "#structs/PrismCommand";
import { ApplyOptions } from "@sapphire/decorators";
import { GuildMember } from "discord.js";
let RollCommand = class RollCommand extends PrismCommand {
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand(builder => builder //
            .setName(this.name)
            .setDescription(this.description)
            .addIntegerOption(option => option //
            .setName('sides')
            .setDescription('Number of sides on the die')
            .setMinValue(1)
            .setMaxValue(999)));
    }
    chatInputRun(interaction) {
        const sides = interaction.options.getInteger('sides') || 6;
        return interaction.reply({ content: `🎲 ${interaction.member instanceof GuildMember ? interaction.member.displayName : interaction.user.username} rolled a ${rng(1, sides)}.` });
    }
};
RollCommand = __decorate([
    ApplyOptions({
        name: 'roll',
        description: 'Roll a die'
    })
], RollCommand);
export { RollCommand };
//# sourceMappingURL=roll.js.map