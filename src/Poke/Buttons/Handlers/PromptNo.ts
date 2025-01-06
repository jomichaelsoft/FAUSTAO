import { ButtonInteraction } from "discord.js";
import { PickRandomArrayItem } from "../../../Core/Utility/Random";
import { UNAVAILABLE_MESSAGES } from "../Locale/PromptNo";
import { TAGS } from "../Locale/PromptYes";
import { HydratedDocument } from "mongoose";
import { IPokeDocument, PokeModel } from "../../Models/Poke";
import { POKE_COMMON_ERROR_MESSAGES } from "../../Locale/ErrorMessages";
import { COMMON_ERROR_MESSAGES } from "../../../Core/Commands/Locale/ErrorMessages";

/**
 * Will just send a message saying the person can't make it
 *
 * @param interaction What triggered the button click
 */
export async function Handle(interaction: ButtonInteraction) {
	try {
		await interaction.deferReply();
	} catch (error) {
		console.error(error);
		return;
	}

	let poke: HydratedDocument<IPokeDocument> | null;

	try {
		poke = await PokeModel.findOne({ guildId: interaction.guildId });

		if (!poke) {
			interaction.editReply(POKE_COMMON_ERROR_MESSAGES.noPokeInGuild);
			return;
		}
	} catch (error) {
		interaction.editReply(COMMON_ERROR_MESSAGES.databaseFail);
		console.error(error);
		return;
	}

	if (poke.hostId === interaction.user.id) {
		try {
			await interaction.editReply(UNAVAILABLE_MESSAGES.host);
			interaction.message.delete();
		} catch (error) {
			console.error(error);
		}

		return;
	}

	try {
		const message: string = PickRandomArrayItem(UNAVAILABLE_MESSAGES.participants);
		const formattedMessage: string = message.replace(TAGS.participantName, interaction.user.displayName);

		interaction.editReply(formattedMessage);
	} catch (error) {
		console.error(error);
	}
}
