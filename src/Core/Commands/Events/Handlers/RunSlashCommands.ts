import { Interaction } from "discord.js";
import { SlashCommandHandler } from "../../Types/CommandData";
import { EVERY_COMMAND_DATA } from "../../Utility/Core";
import { readdirSync } from "fs";
import { join } from "path";

let loadedHandlers: Map<string, SlashCommandHandler> | undefined;

/**
 * Finds and maps every command name of the project to its handler
 *
 * @returns a map of { [commandName]: handler }
 */
function GetEverySlashCommandHandler(): Map<string, SlashCommandHandler> {
	const handlers: Map<string, SlashCommandHandler> = new Map();

	for (const dataDirectory of EVERY_COMMAND_DATA) {
		const modules: string[] = readdirSync(dataDirectory);

		for (const module of modules) {
			const modulePath: string = join(dataDirectory, module);
			const { SLASH_COMMAND_DATA } = require(modulePath);

			handlers.set(SLASH_COMMAND_DATA.blueprint.name, SLASH_COMMAND_DATA.handler);
		}
	}

	return handlers;
}

/**
 * Finds and runs the `interaction's` slash command
 *
 * @param interaction What was used to call the command
 * @throws if the command the `interaction` wants to call doesn't have a handler
 */
export function Handle(interaction: Interaction) {
	if (!interaction.isChatInputCommand()) {
		return;
	}

	// Cache the handler map so we don't have to scan the entire project again
	if (!loadedHandlers) {
		loadedHandlers = GetEverySlashCommandHandler();
	}

	const handler: SlashCommandHandler | undefined = loadedHandlers.get(interaction.commandName);

	if (handler) {
		handler(interaction);
	} else {
		throw new Error(`Slash command has no handler: ${interaction.commandName}`);
	}
}
