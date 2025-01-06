// prettier-ignore
import { ActionRowBuilder, ChatInputCommandInteraction, MessageFlags, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { COMMON_ERROR_MESSAGES } from "../../../Core/Commands/Locale/ErrorMessages";
import { ERROR_MESSAGES, MODAL } from "../Locale/GoalsSet";

export async function Handle(interaction: ChatInputCommandInteraction) {
	if (!interaction.inCachedGuild()) {
		interaction.reply({
			content: COMMON_ERROR_MESSAGES.commandNotInGuild,
			flags: MessageFlags.Ephemeral,
		});

		return;
	}

	const objectivesRow: ActionRowBuilder<TextInputBuilder> = new ActionRowBuilder<TextInputBuilder>();
	const inspirationsRow: ActionRowBuilder<TextInputBuilder> = new ActionRowBuilder<TextInputBuilder>();

	objectivesRow.addComponents(
		new TextInputBuilder()
			.setCustomId("todo2")
			.setLabel(MODAL.objectivesRowLabel)
			.setStyle(TextInputStyle.Paragraph)
			.setRequired(true)
	);

	inspirationsRow.addComponents(
		new TextInputBuilder()
			.setCustomId("todo1")
			.setLabel(MODAL.inspirationsRowLabel)
			.setStyle(TextInputStyle.Short)
			.setRequired(true)
	);

	const modal: ModalBuilder = new ModalBuilder()
		.setCustomId("TODO")
		.setTitle(MODAL.title)
		.addComponents(objectivesRow, inspirationsRow);

	try {
		await interaction.showModal(modal);
	} catch (error) {
		interaction.editReply(ERROR_MESSAGES.modalFailedToSend);
		console.log(error);
		return;
	}
}
