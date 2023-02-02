import { parseDirname } from "#helpers/files";
import { PrismCommand } from "#structs/PrismCommand";
import { ApplyOptions } from "@sapphire/decorators";
import type { ChatInputCommand } from "@sapphire/framework";

const dirname = parseDirname(import.meta.url);

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
                .setName(this.name)
                .setDescription('Load up noob')
                .addStringOption(option =>
                    option //
                        .setName('time')
                        .setDescription('What time you want to play')
                        .setRequired(false)),
                {
                    guildIds: this.client.dev ? [this.client.devGuildId] : dirname ? [dirname] : []
                }
        )
    }

    public async chatInputRun(interaction: PrismCommand.ChatInputInteraction) {

        const time = interaction.options.getString('time')

        return await interaction.reply({ content: time ? `@everyone cs or bent at ${time}` : `@everyone cs or bent` });
    }
}