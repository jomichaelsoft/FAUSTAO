import { config } from "dotenv";
import { Client, GatewayIntentBits } from "discord.js";
import { EVERY_EVENT_DATA, ConnectEventsFromDataDirectory } from "./Core/Events/Utility/Core";
import { connect } from "mongoose";

config();

const client: Client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildVoiceStates,
	],
});

for (const dataDirectory of EVERY_EVENT_DATA) {
	ConnectEventsFromDataDirectory(client, dataDirectory);
}

async function ConnectAndLogin() {
	try {
		console.log("🕙 Connecting to database...");
		await connect(process.env.MONGODB_URI);

		console.log("🕙 Logging in...");
		await client.login(process.env.DISCORD_CLIENT_TOKEN);

		console.log("✅ Loaded!!!");
	} catch (error) {
		console.error(error);
	}
}

ConnectAndLogin();
