import { PrismCommand } from "#structs/PrismCommand";
import { ApplyOptions } from "@sapphire/decorators";
import { isTextBasedChannel } from "@sapphire/discord.js-utilities";
import type { ChatInputCommand } from "@sapphire/framework";
import { Message, PermissionsBitField } from "discord.js";

@ApplyOptions<PrismCommand.Options>({
    name: 'recount',
    description: 'Recount counts.',
})

export class CountCountsCommand extends PrismCommand {

    public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
        registry.registerChatInputCommand((builder) =>
            builder //
                .setName(this.name)
                .setDescription(this.description)
                .setDefaultMemberPermissions(PermissionsBitField.resolve('Administrator'))
        )
    }

    public async chatInputRun(interaction: PrismCommand.ChatInputInteraction) {

        if (!interaction.guild) return;

        const { channel_id_counting } = await this.db.fetchGuild(interaction.guild);

        if (!channel_id_counting) return;

        await interaction.deferReply({ ephemeral: true });

        const channel = await this.client.channels.fetch(channel_id_counting);

        if (!channel || !isTextBasedChannel(channel)) return interaction.editReply({ content: 'Unknown channel' });

        let counts: Message[] = [];
        
        let last = (await channel.messages.fetch({ limit: 1 })).first();

        if (last) counts.unshift(last);

        console.log("Fetching messages");
        // Get Messages
        while (last) {

            let messages = (await channel.messages.fetch({ limit: 100, before: last.id }));

            if (messages.size == 0) break;

            for (const [, message] of messages) {

                counts.unshift(message);

                last = message;
            }

            console.log(`Cached ${messages.size} messages, total: ${counts.length}`);
        }

        console.log("Messages cached. Processing.")

        await interaction.editReply(`Processing...`)

        console.log("Resetting member counts.");
        await this.db.query(`UPDATE members SET counting_counts = 0 WHERE guild_id = ${interaction.guild.id}`);

        console.log("Counting");
        counts.forEach(async (message, i, arr) => {

            console.log(`Message: ${i} of ${arr.length}. '${message.content}' - ${message.author.tag}`);

            if (message.author.bot) return;

            if (message.member)
                await this.db.updateMember(message.member, { counting_counts: 'counting_counts + 1', counting_last_message_url: `'${message.url}'` })
        })

        return;

    }
}