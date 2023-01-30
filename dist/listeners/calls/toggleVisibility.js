import { __decorate } from "tslib";
import { PrismListener } from "#structs/PrismListener";
import { ApplyOptions } from "@sapphire/decorators";
import { ChannelType } from "discord.js";
let CallEndListener = class CallEndListener extends PrismListener {
    async run(interaction) {
        if (!(interaction.isButton() && interaction.customId == 'callToggleVisibility' && interaction.channel && interaction.guild && interaction.channel.type == ChannelType.GuildVoice))
            return;
        const call = this.client.calls.get(interaction.channel.id) || await this.client.calls.recreate(interaction, interaction.guild, interaction.channel);
        if (call.userId !== interaction.user.id) {
            interaction.reply({ ephemeral: true, content: 'You cannot modify someone else\'s call' });
            return;
        }
        const visibility = await call.toggleVisibility();
        await interaction.update({ embeds: [await call.getOptionsEmbed()] });
        await interaction.followUp({ ephemeral: true, content: `\`VIEW CHANNEL\` perms for \`@everyone\` set to \`${visibility}\`` });
    }
};
CallEndListener = __decorate([
    ApplyOptions({
        event: 'interactionCreate'
    })
], CallEndListener);
export { CallEndListener };
//# sourceMappingURL=toggleVisibility.js.map