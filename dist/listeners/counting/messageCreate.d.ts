import { PrismListener } from "#structs/PrismListener";
import type { Message } from "discord.js";
export declare class CountingListener extends PrismListener {
    run(message: Message): Promise<Message<boolean> | import("../../lib/database/DatabaseClient").QueryResponse | undefined>;
}
//# sourceMappingURL=messageCreate.d.ts.map