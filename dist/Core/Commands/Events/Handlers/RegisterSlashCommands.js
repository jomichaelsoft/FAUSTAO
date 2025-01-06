"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Handle = Handle;
const Core_1 = require("../../Utility/Core");
const fs_1 = require("fs");
const path_1 = require("path");
/**
 * Note: consequentially, every module in each "../Commands/Data"
 * folder must have a `SLASH_COMMAND_DATA` export, which should
 * be of type `ISlashCommandData`
 *
 * @returns Every command in the project's important Discord API info
 */
function GetEverySlashCommandBlueprint() {
    const blueprints = [];
    for (const dataDirectory of Core_1.EVERY_COMMAND_DATA) {
        const modules = (0, fs_1.readdirSync)(dataDirectory);
        for (const module of modules) {
            const modulePath = (0, path_1.join)(dataDirectory, module);
            const { SLASH_COMMAND_DATA } = require(modulePath);
            blueprints.push(SLASH_COMMAND_DATA.blueprint);
        }
    }
    return blueprints;
}
/**
 * Loads every command in the project onto Discord
 *
 * @param readyClient The now loaded client that the bot will use
 */
async function Handle(readyClient) {
    const blueprints = GetEverySlashCommandBlueprint();
    try {
        await readyClient.application.commands.set(blueprints);
        console.log("🛂 Slash commands registered");
    }
    catch (error) {
        console.error("Can't setup commands", error);
    }
}
