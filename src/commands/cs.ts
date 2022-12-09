import { PrismCommand } from "#structs/PrismCommand";
import { ApplyOptions } from "@sapphire/decorators";
import type { ChatInputCommand } from "@sapphire/framework";

@ApplyOptions<PrismCommand.Options>({
    name: 'cs',
    aliases: []
})

export default class extends PrismCommand {

    constructor(context: PrismCommand.Context, { ...options }: PrismCommand.Options) {
        super(context, { ...options, name: 'cs', aliases: ['cs'] })
    }

    public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
        registry.registerChatInputCommand(command =>
            command //
                .setName('cs')
                .setDescription('Load up noob'),
                {
                    guildIds: ['742026925156860026'],
                    idHints: ['1050830508906528849']
                }
        )
    }

    public async chatInputRun(interaction: PrismCommand.ChatInputInteraction) {

        interaction.reply({ content: `@everyone cs or bent` });

    }
}