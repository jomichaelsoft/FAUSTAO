"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Handle = Handle;
// prettier-ignore
const discord_js_1 = require("discord.js");
const PokeStart_1 = require("../Enums/PokeStart");
const ErrorMessages_1 = require("../../../Core/Commands/Locale/ErrorMessages");
const Poke_1 = require("../../Models/Poke");
const PokeStart_2 = require("../Locale/PokeStart");
const ErrorMessages_2 = require("../../Locale/ErrorMessages");
/**
 * Saves info up on a database for later use in the poke cronjob
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
    if (!interaction.memberPermissions.has(discord_js_1.PermissionFlagsBits.Administrator)) {
        interaction.reply({
            content: ErrorMessages_1.COMMON_ERROR_MESSAGES.commandNotInGuild,
            flags: discord_js_1.MessageFlags.Ephemeral,
        });
        return;
    }
    const host = interaction.options.getUser(PokeStart_1.CommandOption.host, true);
    const channel = interaction.options.getChannel(PokeStart_1.CommandOption.channel, true, [
        discord_js_1.ChannelType.GuildText,
        discord_js_1.ChannelType.GuildAnnouncement,
    ]);
    if (host.bot) {
        interaction.reply({
            content: PokeStart_2.ERROR_MESSAGES.hostIsBot,
            flags: discord_js_1.MessageFlags.Ephemeral,
        });
        return;
    }
    try {
        await interaction.deferReply();
    }
    catch (error) {
        console.error(error);
        return;
    }
    try {
        const existingPoke = await Poke_1.PokeModel.findOne({ guildId: interaction.guildId });
        if (existingPoke) {
            interaction.editReply(PokeStart_2.ERROR_MESSAGES.pokeAlreadyActive);
            return;
        }
    }
    catch (error) {
        interaction.editReply(ErrorMessages_2.POKE_COMMON_ERROR_MESSAGES.pokeLookupFailed);
        console.log(error);
        return;
    }
    const poke = new Poke_1.PokeModel();
    poke.guildId = interaction.guildId;
    poke.hostId = host.id;
    poke.channelId = channel.id;
    try {
        await poke.save();
    }
    catch (error) {
        interaction.editReply(PokeStart_2.ERROR_MESSAGES.pokeSaveFailed);
        console.error(error);
        return;
    }
    try {
        interaction.editReply(PokeStart_2.CONFIRMATION_MESSAGES.pokeStartSuccessful);
    }
    catch (error) {
        console.error(error);
    }
}
