import { SapphireClient } from "@sapphire/framework";
import type { ClientOptions } from "discord.js";

export class Client extends SapphireClient {
    constructor(options: ClientOptions) {
        super(options)
    }
}