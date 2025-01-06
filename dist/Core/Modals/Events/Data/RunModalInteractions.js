"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVENT_DATA = void 0;
const discord_js_1 = require("discord.js");
const RunModalInteractions_1 = require("../Handlers/RunModalInteractions");
exports.EVENT_DATA = {
    event: discord_js_1.Events.InteractionCreate,
    handler: RunModalInteractions_1.Handle,
};
