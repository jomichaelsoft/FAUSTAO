"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SLASH_COMMAND_DATA = void 0;
const discord_js_1 = require("discord.js");
const GoalsSet_1 = require("../Handlers/GoalsSet");
exports.SLASH_COMMAND_DATA = {
    blueprint: new discord_js_1.SlashCommandBuilder().setName("goals-set").setDescription("Edit your art goals"),
    handler: GoalsSet_1.Handle,
};
