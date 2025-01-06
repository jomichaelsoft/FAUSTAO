"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Handle = Handle;
const Core_1 = require("../../Utility/Core");
const fs_1 = require("fs");
const path_1 = require("path");
let loadedHandlers;
/**
 * Finds and maps every command name of the project to its handler
 *
 * @returns a map of { [commandName]: handler }
 */
function GetEverySlashCommandHandler() {
    const handlers = new Map();
    for (const dataDirectory of Core_1.EVERY_COMMAND_DATA) {
        const modules = (0, fs_1.readdirSync)(dataDirectory);
        for (const module of modules) {
            const modulePath = (0, path_1.join)(dataDirectory, module);
            const { SLASH_COMMAND_DATA } = require(modulePath);
            handlers.set(SLASH_COMMAND_DATA.blueprint.name, SLASH_COMMAND_DATA.handler);
        }
    }
    return handlers;
}
/**
 * Finds and runs the `interaction's` slash command
 *
 * @param interaction What was used to call the command
 * @throws if the command the `interaction` wants to call doesn't have a handler
 */
function Handle(interaction) {
    if (!interaction.isChatInputCommand()) {
        return;
    }
    // Cache the handler map so we don't have to scan the entire project again
    if (!loadedHandlers) {
        loadedHandlers = GetEverySlashCommandHandler();
    }
    const handler = loadedHandlers.get(interaction.commandName);
    if (handler) {
        handler(interaction);
    }
    else {
        throw new Error(`Slash command has no handler: ${interaction.commandName}`);
    }
}
