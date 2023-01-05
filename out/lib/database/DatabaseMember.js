export class DatabaseMember {
    constructor(data) {
        this.guild_id = data.guild_id;
        this.user_id = data.user_id;
        this.member_id = data.member_id;
        this.xp = data.xp;
        this.xp_messages = data.xp_messages;
        this.xp_last_message_at = data.xp_last_message_at;
        this.xp_voice_minutes = data.xp_voice_minutes;
        this.total_messages = data.total_messages;
        this.total_voice_minutes = data.total_voice_minutes;
        this.total_muted_minutes = data.total_muted_minutes;
        this.tracking_voice = Boolean(data.tracking_voice);
        this.counting_counts = data.counting_counts;
        this.counting_last_message_url = data.counting_last_message_url;
    }
}
//# sourceMappingURL=DatabaseMember.js.map