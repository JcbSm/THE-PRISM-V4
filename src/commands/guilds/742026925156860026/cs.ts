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
                    guildIds: this.client.dev ? ['569556194612740115'] : ['742026925156860026'],
                    idHints: ['1050830508906528849', '1050832661184258048']
                }
        )
    }

    public async chatInputRun(interaction: PrismCommand.ChatInputInteraction) {
        return await interaction.reply({ content: `@everyone cs or bent` });
    }
}