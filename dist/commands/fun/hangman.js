import { __decorate } from "tslib";
import { HangmanGame } from "#lib/games/hangman/HangmanGame";
import { HangmanPhrase } from "#lib/games/hangman/HangmanPhrase";
import { PrismCommand } from "#structs/PrismCommand";
import { ApplyOptions } from "@sapphire/decorators";
import { readFileSync } from "fs";
let HangmanCommand = class HangmanCommand extends PrismCommand {
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) => builder
            .setName(this.name)
            .setDescription(this.description));
        // .addStringOption(option =>
        //     option //
        //         .setName('word')
        //         .setDescription('The word to play hangman with')))
    }
    async chatInputRun(interaction) {
        const words = readFileSync('./src/assets/games/hangman-words.txt').toString().replaceAll("\r", "").split("\n");
        const phrase = new HangmanPhrase(interaction.options.getString('word') ?? words[Math.floor(Math.random() * words.length)]);
        const game = new HangmanGame(phrase);
        await game.start(interaction);
    }
};
HangmanCommand = __decorate([
    ApplyOptions({
        name: 'hangman',
        description: 'Play a game of hangman'
    })
], HangmanCommand);
export { HangmanCommand };
//# sourceMappingURL=hangman.js.map