import { LogLevel } from "@sapphire/framework";
import { Client } from '#lib/Client';
(await import ('dotenv')).config();

console.clear();

let client: Client = new Client({
    intents: [ // For a list: https://discord.com/developers/docs/topics/gateway#list-of-intents
        'GUILDS',
    ],
    partials: [],
    logger: {
        level: LogLevel.Info
    }
});

client.logger.info("Logging in...");
try {
    client.login(process.env.TOKEN);
    client.logger.info('Logged in');
} catch (err) {
    client.destroy();
    process.exit(1);
}