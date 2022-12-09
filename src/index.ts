import { LogLevel } from "@sapphire/framework";
import { PrismClient } from '#lib/Client';
(await import ('dotenv')).config();

console.clear();
console.log("Initialising...");

let client = new PrismClient({
    intents: [ // For a list: https://discord.com/developers/docs/topics/gateway#list-of-intents
        'GUILDS',
    ],
    partials: [],
    logger: {
        level: Boolean(process.env.DEV) ? LogLevel.Debug : LogLevel.Info
    }
});

client.logger.info("Attempting connection to MySQL database...");
try {
    await client.db.connect();
    client.logger.info("Connection established.")
} catch (err) {
    client.logger.fatal("Unable to establish connection to MySQL database. Exiting process.");
    process.exit(1);
}

client.logger.info("Logging in...");
try {
    client.login(process.env.TOKEN);
    client.logger.info('Logged in');
} catch (err) {
    client.destroy();
    process.exit(1);
}