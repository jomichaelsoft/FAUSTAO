"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Handle = Handle;
// prettier-ignore
const discord_js_1 = require("discord.js");
const ErrorMessages_1 = require("../../../Core/Commands/Locale/ErrorMessages");
const GoalsSet_1 = require("../Locale/GoalsSet");
const GoalsSubmit_1 = require("../../Modals/Enums/GoalsSubmit");
const GoalsSubmit_2 = require("../../Modals/Data/GoalsSubmit");
/**
 * Sends a form to the end user asking them what their art goals are
 *
 * @param interaction The command's origin
 */
async function Handle(interaction) {
    if (!interaction.inCachedGuild()) {
        interaction.reply({
            content: ErrorMessages_1.COMMON_ERROR_MESSAGES.commandNotInGuild,
            flags: discord_js_1.MessageFlags.Ephemeral,
        });
        return;
    }
    const objectivesRow = new discord_js_1.ActionRowBuilder();
    const inspirationsRow = new discord_js_1.ActionRowBuilder();
    objectivesRow.addComponents(new discord_js_1.TextInputBuilder()
        .setCustomId(GoalsSubmit_1.TextInputCustomId.objectives)
        .setLabel(GoalsSet_1.MODAL.objectivesInputLabel)
        .setStyle(discord_js_1.TextInputStyle.Paragraph)
        .setRequired(true));
    inspirationsRow.addComponents(new discord_js_1.TextInputBuilder()
        .setCustomId(GoalsSubmit_1.TextInputCustomId.inspirations)
        .setLabel(GoalsSet_1.MODAL.inspirationsInputLabel)
        .setStyle(discord_js_1.TextInputStyle.Short)
        .setRequired(true));
    const modal = new discord_js_1.ModalBuilder()
        .setCustomId(GoalsSubmit_2.MODAL_DATA.customId)
        .setTitle(GoalsSet_1.MODAL.title)
        .addComponents(objectivesRow, inspirationsRow);
    try {
        await interaction.showModal(modal);
    }
    catch (error) {
        interaction.editReply(GoalsSet_1.ERROR_MESSAGES.modalFailedToSend);
        console.log(error);
        return;
    }
}
