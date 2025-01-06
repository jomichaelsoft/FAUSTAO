"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Handle = Handle;
// prettier-ignore
const discord_js_1 = require("discord.js");
const PokeStart_1 = require("../Enums/PokeStart");
const ErrorMessages_1 = require("../../../Core/Commands/Locale/ErrorMessages");
const Poke_1 = require("../../Models/Poke");
const PokeStart_2 = require("../Locale/PokeStart");
const Configuration_1 = require("../../../Configuration/Models/Configuration");
const ErrorMessages_2 = require("../../../Configuration/Locale/ErrorMessages");
/**
 * Saves info up on a database for later use in the poke cronjob. Also gives the host
 * a special role
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
            content: ErrorMessages_1.COMMON_ERROR_MESSAGES.notAnAdmin,
            flags: discord_js_1.MessageFlags.Ephemeral,
        });
        return;
    }
    const host = interaction.options.getMember(PokeStart_1.CommandOption.host);
    const channel = interaction.options.getChannel(PokeStart_1.CommandOption.channel, true, [
        discord_js_1.ChannelType.GuildText,
        discord_js_1.ChannelType.GuildAnnouncement,
    ]);
    if (!host) {
        interaction.reply({
            content: PokeStart_2.ERROR_MESSAGES.cantFindHost,
            flags: discord_js_1.MessageFlags.Ephemeral,
        });
        return;
    }
    if (host.user.bot) {
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
    let configuration;
    try {
        configuration = await Configuration_1.ConfigurationModel.findOne({
            guildId: interaction.guildId,
        });
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
    const hostRole = interaction.guild.roles.cache.find((role) => role.id === configuration.hostRoleId);
    if (!hostRole) {
        interaction.editReply(PokeStart_2.ERROR_MESSAGES.hostRoleMissing);
        return;
    }
    try {
        await host.roles.add(hostRole);
    }
    catch (error) {
        interaction.editReply(PokeStart_2.ERROR_MESSAGES.cantAssignHostRole);
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
        interaction.editReply(ErrorMessages_1.COMMON_ERROR_MESSAGES.databaseFail);
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
        interaction.editReply(ErrorMessages_1.COMMON_ERROR_MESSAGES.databaseFail);
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
