"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Handle = Handle;
const Core_1 = require("../../Utility/Core");
const fs_1 = require("fs");
const path_1 = require("path");
let loadedHandlers;
/**
 * Finds and maps every button's customId to its handler
 *
 * Note: consequentially, every module in each "../Buttons/Data"
 * folder must have a `BUTTON_DATA` export, which should
 * be of type `IButtonData`
 *
 * @returns a map of { [customId]: handler }
 */
function GetEveryButtonHandler() {
    const handlers = new Map();
    for (const dataDirectory of Core_1.EVERY_BUTTON_DATA) {
        const modules = (0, fs_1.readdirSync)(dataDirectory);
        for (const module of modules) {
            const modulePath = (0, path_1.join)(dataDirectory, module);
            const { BUTTON_DATA } = require(modulePath);
            handlers.set(BUTTON_DATA.customId, BUTTON_DATA.handler);
        }
    }
    return handlers;
}
/**
 * Finds and runs the `interaction's` button handler
 *
 * @param interaction The button press' origin
 * @throws if the button the `interaction` wants to handle doesn't have a handler
 */
function Handle(interaction) {
    if (!interaction.isButton()) {
        return;
    }
    // Cache the handler map so we don't have to scan the entire project again
    if (!loadedHandlers) {
        loadedHandlers = GetEveryButtonHandler();
    }
    const handler = loadedHandlers.get(interaction.customId);
    if (handler) {
        handler(interaction);
    }
    else {
        throw new Error(`Button has no handler: ${interaction.customId}`);
    }
}
