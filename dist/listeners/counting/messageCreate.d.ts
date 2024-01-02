import { PrismListener } from "#structs/PrismListener";
import type { Message } from "discord.js";
export declare class CountingListener extends PrismListener {
    run(message: Message): Promise<import("../../lib/database/DatabaseClient").QueryResponse | Message<boolean> | undefined>;
}
//# sourceMappingURL=messageCreate.d.ts.map