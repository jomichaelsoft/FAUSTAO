"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Handle = Handle;
// prettier-ignore
const discord_js_1 = require("discord.js");
const ErrorMessages_1 = require("../../../Core/Commands/Locale/ErrorMessages");
const Configure_1 = require("../Enums/Configure");
const Configuration_1 = require("../../Models/Configuration");
const Configure_2 = require("../Locale/Configure");
/**
 * Just saves user variables to the database
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
    const hostRole = interaction.options.getRole(Configure_1.CommandOption.hostRole, true);
    const goalsChannel = interaction.options.getChannel(Configure_1.CommandOption.goalsChannel, true, [
        discord_js_1.ChannelType.GuildText,
        discord_js_1.ChannelType.GuildAnnouncement,
    ]);
    if (hostRole.managed) {
        interaction.reply({
            content: Configure_2.ERROR_MESSAGES.hostRoleIsFromBot,
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
        const existing = await Configuration_1.ConfigurationModel.findOne({
            guildId: interaction.guildId,
        });
        if (existing) {
            configuration = existing;
        }
        else {
            configuration = new Configuration_1.ConfigurationModel();
        }
    }
    catch (error) {
        interaction.editReply(ErrorMessages_1.COMMON_ERROR_MESSAGES.databaseFail);
        console.error(error);
        return;
    }
    configuration.guildId = interaction.guildId;
    configuration.hostRoleId = hostRole.id;
    configuration.goalsChannelId = goalsChannel.id;
    try {
        await configuration.save();
    }
    catch (error) {
        interaction.editReply(ErrorMessages_1.COMMON_ERROR_MESSAGES.databaseFail);
        console.error(error);
        return;
    }
    try {
        interaction.editReply(Configure_2.CONFIRMATION_MESSAGES.configurationSuccessful);
    }
    catch (error) {
        console.error(error);
        return;
    }
}
