export declare const Events: {
    /**
     * Emitted when a guild member levels up
     * @param {GuildMember} member The Guildmember that leveled up.
     * @param {number} level The level they advanced to.
     */
    readonly GuildMemberLevelUp: "guildMemberLevelUp";
    readonly ChannelCreate: "channelCreate";
    readonly ChannelDelete: "channelDelete";
    readonly ChannelPinsUpdate: "channelPinsUpdate";
    readonly ChannelUpdate: "channelUpdate";
    readonly ClientReady: "ready";
    readonly Debug: "debug";
    readonly Error: "error";
    readonly GuildBanAdd: "guildBanAdd";
    readonly GuildBanRemove: "guildBanRemove";
    readonly GuildCreate: "guildCreate";
    readonly GuildDelete: "guildDelete";
    readonly GuildEmojiCreate: "emojiCreate";
    readonly GuildEmojiDelete: "emojiDelete";
    readonly GuildEmojiUpdate: "emojiUpdate";
    readonly GuildIntegrationsUpdate: "guildIntegrationsUpdate";
    readonly GuildMemberAdd: "guildMemberAdd";
    readonly GuildMemberAvailable: "guildMemberAvailable";
    readonly GuildMemberRemove: "guildMemberRemove";
    readonly GuildMembersChunk: "guildMembersChunk";
    readonly GuildMemberUpdate: "guildMemberUpdate";
    readonly GuildRoleCreate: "roleCreate";
    readonly GuildRoleDelete: "roleDelete";
    readonly GuildRoleUpdate: "roleUpdate";
    readonly GuildStickerCreate: "stickerCreate";
    readonly GuildStickerDelete: "stickerDelete";
    readonly GuildStickerUpdate: "stickerUpdate";
    readonly GuildUnavailable: "guildUnavailable";
    readonly GuildUpdate: "guildUpdate";
    readonly InteractionCreate: "interactionCreate";
    readonly Invalidated: "invalidated";
    readonly InvalidRequestWarning: "invalidRequestWarning";
    readonly InviteCreate: "inviteCreate";
    readonly InviteDelete: "inviteDelete";
    readonly MessageBulkDelete: "messageDeleteBulk";
    readonly MessageCreate: "messageCreate";
    readonly MessageDelete: "messageDelete";
    readonly MessageReactionAdd: "messageReactionAdd";
    readonly MessageReactionRemove: "messageReactionRemove";
    readonly MessageReactionRemoveAll: "messageReactionRemoveAll";
    readonly MessageReactionRemoveEmoji: "messageReactionRemoveEmoji";
    readonly MessageUpdate: "messageUpdate";
    readonly PresenceUpdate: "presenceUpdate";
    readonly RateLimit: "rateLimit";
    readonly Raw: "raw";
    readonly ShardDisconnect: "shardDisconnect";
    readonly ShardError: "shardError";
    readonly ShardReady: "shardReady";
    readonly ShardReconnecting: "shardReconnecting";
    readonly ShardResume: "shardResume";
    readonly StageInstanceCreate: "stageInstanceCreate";
    readonly StageInstanceDelete: "stageInstanceDelete";
    readonly StageInstanceUpdate: "stageInstanceUpdate";
    readonly ThreadCreate: "threadCreate";
    readonly ThreadDelete: "threadDelete";
    readonly ThreadListSync: "threadListSync";
    readonly ThreadMembersUpdate: "threadMembersUpdate";
    readonly ThreadMemberUpdate: "threadMemberUpdate";
    readonly ThreadUpdate: "threadUpdate";
    readonly TypingStart: "typingStart";
    readonly UserUpdate: "userUpdate";
    readonly VoiceServerUpdate: "voiceServerUpdate";
    readonly VoiceStateUpdate: "voiceStateUpdate";
    readonly Warn: "warn";
    readonly WebhooksUpdate: "webhookUpdate";
    readonly PreMessageParsed: "preMessageParsed";
    readonly MentionPrefixOnly: "mentionPrefixOnly";
    readonly NonPrefixedMessage: "nonPrefixedMessage";
    readonly PrefixedMessage: "prefixedMessage";
    readonly UnknownMessageCommandName: "unknownMessageCommandName";
    readonly UnknownMessageCommand: "unknownMessageCommand";
    readonly CommandDoesNotHaveMessageCommandHandler: "commandDoesNotHaveMessageCommandHandler";
    readonly PreMessageCommandRun: "preMessageCommandRun";
    readonly MessageCommandDenied: "messageCommandDenied";
    readonly MessageCommandAccepted: "messageCommandAccepted";
    readonly MessageCommandRun: "messageCommandRun";
    readonly MessageCommandSuccess: "messageCommandSuccess";
    readonly MessageCommandError: "messageCommandError";
    readonly MessageCommandFinish: "messageCommandFinish";
    readonly MessageCommandTypingError: "messageCommandTypingError";
    readonly ListenerError: "listenerError";
    readonly CommandApplicationCommandRegistryError: "commandApplicationCommandRegistryError";
    readonly PiecePostLoad: "piecePostLoad";
    readonly PieceUnload: "pieceUnload";
    readonly PluginLoaded: "pluginLoaded";
    readonly InteractionHandlerParseError: "interactionHandlerParseError";
    readonly InteractionHandlerError: "interactionHandlerError";
    readonly PossibleAutocompleteInteraction: "possibleAutocompleteInteraction";
    readonly CommandAutocompleteInteractionSuccess: "commandAutocompleteInteractionSuccess";
    readonly CommandAutocompleteInteractionError: "commandAutocompleteInteractionError";
    readonly PossibleChatInputCommand: "possibleChatInputCommand";
    readonly UnknownChatInputCommand: "unknownChatInputCommand";
    readonly CommandDoesNotHaveChatInputCommandHandler: "commandDoesNotHaveChatInputCommandHandler";
    readonly PreChatInputCommandRun: "preChatInputCommandRun";
    readonly ChatInputCommandDenied: "chatInputCommandDenied";
    readonly ChatInputCommandAccepted: "chatInputCommandAccepted";
    readonly ChatInputCommandRun: "chatInputCommandRun";
    readonly ChatInputCommandSuccess: "chatInputCommandSuccess";
    readonly ChatInputCommandError: "chatInputCommandError";
    readonly ChatInputCommandFinish: "chatInputCommandFinish";
    readonly PossibleContextMenuCommand: "possibleContextMenuCommand";
    readonly UnknownContextMenuCommand: "unknownContextMenuCommand";
    readonly CommandDoesNotHaveContextMenuCommandHandler: "commandDoesNotHaveContextMenuCommandHandler";
    readonly PreContextMenuCommandRun: "preContextMenuCommandRun";
    readonly ContextMenuCommandDenied: "contextMenuCommandDenied";
    readonly ContextMenuCommandAccepted: "contextMenuCommandAccepted";
    readonly ContextMenuCommandRun: "contextMenuCommandRun";
    readonly ContextMenuCommandSuccess: "contextMenuCommandSuccess";
    readonly ContextMenuCommandError: "contextMenuCommandError";
    readonly ContextMenuCommandFinish: "contextMenuCommandFinish";
};
declare module 'discord.js' {
    interface ClientEvents {
        [Events.GuildMemberLevelUp]: [member: GuildMember, level: number];
    }
}
//# sourceMappingURL=events.d.ts.map