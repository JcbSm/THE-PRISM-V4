import { LoaderPieceContext, Precondition } from "@sapphire/framework";
export declare abstract class PrismPrecondition extends Precondition {
    constructor(context: LoaderPieceContext<"preconditions">, options: PrismPrecondition.Options);
    get client(): import("@sapphire/framework").SapphireClient<boolean>;
    get db(): import("../database/DatabaseClient").DatabaseClient;
}
export declare namespace PrismPrecondition {
    type Options = Precondition.Options;
}
//# sourceMappingURL=PrismPrecondition.d.ts.map