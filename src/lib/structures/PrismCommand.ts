import { Command } from "@sapphire/framework";

export abstract class PrismCommand extends Command {
    public constructor(context: PrismCommand.Context, options: PrismCommand.Options) {
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
};

export namespace PrismCommand {
    export type Options = Command.Options;
    export type Context = Command.Context;
    export type ChatInputCommand = Command.ChatInputInteraction;
    export type ChatInputInteraction = Command.ChatInputInteraction;
}