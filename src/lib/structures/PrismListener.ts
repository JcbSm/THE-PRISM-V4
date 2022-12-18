import { Listener } from "@sapphire/framework";

export abstract class PrismListener extends Listener {
    public constructor(context: PrismListener.Context, options: PrismListener.Options) {
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

export namespace PrismListener {
    export type Options = Listener.Options;
    export type Context = Listener.Context;
}