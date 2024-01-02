import { LoaderPieceContext, Precondition } from "@sapphire/framework";

export abstract class PrismPrecondition extends Precondition {
    constructor(context: LoaderPieceContext<"preconditions">, options: PrismPrecondition.Options) {
        super(context, {
            ...options
        })
    }

    get client() {
        return this.container.client;
    }

    get db() {
        return this.client.db;
    }
}

export namespace PrismPrecondition {
    export type Options = Precondition.Options
}