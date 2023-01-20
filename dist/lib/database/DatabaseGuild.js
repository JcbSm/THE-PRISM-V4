export class DatabaseGuild {
    constructor(data) {
        this.guild_id = data.guild_id;
        this.channel_id_counting = data.channel_id_counting;
        this.channel_id_levelup = data.channel_id_levelup;
        this.channel_id_calls = data.channel_id_calls;
        this.counting_count = data.counting_count;
        this.level_roles_stack = Boolean(data.level_roles_stack);
    }
}
(function (DatabaseGuild) {
    let Channels;
    (function (Channels) {
        Channels["COUNTING"] = "counting";
        Channels["LEVEL_UP"] = "levelup";
        Channels["CALLS"] = "calls";
    })(Channels = DatabaseGuild.Channels || (DatabaseGuild.Channels = {}));
})(DatabaseGuild || (DatabaseGuild = {}));
//# sourceMappingURL=DatabaseGuild.js.map