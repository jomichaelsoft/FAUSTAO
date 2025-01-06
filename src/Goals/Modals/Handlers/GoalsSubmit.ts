// prettier-ignore
import { GuildBasedChannel, Message, MessageCreateOptions, MessageFlags, ModalSubmitInteraction } from "discord.js";
import { TextInputCustomId } from "../Enums/GoalsSubmit";
import { HydratedDocument } from "mongoose";
import { ConfigurationModel, IConfigurationDocument } from "../../../Configuration/Models/Configuration";
import { COMMON_ERROR_MESSAGES } from "../../../Core/Commands/Locale/ErrorMessages";
import { CONFIGURATION_COMMON_ERROR_MESSAGES } from "../../../Configuration/Locale/ErrorMessages";
import { CONFIRMATION_MESSAGES, ERROR_MESSAGES, GOALS_MESSAGE, TAGS } from "../Locale/GoalsSubmit";
import { GoalsModel, IGoalsDocument } from "../../Models/Goals";

/**
 * Formats all the templates to generate the goals message
 *
 * @param objectives What are the persons objectives with art
 * @param inspirations Who is the person inspired by
 * @param interactionUserId Who answered the modal
 * @returns The message
 */
function GetGoalsMessage(objectives: string, inspirations: string, interactionUserId: string): MessageCreateOptions {
	const objectivesQuestion: string = GOALS_MESSAGE.objectivesQuestionTemplate.replace(
		TAGS.interactionUserId,
		interactionUserId
	);

	const objectivesAnswer: string = GOALS_MESSAGE.objectivesAnswerTemplate.replace(TAGS.objectives, objectives);
	const inspirationsQuestion: string = GOALS_MESSAGE.inspirationQuestionTemplate;
	const inspirationsAnswer: string = GOALS_MESSAGE.inspirationAnswerTemplate.replace(TAGS.inspirations, inspirations);

	const dateNow: string = new Date(Date.now()).toLocaleString();
	const lastUpdated: string = GOALS_MESSAGE.lastUpdatedTemplate.replace(TAGS.dateNow, dateNow);
	const lineBreak: string = "\n";
	const lineBreakWhitespace: string = "\n_ _\n";

	return {
		content:
			objectivesQuestion +
			lineBreakWhitespace +
			objectivesAnswer +
			lineBreak +
			inspirationsQuestion +
			lineBreakWhitespace +
			inspirationsAnswer +
			lineBreakWhitespace +
			lastUpdated,
	};
}

/**
 * Sends a cool message in the goals channel
 *
 * @param interaction What summoned the model
 */
export async function Handle(interaction: ModalSubmitInteraction) {
	if (!interaction.inCachedGuild()) {
		interaction.reply({
			content: COMMON_ERROR_MESSAGES.modalNotInGuild,
			flags: MessageFlags.Ephemeral,
		});

		return;
	}

	try {
		await interaction.deferReply({ flags: MessageFlags.Ephemeral });
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

	let previousGoals: HydratedDocument<IGoalsDocument> | null;

	try {
		previousGoals = await GoalsModel.findOne({ guildId: interaction.guildId, userId: interaction.user.id });
	} catch (error) {
		interaction.editReply(COMMON_ERROR_MESSAGES.databaseFail);
		console.error(error);
		return;
	}

	if (previousGoals) {
		let message: Message<true> | null;

		try {
			message = await goalsChannel.messages.fetch(previousGoals.messageId);
		} catch (error) {
			message = null;
			console.error(error);
		}

		if (message) {
			try {
				await message.delete();
			} catch (error) {
				console.error(error);
			}
		}
	}

	const objectives: string = interaction.fields.getTextInputValue(TextInputCustomId.objectives);
	const inspirations: string = interaction.fields.getTextInputValue(TextInputCustomId.inspirations);

	let message: Message<true>;

	try {
		message = await goalsChannel.send(GetGoalsMessage(objectives, inspirations, interaction.user.id));
	} catch (error) {
		interaction.editReply(ERROR_MESSAGES.couldntSendMessage);
		console.error(error);
		return;
	}

	const goalsDocument: HydratedDocument<IGoalsDocument> = previousGoals || new GoalsModel();

	goalsDocument.guildId = interaction.guildId;
	goalsDocument.userId = interaction.user.id;
	goalsDocument.objectives = objectives;
	goalsDocument.inspirations = inspirations;
	goalsDocument.messageId = message.id;

	try {
		await goalsDocument.save();
	} catch (error) {
		interaction.editReply(COMMON_ERROR_MESSAGES.databaseFail);
		console.error(error);
		return;
	}

	try {
		await interaction.editReply(CONFIRMATION_MESSAGES.goalsSubmitWorked);
	} catch (error) {
		console.error(error);
		return;
	}
}
