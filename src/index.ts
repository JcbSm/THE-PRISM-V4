import { LogLevel } from "@sapphire/framework";
import { PrismClient } from '#lib/PrismClient';
(await import ('dotenv')).config();

console.clear();
console.log("Initialising...");

let client = new PrismClient({
    intents: [ // For a list: https://discord.com/developers/docs/topics/gateway#list-of-intents
        'GUILDS',
        'GUILD_MESSAGES',
        'GUILD_PRESENCES',
        'GUILD_VOICE_STATES'
    ],
    partials: [],
    logger: {
        level: process.env.DEV == 'true' ? LogLevel.Debug : LogLevel.Info
    },
    defaultPrefix: ['-'],
    allowedMentions: { parse: ['everyone']}
});

client.dev ? () => {
    client.logger.info("Starting in dev mode...")
} : () => {

};

client.logger.info("Logging in...");
try {
    client.login(process.env.TOKEN);
    client.logger.info('Logged in');
} catch (err) {
    client.destroy();
    process.exit(1);
}