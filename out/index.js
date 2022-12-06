import "@sapphire/framework";
import { Client } from '#lib/Client';
(await import('dotenv')).config();
console.clear();
let client = new Client({
    intents: [
        'GUILDS',
    ],
    partials: [],
    logger: {
        level: 30 /* LogLevel.Info */
    }
});
client.logger.info("Logging in...");
try {
    client.login(process.env.TOKEN);
    client.logger.info('Logged in');
}
catch (err) {
    client.destroy();
    process.exit(1);
}
//# sourceMappingURL=index.js.map