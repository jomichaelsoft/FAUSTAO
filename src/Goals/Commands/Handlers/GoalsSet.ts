// prettier-ignore
import { ActionRowBuilder, ChatInputCommandInteraction, MessageFlags, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { COMMON_ERROR_MESSAGES } from "../../../Core/Commands/Locale/ErrorMessages";
import { ERROR_MESSAGES, MODAL } from "../Locale/GoalsSet";
import { MODAL_DATA } from "../../Modals/Data/GoalsSubmit";

/**
 * Sends a form to the end user asking them what their art goals are
 *
 * @param interaction The command's origin
 */
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
			.setCustomId(MODAL_DATA.inputCustomIds.objectives)
			.setLabel(MODAL.objectivesInputLabel)
			.setStyle(TextInputStyle.Paragraph)
			.setRequired(true)
	);

	inspirationsRow.addComponents(
		new TextInputBuilder()
			.setCustomId(MODAL_DATA.inputCustomIds.inspirations)
			.setLabel(MODAL.inspirationsInputLabel)
			.setStyle(TextInputStyle.Short)
			.setRequired(true)
	);

	const modal: ModalBuilder = new ModalBuilder()
		.setCustomId(MODAL_DATA.customId)
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
