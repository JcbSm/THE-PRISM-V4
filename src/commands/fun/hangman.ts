import { HangmanGame } from "#lib/games/hangman/HangmanGame";
import { HangmanPhrase } from "#lib/games/hangman/HangmanPhrase";
import { PrismCommand } from "#structs/PrismCommand";
import { ApplyOptions } from "@sapphire/decorators"
import type { ChatInputCommand } from "@sapphire/framework";
import { readFileSync } from "fs";

@ApplyOptions<PrismCommand.Options>({
    name: 'hangman',
    description: 'Play a game of hangman'
})

export class HangmanCommand extends PrismCommand {

    public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
        registry.registerChatInputCommand(
            (builder) => builder
                .setName(this.name)
                .setDescription(this.description))
                // .addStringOption(option =>
                //     option //
                //         .setName('word')
                //         .setDescription('The word to play hangman with')))
    }

    public async chatInputRun(interaction: PrismCommand.ChatInputInteraction) {

        const words = readFileSync('./src/assets/games/hangman-words.txt').toString().replaceAll("\r", "").split("\n");
        const phrase = new HangmanPhrase(interaction.options.getString('word') ?? words[Math.floor(Math.random() * words.length)]);

        const game = new HangmanGame(phrase);

        await game.start(interaction)

    }

    
}