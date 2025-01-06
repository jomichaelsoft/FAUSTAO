"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Handle = Handle;
const Poke_1 = require("../../Models/Poke");
const PromptYes_1 = require("../Locale/PromptYes");
const Random_1 = require("../../../Core/Utility/Random");
const ErrorMessages_1 = require("../../Locale/ErrorMessages");
const ErrorMessages_2 = require("../../../Core/Commands/Locale/ErrorMessages");
/**
 * Will ping the poke's host warning them that a person wants to join.
 * If the person who presses the button is the host, then the session is confirmed
 * and the prompt message is deleted
 *
 * @param interaction What triggered the button click
 */
async function Handle(interaction) {
    try {
        await interaction.deferReply();
    }
    catch (error) {
        console.error(error);
        return;
    }
    let poke;
    try {
        poke = await Poke_1.PokeModel.findOne({ guildId: interaction.guildId });
        if (!poke) {
            interaction.editReply(ErrorMessages_1.POKE_COMMON_ERROR_MESSAGES.noPokeInGuild);
            return;
        }
    }
    catch (error) {
        interaction.editReply(ErrorMessages_2.COMMON_ERROR_MESSAGES.databaseFail);
        console.error(error);
        return;
    }
    if (poke.hostId === interaction.user.id) {
        try {
            await interaction.editReply(PromptYes_1.CONFIRMATION_MESSAGES.host);
            interaction.message.delete();
        }
        catch (error) {
            console.error(error);
        }
        return;
    }
    try {
        const message = (0, Random_1.PickRandomArrayItem)(PromptYes_1.CONFIRMATION_MESSAGES.participants);
        const formattedMessage = message
            .replace(PromptYes_1.TAGS.hostId, poke.hostId)
            .replace(PromptYes_1.TAGS.participantName, interaction.user.displayName);
        interaction.editReply(formattedMessage);
    }
    catch (error) {
        console.error(error);
    }
}
