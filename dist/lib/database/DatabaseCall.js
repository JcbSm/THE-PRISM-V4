export class DatabaseCall {
    constructor(data, client) {
        this.client = client;
        this.call_id = data.call_id;
        this.guild_id = data.guild_id;
        this.user_id = data.user_id;
        this.channel_id = data.channel_id;
        this.persistent = Boolean(data.persistent);
        this.deleted = false;
    }
    async fetchChannel() {
        return this.deleted ? null : await this.client.channels.fetch(this.channel_id);
    }
    async fetchUser() {
        return this.deleted ? null : await this.client.users.fetch(this.user_id);
    }
    async end() {
        (await this.fetchChannel())?.delete();
        this.client.db.deleteCall(this.call_id);
        return this.deleted = true;
    }
}
//# sourceMappingURL=DatabaseCall.js.map