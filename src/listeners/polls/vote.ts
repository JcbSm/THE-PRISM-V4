import { alphabet } from "#helpers/emojis";
import { PrismListener } from "#structs/PrismListener";
import { ApplyOptions } from "@sapphire/decorators";
import { Events } from "@sapphire/framework";
import { ActionRowBuilder, APIMessageComponentEmoji, ComponentType, Interaction, StringSelectMenuBuilder, StringSelectMenuInteraction, StringSelectMenuOptionBuilder } from "discord.js";

@ApplyOptions<PrismListener.Options>({
    event: Events.InteractionCreate
})

export class PollVoteListener extends PrismListener {
    public override async run(interaction: Interaction) {

        if (!interaction.isButton() || interaction.customId !== 'pollVote' ) return;

        const { poll_id, max_choices } = await this.db.fetchPoll(interaction.message);

        const rawOptions = (interaction.message.embeds[0].description?.split("\n") || [])
        const options = rawOptions.map(s => s.slice(5));

        await interaction.reply({ ephemeral: true,
            content: 'Choose your option',
            components: this.getComponents(options, max_choices)
        })

        const message = await interaction.fetchReply();

        await message.awaitMessageComponent({ componentType: ComponentType.StringSelect, filter: (i: StringSelectMenuInteraction) => interaction.user.id === i.user.id, time: 30 * 1000})
            .then(async (interaction: StringSelectMenuInteraction) => {

                await interaction.deferUpdate();

                const arr = new Array(options.length).fill(0);
                const picked: string[] = [];

                interaction.values.forEach((v) => {
                    const n = Number(v.replace('pollVote', ''));
                    picked.push(rawOptions[n]);
                    arr[n] += 1;
                })

                arr.reverse()
                const vote = parseInt(arr.join(""), 2);

                await this.db.vote(poll_id, interaction.user.id, vote)

                interaction.editReply({ content: `Your vote:\n${picked.join("\n")}`, components: [] });
            })
            .catch(() => interaction.editReply({ content: 'You took too long ;(', components: [] }));

    }

    private getComponents(options: string[], max: number) {

        return [
            new ActionRowBuilder<StringSelectMenuBuilder>()
                .setComponents([
                    new StringSelectMenuBuilder()
                        .setCustomId('pollVoteSelect')
                        .setMinValues(1)
                        .setMaxValues(max > options.length ? options.length : max)
                        .setOptions(options.map((o, i) => {
                            return new StringSelectMenuOptionBuilder()
                                .setEmoji(alphabet[i] as APIMessageComponentEmoji)
                                .setLabel(o)
                                .setValue('pollVote' + i)
                        }))
                ])
        ]
    }
}