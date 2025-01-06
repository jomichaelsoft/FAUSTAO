"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Handle = Handle;
// prettier-ignore
const discord_js_1 = require("discord.js");
const GoalsSubmit_1 = require("../Enums/GoalsSubmit");
const Configuration_1 = require("../../../Configuration/Models/Configuration");
const ErrorMessages_1 = require("../../../Core/Commands/Locale/ErrorMessages");
const ErrorMessages_2 = require("../../../Configuration/Locale/ErrorMessages");
const GoalsSubmit_2 = require("../Locale/GoalsSubmit");
const Goals_1 = require("../../Models/Goals");
/**
 * Formats all the templates to generate the goals message
 *
 * @param objectives What are the persons objectives with art
 * @param inspirations Who is the person inspired by
 * @param interactionUserId Who answered the modal
 * @returns The message
 */
function GetGoalsMessage(objectives, inspirations, interactionUserId) {
    const objectivesQuestion = GoalsSubmit_2.GOALS_MESSAGE.objectivesQuestionTemplate.replace(GoalsSubmit_2.TAGS.interactionUserId, interactionUserId);
    const objectivesAnswer = GoalsSubmit_2.GOALS_MESSAGE.objectivesAnswerTemplate.replace(GoalsSubmit_2.TAGS.objectives, objectives);
    const inspirationsQuestion = GoalsSubmit_2.GOALS_MESSAGE.inspirationQuestionTemplate;
    const inspirationsAnswer = GoalsSubmit_2.GOALS_MESSAGE.inspirationAnswerTemplate.replace(GoalsSubmit_2.TAGS.inspirations, inspirations);
    const dateNow = new Date(Date.now()).toLocaleString();
    const lastUpdated = GoalsSubmit_2.GOALS_MESSAGE.lastUpdatedTemplate.replace(GoalsSubmit_2.TAGS.dateNow, dateNow);
    const lineBreak = "\n";
    const lineBreakWhitespace = "\n_ _\n";
    return {
        content: objectivesQuestion +
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
async function Handle(interaction) {
    if (!interaction.inCachedGuild()) {
        interaction.reply({
            content: ErrorMessages_1.COMMON_ERROR_MESSAGES.modalNotInGuild,
            flags: discord_js_1.MessageFlags.Ephemeral,
        });
        return;
    }
    try {
        await interaction.deferReply({ flags: discord_js_1.MessageFlags.Ephemeral });
    }
    catch (error) {
        console.error(error);
        return;
    }
    let configuration;
    try {
        configuration = await Configuration_1.ConfigurationModel.findOne({ guildId: interaction.guildId });
        if (!configuration) {
            interaction.editReply(ErrorMessages_2.CONFIGURATION_COMMON_ERROR_MESSAGES.noConfigurationInGuild);
            return;
        }
    }
    catch (error) {
        interaction.editReply(ErrorMessages_1.COMMON_ERROR_MESSAGES.databaseFail);
        console.error(error);
        return;
    }
    const goalsChannel = interaction.guild.channels.cache.get(configuration.goalsChannelId);
    if (!goalsChannel) {
        interaction.editReply(GoalsSubmit_2.ERROR_MESSAGES.cantFindGoalsChannel);
        return;
    }
    if (!goalsChannel.isSendable()) {
        interaction.editReply(GoalsSubmit_2.ERROR_MESSAGES.goalsChannelUnsendable);
        return;
    }
    let previousGoals;
    try {
        previousGoals = await Goals_1.GoalsModel.findOne({ guildId: interaction.guildId, userId: interaction.user.id });
    }
    catch (error) {
        interaction.editReply(ErrorMessages_1.COMMON_ERROR_MESSAGES.databaseFail);
        console.error(error);
        return;
    }
    if (previousGoals) {
        let message;
        try {
            message = await goalsChannel.messages.fetch(previousGoals.messageId);
        }
        catch (error) {
            message = null;
            console.error(error);
        }
        if (message) {
            try {
                await message.delete();
            }
            catch (error) {
                console.error(error);
            }
        }
    }
    const objectives = interaction.fields.getTextInputValue(GoalsSubmit_1.TextInputCustomId.objectives);
    const inspirations = interaction.fields.getTextInputValue(GoalsSubmit_1.TextInputCustomId.inspirations);
    let message;
    try {
        message = await goalsChannel.send(GetGoalsMessage(objectives, inspirations, interaction.user.id));
    }
    catch (error) {
        interaction.editReply(GoalsSubmit_2.ERROR_MESSAGES.couldntSendMessage);
        console.error(error);
        return;
    }
    const goalsDocument = previousGoals || new Goals_1.GoalsModel();
    goalsDocument.guildId = interaction.guildId;
    goalsDocument.userId = interaction.user.id;
    goalsDocument.objectives = objectives;
    goalsDocument.inspirations = inspirations;
    goalsDocument.messageId = message.id;
    try {
        await goalsDocument.save();
    }
    catch (error) {
        interaction.editReply(ErrorMessages_1.COMMON_ERROR_MESSAGES.databaseFail);
        console.error(error);
        return;
    }
    try {
        await interaction.editReply(GoalsSubmit_2.CONFIRMATION_MESSAGES.goalsSubmitWorked);
    }
    catch (error) {
        console.error(error);
        return;
    }
}
