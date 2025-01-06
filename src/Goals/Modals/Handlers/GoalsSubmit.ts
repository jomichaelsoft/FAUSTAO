// prettier-ignore
import { GuildBasedChannel, MessageCreateOptions, MessageFlags, ModalSubmitInteraction } from "discord.js";
import { TextInputCustomId } from "../Enums/GoalsSubmit";
import { HydratedDocument } from "mongoose";
import { ConfigurationModel, IConfigurationDocument } from "../../../Configuration/Models/Configuration";
import { COMMON_ERROR_MESSAGES } from "../../../Core/Commands/Locale/ErrorMessages";
import { CONFIGURATION_COMMON_ERROR_MESSAGES } from "../../../Configuration/Locale/ErrorMessages";
import { ERROR_MESSAGES } from "../Locale/GoalsSubmit";

export async function Handle(interaction: ModalSubmitInteraction) {
	if (!interaction.inCachedGuild()) {
		interaction.reply({
			content: COMMON_ERROR_MESSAGES.modalNotInGuild,
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

	let configuration: HydratedDocument<IConfigurationDocument> | null;

	try {
		configuration = await ConfigurationModel.findOne({ guildId: interaction.guildId });

		if (!configuration) {
			interaction.editReply(CONFIGURATION_COMMON_ERROR_MESSAGES.noConfigurationInGuild);
			return;
		}
	} catch (error) {
		interaction.editReply(COMMON_ERROR_MESSAGES.databaseFail);
		console.error(error);
		return;
	}

	const goalsChannel: GuildBasedChannel | undefined = interaction.guild.channels.cache.get(configuration.goalsChannelId);

	if (!goalsChannel) {
		interaction.editReply(ERROR_MESSAGES.cantFindGoalsChannel);
		return;
	}

	if (!goalsChannel.isSendable()) {
		interaction.editReply(ERROR_MESSAGES.goalsChannelUnsendable);
		return;
	}

	const objectives: string = interaction.fields.getTextInputValue(TextInputCustomId.objectives);
	const inspirations: string = interaction.fields.getTextInputValue(TextInputCustomId.inspirations);
}
