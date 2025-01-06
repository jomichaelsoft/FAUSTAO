import { Interaction } from "discord.js";
import { ButtonHandler } from "../../Types/ButtonData";
import { EVERY_BUTTON_DATA } from "../../Utility/Core";
import { readdirSync } from "fs";
import { join } from "path";

let loadedHandlers: Map<string, ButtonHandler> | undefined;

/**
 * Finds and maps every command name of the project to its handler
 *
 * Note: consequentially, every module in each "../Buttons/Data"
 * folder must have a `BUTTON_DATA` export, which should
 * be of type `IButtonData`
 *
 * @returns a map of { [commandName]: handler }
 */
function GetEveryButtonHandler(): Map<string, ButtonHandler> {
	const handlers: Map<string, ButtonHandler> = new Map();

	for (const dataDirectory of EVERY_BUTTON_DATA) {
		const modules: string[] = readdirSync(dataDirectory);

		for (const module of modules) {
			const modulePath: string = join(dataDirectory, module);
			const { BUTTON_DATA } = require(modulePath);

			handlers.set(BUTTON_DATA.customId, BUTTON_DATA.handler);
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
	if (!interaction.isButton()) {
		return;
	}

	// Cache the handler map so we don't have to scan the entire project again
	if (!loadedHandlers) {
		loadedHandlers = GetEveryButtonHandler();
	}

	const handler: ButtonHandler | undefined = loadedHandlers.get(interaction.customId);

	if (handler) {
		handler(interaction);
	} else {
		throw new Error(`Button has no handler: ${interaction.customId}`);
	}
}
