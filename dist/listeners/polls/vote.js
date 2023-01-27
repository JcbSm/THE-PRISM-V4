import { __decorate } from "tslib";
import { alphabet } from "#helpers/emojis";
import { PrismListener } from "#structs/PrismListener";
import { ApplyOptions } from "@sapphire/decorators";
import { Events } from "@sapphire/framework";
import { ActionRowBuilder, ComponentType, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
let PollVoteListener = class PollVoteListener extends PrismListener {
    async run(interaction) {
        if (!interaction.isButton() || interaction.customId !== 'pollVote')
            return;
        const { poll_id, max_choices } = await this.db.fetchPoll(interaction.message);
        const rawOptions = (interaction.message.embeds[0].description?.split("\n") || []);
        const options = rawOptions.map(s => s.slice(5));
        await interaction.reply({ ephemeral: true,
            content: 'Choose your option',
            components: this.getComponents(options, max_choices)
        });
        const message = await interaction.fetchReply();
        await message.awaitMessageComponent({ componentType: ComponentType.StringSelect, filter: (i) => interaction.user.id === i.user.id, time: 30 * 1000 })
            .then(async (interaction) => {
            const arr = new Array(options.length).fill(0);
            const picked = [];
            interaction.values.forEach((v) => {
                const n = Number(v.replace('pollVote', ''));
                picked.push(rawOptions[n]);
                arr[n] += 1;
            });
            arr.reverse();
            const vote = parseInt(arr.join(""), 2);
            await this.db.vote(poll_id, interaction.user.id, vote);
            interaction.update({ content: `Your vote:\n${picked.join("\n")}`, components: [] });
        })
            .catch(() => interaction.deleteReply());
    }
    getComponents(options, max) {
        return [
            new ActionRowBuilder()
                .setComponents([
                new StringSelectMenuBuilder()
                    .setCustomId('pollVoteSelect')
                    .setMinValues(1)
                    .setMaxValues(max)
                    .setOptions(options.map((o, i) => {
                    return new StringSelectMenuOptionBuilder()
                        .setEmoji(alphabet[i])
                        .setLabel(o)
                        .setValue('pollVote' + i);
                }))
            ])
        ];
    }
};
PollVoteListener = __decorate([
    ApplyOptions({
        event: Events.InteractionCreate
    })
], PollVoteListener);
export { PollVoteListener };
//# sourceMappingURL=vote.js.map