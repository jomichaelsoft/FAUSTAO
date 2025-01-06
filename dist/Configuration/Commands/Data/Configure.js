"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SLASH_COMMAND_DATA = void 0;
const discord_js_1 = require("discord.js");
const Configure_1 = require("../Handlers/Configure");
const Configure_2 = require("../Enums/Configure");
exports.SLASH_COMMAND_DATA = {
    blueprint: new discord_js_1.SlashCommandBuilder()
        .setName("configure")
        .setDescription("Change some settings up")
        .addRoleOption((option) => option
        .setName(Configure_2.CommandOption.hostRole)
        .setDescription("Who should be starting sessions and be pinged all the time")
        .setRequired(true))
        .addChannelOption((option) => option
        .setName(Configure_2.CommandOption.goalsChannel)
        .setDescription("Where should everyone's goals be written")
        .addChannelTypes(discord_js_1.ChannelType.GuildText, discord_js_1.ChannelType.GuildAnnouncement)
        .setRequired(true)),
    handler: Configure_1.Handle,
};
