import { Call } from "#lib/calls/Call";
import { Collection } from "discord.js";
export class CallManager extends Collection {
    constructor(client) {
        super();
        this.client = client;
    }
    async init() {
        this.client.logger.info("Fetching active calls...");
        const data = await this.db.fetchCalls();
        for (const raw of data) {
            const call = new Call(raw, this.client);
            try {
                this.set(call.channel.id, call);
            }
            catch {
                this.client.logger.error(`Error while adding call ${raw.call_id}`);
            }
        }
        this.client.logger.info("Calls fetched");
    }
    async create(guild, user, channel) {
        const call = new Call(await this.db.createCall(guild, user, channel), this.client);
        this.set(call.channel.id, call);
        return call;
    }
    get db() {
        return this.client.db;
    }
}
//# sourceMappingURL=CallManager.js.map