"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVENT_DATA = void 0;
const discord_js_1 = require("discord.js");
const StartPokeCronjob_1 = require("../Handlers/StartPokeCronjob");
exports.EVENT_DATA = {
    event: discord_js_1.Events.ClientReady,
    handler: StartPokeCronjob_1.Handle,
};
