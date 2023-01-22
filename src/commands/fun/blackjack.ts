import { PrismCommand } from "#structs/PrismCommand";
import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry } from "@sapphire/framework";

@ApplyOptions<PrismCommand.Options>({
    name: 'blackjack',
    description: 'Play a game of blackjack'
})

export class PokerCommand extends PrismCommand {
    public registerApplicationCommands(registry: ApplicationCommandRegistry) {
        registry.registerChatInputCommand(command =>
            command //
                .setName(this.name)
                .setDescription(this.description))
    }

    public override async chatInputRun(interaction: PrismCommand.ChatInputInteraction) {

        await interaction.deferReply();

    }
}