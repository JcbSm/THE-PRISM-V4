import { getDirname } from "#helpers/files";
import { PrismCommand } from "#structs/PrismCommand";
import { ApplyOptions } from "@sapphire/decorators";
import type { ChatInputCommand } from "@sapphire/framework";

const dirname = getDirname(import.meta.url);

@ApplyOptions<PrismCommand.Options>({
    name: 'cs',
    aliases: []
})

export default class extends PrismCommand {

    constructor(context: PrismCommand.Context, { ...options }: PrismCommand.Options) {
        super(context, { ...options, name: 'orbent', aliases: ['orbent'] })
    }

    public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
        registry.registerChatInputCommand(command =>
            command //
                .setName(this.name)
                .setDescription('Load up noob')
                .addStringOption((option) =>
                    option //
                        .setName('activity')
                        .setDescription('_____ or bent')
                        .setMaxLength(64)
                        .setMinLength(1)
                        .setRequired(true)),
                {
                    guildIds: this.client.dev ? [this.client.devGuildId] : dirname ? [dirname] : [],
                    idHints: ['1058528121156022412']
                }
        )
    }

    public async chatInputRun(interaction: PrismCommand.ChatInputInteraction) {
        const activity = interaction.options.getString('activity');
        return await interaction.reply({ content: `@everyone ${activity} or bent` });
    }
}