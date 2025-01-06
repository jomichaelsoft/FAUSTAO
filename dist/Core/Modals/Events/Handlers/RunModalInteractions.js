"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Handle = Handle;
const fs_1 = require("fs");
const path_1 = require("path");
const Core_1 = require("../../Utility/Core");
let loadedHandlers;
/**
 * Finds and maps every button's customId to its handler
 *
 * Note: consequentially, every module in each "../Modals/Data"
 * folder must have a `MODAL_DATA` export, which should
 * be of type `IModalData`
 *
 * @returns a map of { [customId]: handler }
 */
function GetEveryModalHandler() {
    const handlers = new Map();
    for (const dataDirectory of Core_1.EVERY_MODAL_DATA) {
        const modules = (0, fs_1.readdirSync)(dataDirectory);
        for (const module of modules) {
            const modulePath = (0, path_1.join)(dataDirectory, module);
            const { MODAL_DATA } = require(modulePath);
            handlers.set(MODAL_DATA.customId, MODAL_DATA.handler);
        }
    }
    return handlers;
}
/**
 * Finds and runs the `interaction's` modal handler
 *
 * @param interaction What was used to submit the modal
 * @throws if the modal the `interaction` wants to handle doesn't have a handler
 */
function Handle(interaction) {
    if (!interaction.isModalSubmit()) {
        return;
    }
    // Cache the handler map so we don't have to scan the entire project again
    if (!loadedHandlers) {
        loadedHandlers = GetEveryModalHandler();
    }
    const handler = loadedHandlers.get(interaction.customId);
    if (handler) {
        handler(interaction);
    }
    else {
        throw new Error(`Modal has no handler: ${interaction.customId}`);
    }
}
