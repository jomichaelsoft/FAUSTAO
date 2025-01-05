"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const discord_js_1 = require("discord.js");
const Core_1 = require("./Core/Events/Utility/Core");
const mongoose_1 = require("mongoose");
(0, dotenv_1.config)();
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMembers,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent,
        discord_js_1.GatewayIntentBits.GuildVoiceStates,
    ],
});
for (const dataDirectory of Core_1.EVERY_EVENT_DATA) {
    (0, Core_1.ConnectEventsFromDataDirectory)(client, dataDirectory);
}
async function ConnectAndLogin() {
    try {
        console.log("🕙 Connecting to database...");
        await (0, mongoose_1.connect)(process.env.MONGODB_URI);
        console.log("🕙 Logging in...");
        await client.login(process.env.DISCORD_CLIENT_TOKEN);
        console.log("✅ Loaded!!!");
    }
    catch (error) {
        console.error(error);
    }
}
ConnectAndLogin();
