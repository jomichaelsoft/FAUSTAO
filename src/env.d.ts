// dotenv doesn't really work well with typescript so we have to do this
// to get our variables working

declare namespace NodeJS {
	interface ProcessEnv {
		DISCORD_CLIENT_TOKEN: string;
		MONGODB_URI: string;
	}
}
