"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Handle = Handle;
// prettier-ignore
const discord_js_1 = require("discord.js");
const PokeStart_1 = require("../Enums/PokeStart");
const ErrorMessages_1 = require("../../../Core/Commands/Utility/ErrorMessages");
const Poke_1 = require("../../Models/Poke");
/**
 * Saves info up on a database for later use in the poke cronjob
 *
 * @param interaction The command's origin
 */
async function Handle(interaction) {
    if (!interaction.inCachedGuild()) {
        interaction.reply({
            content: ErrorMessages_1.COMMAND_NOT_IN_GUILD,
            flags: discord_js_1.MessageFlags.Ephemeral,
        });
        return;
    }
    if (!interaction.memberPermissions.has(discord_js_1.PermissionFlagsBits.Administrator)) {
        interaction.reply({
            content: ErrorMessages_1.NOT_AN_ADMIN,
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
            content: "**Error:** YOU ARE MISTAKEN. A MACHINE CANNOT BE A HOST",
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
            interaction.editReply("**Error:** YOU ARE MISTAKEN. THERE IS ALREADY A POKE ACTIVE IN THIS SERVER");
            return;
        }
    }
    catch (error) {
        interaction.editReply("**Error:** A TRUE SHAME THAT THE DATABASE FAILED SUCH A MUNDANE TASK");
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
        interaction.editReply("**Error:** SAVING UNSUCCESFUL. FAUSTÃO IS NOT AT FAULT.");
        console.error(error);
        return;
    }
    try {
        interaction.editReply("MAGNIFICENT SETUP. YOU ARE NOW TO BE WARNED EVERY DAY AT `00:00 UTC-5 (Arch Time)`");
    }
    catch (error) {
        console.error(error);
    }
}
