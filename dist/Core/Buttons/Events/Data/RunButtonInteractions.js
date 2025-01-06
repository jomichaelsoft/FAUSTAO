"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVENT_DATA = void 0;
const discord_js_1 = require("discord.js");
const RunButtonInteractions_1 = require("../Handlers/RunButtonInteractions");
exports.EVENT_DATA = {
    event: discord_js_1.Events.InteractionCreate,
    handler: RunButtonInteractions_1.Handle,
};
