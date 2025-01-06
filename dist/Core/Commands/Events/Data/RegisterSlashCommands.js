"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVENT_DATA = void 0;
const discord_js_1 = require("discord.js");
const RegisterSlashCommands_1 = require("../Handlers/RegisterSlashCommands");
exports.EVENT_DATA = {
    event: discord_js_1.Events.ClientReady,
    handler: RegisterSlashCommands_1.Handle,
};
