import { Listener } from "@sapphire/framework";
export declare abstract class PrismListener extends Listener {
    constructor(context: PrismListener.Context, options: PrismListener.Options);
    get client(): import("@sapphire/framework").SapphireClient<boolean>;
    get db(): import("../DatabaseClient").DatabaseClient;
}
export declare namespace PrismListener {
    type Options = Listener.Options;
    type Context = Listener.Context;
}
//# sourceMappingURL=PrismListener.d.ts.map