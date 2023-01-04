import { LogLevel } from "@sapphire/framework";
import { PrismClient } from '#lib/PrismClient';
(await import ('dotenv')).config();

console.clear();
console.log("Initialising...");

let client = new PrismClient({
    intents: [ // For a list: https://discord.com/developers/docs/topics/gateway#list-of-intents
        'GUILDS',
        'GUILD_MESSAGES',
        'GUILD_PRESENCES'
    ],
    partials: [],
    logger: {
        level: LogLevel.Info //Boolean(process.env.DEV) ? LogLevel.Debug : LogLevel.Info
    },
    defaultPrefix: ['-'],
    allowedMentions: { parse: ['everyone']}
});

client.dev ? client.logger.info("Starting in dev mode...") : () => {};

// client.logger.info("Attempting connection to MySQL database...");

// try {

//     await client.db.connect();
//     client.logger.info("Connection established.");
    
// } catch (err) {

//     console.log(err)
//     client.logger.fatal("Unable to establish connection to MySQL database. Exiting process.");
//     process.exit(1);
// }

console.log(await client.db.query(`SELECT * FROM members LIMIT 1`))
console.log(await client.db.query(`SELECT * FROM guilds LIMIT 1`))

client.logger.info("Logging in...");
try {
    client.login(process.env.TOKEN);
    client.logger.info('Logged in');
} catch (err) {
    client.destroy();
    process.exit(1);
}