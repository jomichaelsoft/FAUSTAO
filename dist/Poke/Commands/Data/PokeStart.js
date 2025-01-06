"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SLASH_COMMAND_DATA = void 0;
const discord_js_1 = require("discord.js");
const PokeStart_1 = require("../Handlers/PokeStart");
const PokeStart_2 = require("../Enums/PokeStart");
exports.SLASH_COMMAND_DATA = {
    blueprint: new discord_js_1.SlashCommandBuilder()
        .setName("poke-start")
        .setDescription("Will create a message every day to remind the host to draw!!")
        .addChannelOption((option) => option
        .setName(PokeStart_2.CommandOption.channel)
        .setDescription("Where should it be posted")
        .addChannelTypes(discord_js_1.ChannelType.GuildText, discord_js_1.ChannelType.GuildAnnouncement)
        .setRequired(true))
        .addUserOption((option) => option.setName(PokeStart_2.CommandOption.host).setDescription("Who's gonna be starting sessions").setRequired(true)),
    handler: PokeStart_1.Handle,
};
