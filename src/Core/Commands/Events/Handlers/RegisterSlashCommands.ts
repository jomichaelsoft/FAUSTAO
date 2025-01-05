import { Client } from "discord.js";
import { EVERY_COMMAND_DATA } from "../../Utility/Core";
import { readdirSync } from "fs";
import { SlashCommandBlueprint } from "../../Types/CommandData";
import { join } from "path";

/**
 * Note: consequentially, every module in each "../Commands/Data"
 * folder must have a `SLASH_COMMAND_DATA` export, which should
 * be of type `ISlashCommandData`
 *
 * @returns Every command in the project's important Discord API info
 */
function GetEverySlashCommandBlueprint(): SlashCommandBlueprint[] {
	const blueprints: SlashCommandBlueprint[] = [];

	for (const dataDirectory of EVERY_COMMAND_DATA) {
		const modules: string[] = readdirSync(dataDirectory);

		for (const module of modules) {
			const modulePath: string = join(dataDirectory, module);
			const { SLASH_COMMAND_DATA } = require(modulePath);

			blueprints.push(SLASH_COMMAND_DATA.blueprint);
		}
	}

	return blueprints;
}

/**
 * Loads every command in the project onto Discord
 *
 * @param readyClient The now loaded client that the bot will use
 */
export async function Handle(readyClient: Client<true>) {
	const blueprints: SlashCommandBlueprint[] = GetEverySlashCommandBlueprint();

	try {
		await readyClient.application.commands.set(blueprints);
		console.log("🛂 Slash commands registered");
	} catch (error) {
		console.error("Can't setup commands", error);
	}
}
