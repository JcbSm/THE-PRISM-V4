import { PrismCommand } from "#structs/PrismCommand";
import { ApplyOptions } from "@sapphire/decorators";
import type { ChatInputCommand } from "@sapphire/framework";

@ApplyOptions<PrismCommand.Options>({
    name: 'chess',
    description: 'Play chess'
})

export class ChessCommand extends PrismCommand {

    public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
        registry.registerChatInputCommand((command) => 
            command //
                .setName(this.name)
                .setDescription(this.description)
            )
    }

    public override chatInputRun(interaction: PrismCommand.ChatInputInteraction) {

        interaction.reply({ content: "BRUH" })

    }
}