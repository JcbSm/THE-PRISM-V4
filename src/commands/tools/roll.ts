import { rng } from "#helpers/numbers";
import { PrismCommand } from "#structs/PrismCommand";
import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry, ChatInputCommand } from "@sapphire/framework";
import { GuildMember } from "discord.js";

@ApplyOptions<PrismCommand.Options>({
    name: 'roll',
    description: 'Roll a die'
})

export class RollCommand extends PrismCommand { 
    public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
        registry.registerChatInputCommand(builder =>
            builder //
                .setName(this.name)
                .setDescription(this.description)
                .addIntegerOption(option =>
                    option //
                        .setName('sides')
                        .setDescription('Number of sides on the die')
                        .setMinValue(1)
                        .setMaxValue(999)))
    }

    public override chatInputRun(interaction: ChatInputCommand.Interaction) {
        const sides = interaction.options.getInteger('sides') || 6;
        return interaction.reply({ content: `🎲 ${interaction.member instanceof GuildMember ? interaction.member.displayName : interaction.user.username} rolled a ${rng(1, sides)}.`})
    }
}