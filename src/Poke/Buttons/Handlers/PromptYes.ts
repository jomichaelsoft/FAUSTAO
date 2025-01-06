import { ButtonInteraction, MessageFlags } from "discord.js";
import { HydratedDocument } from "mongoose";
import { IPokeDocument, PokeModel } from "../../Models/Poke";
import { CONFIRMATION_MESSAGES, TAGS } from "../Locale/PromptYes";
import { PickRandomArrayItem } from "../../../Core/Utility/Random";
import { POKE_COMMON_ERROR_MESSAGES } from "../../Locale/ErrorMessages";
import { COMMON_ERROR_MESSAGES } from "../../../Core/Commands/Locale/ErrorMessages";

/**
 * Will ping the poke's host warning them that a person wants to join.
 * If the person who presses the button is the host, then the session is confirmed
 * and the prompt message is deleted
 *
 * @param interaction What triggered the button click
 */
export async function Handle(interaction: ButtonInteraction) {
	if (!interaction.inCachedGuild()) {
		interaction.reply({
			content: COMMON_ERROR_MESSAGES.buttonNotInGuild,
			flags: MessageFlags.Ephemeral,
		});

		return;
	}

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

	if (poke.hostUserId === interaction.user.id) {
		try {
			await interaction.editReply(CONFIRMATION_MESSAGES.host);
			interaction.message.delete();
		} catch (error) {
			console.error(error);
		}

		return;
	}

	try {
		const message: string = PickRandomArrayItem(CONFIRMATION_MESSAGES.participants);
		const formattedMessage: string = message
			.replace(TAGS.hostUserId, poke.hostUserId)
			.replace(TAGS.participantName, interaction.user.displayName);

		await interaction.editReply(formattedMessage);
	} catch (error) {
		console.error(error);
		return;
	}
}
