import { Subcommand } from "@sapphire/plugin-subcommands";

export abstract class PrismSubcommand extends Subcommand {
    constructor(context: PrismSubcommand.Context, options: PrismSubcommand.Options) {
        super(context, {
            ...options
        });
    }

    get client() {
        return this.container.client;
    }

    get db() {
        return this.client.db;
    }

}

export namespace PrismSubcommand {
    export type Options = Subcommand.Options & {
        
    }
    export type Context = Subcommand.Context & {

    }
    export type ChatInputInteraction = Subcommand.ChatInputInteraction & {

    }
}