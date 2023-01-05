import { Events as SapphireEvents } from "@sapphire/framework";

export const Events = {
    ...SapphireEvents,

    /**
     * Emitted when a guild member levels up
     * @param {GuildMember} member The Guildmember that leveled up.
     * @param {number} level The level they advanced to.
     */
    GuildMemberLevelUp: 'guildMemberLevelUp' as const,
    
} as const

declare module 'discord.js' {
    interface ClientEvents {
        [Events.GuildMemberLevelUp]: [member: GuildMember, level: number];
    }
}