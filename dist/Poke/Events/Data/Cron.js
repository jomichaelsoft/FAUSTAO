"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVENT_DATA = void 0;
const discord_js_1 = require("discord.js");
const Cron_1 = require("../Handlers/Cron");
exports.EVENT_DATA = {
    event: discord_js_1.Events.ClientReady,
    handler: Cron_1.Handle,
};
