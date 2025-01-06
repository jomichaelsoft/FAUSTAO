"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVENT_DATA = void 0;
const discord_js_1 = require("discord.js");
const RunSlashCommands_1 = require("../Handlers/RunSlashCommands");
exports.EVENT_DATA = {
    event: discord_js_1.Events.InteractionCreate,
    handler: RunSlashCommands_1.Handle,
};
