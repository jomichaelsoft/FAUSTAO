import { Interaction } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";
import { EVERY_MODAL_DATA } from "../../Utility/Core";
import { ModalHandler } from "../../Types/ModalData";

let loadedHandlers: Map<string, ModalHandler> | undefined;

/**
 * Finds and maps every button's customId to its handler
 *
 * Note: consequentially, every module in each "../Modals/Data"
 * folder must have a `MODAL_DATA` export, which should
 * be of type `IModalData`
 *
 * @returns a map of { [customId]: handler }
 */
function GetEveryModalHandler(): Map<string, ModalHandler> {
	const handlers: Map<string, ModalHandler> = new Map();

	for (const dataDirectory of EVERY_MODAL_DATA) {
		const modules: string[] = readdirSync(dataDirectory);

		for (const module of modules) {
			const modulePath: string = join(dataDirectory, module);
			const { MODAL_DATA } = require(modulePath);

			handlers.set(MODAL_DATA.customId, MODAL_DATA.handler);
		}
	}

	return handlers;
}

/**
 * Finds and runs the `interaction's` modal handler
 *
 * @param interaction What was used to submit the modal
 * @throws if the modal the `interaction` wants to handle doesn't have a handler
 */
export function Handle(interaction: Interaction) {
	if (!interaction.isModalSubmit()) {
		return;
	}

	// Cache the handler map so we don't have to scan the entire project again
	if (!loadedHandlers) {
		loadedHandlers = GetEveryModalHandler();
	}

	const handler: ModalHandler | undefined = loadedHandlers.get(interaction.customId);

	if (handler) {
		handler(interaction);
	} else {
		throw new Error(`Modal has no handler: ${interaction.customId}`);
	}
}
