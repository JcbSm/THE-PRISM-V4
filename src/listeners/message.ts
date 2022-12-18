import { PrismListener } from "#structs/PrismListener";
import { ApplyOptions } from "@sapphire/decorators";
import type { Message } from "discord.js";

@ApplyOptions<PrismListener.Options>({
    event: 'messageCreate'
})

export default class extends PrismListener {
    public async run(message: Message) {

        if (message.partial)
            await message.fetch();

        

    }
}