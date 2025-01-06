"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVERY_EVENT_DATA = void 0;
exports.ConnectEventFromData = ConnectEventFromData;
exports.ConnectEventsFromDataDirectory = ConnectEventsFromDataDirectory;
const path_1 = require("path");
const fs_1 = require("../../Utility/fs");
const fs_2 = require("fs");
/**
 * I like to organize my stuff into folders. We do this to turn
 * that human friendly input into machine readable output
 *
 * @returns Every folder in the project with a path like ".../Events/Data"
 */
function GetEveryEventDataDirectory() {
    const directories = (0, fs_1.GetDirectoriesNamed)("Events", fs_1.SRC_PATH);
    const pathsOfThoseWithData = [];
    for (const directory of directories) {
        const dataPath = (0, path_1.join)(directory, "Data");
        if ((0, fs_2.existsSync)(dataPath)) {
            pathsOfThoseWithData.push(dataPath);
        }
    }
    return pathsOfThoseWithData;
}
/** An array of all ".../Events/Data" folders */
exports.EVERY_EVENT_DATA = GetEveryEventDataDirectory();
/**
 * Starts listening to the event declared by `data`
 *
 * @param client Our bot's client
 * @param data What we need to know to connect
 */
function ConnectEventFromData(client, data) {
    client.on(data.event, (...args) => data.handler(...args));
}
/**
 * Reads an event data folder and connects the event of each file. Consequentially,
 * every module in each "../Events/Data" folder must have an `EVENT_DATA` export
 * of type `IEventData`
 *
 * @param client Our bot's client
 * @param dataDirectory The event data folder
 */
function ConnectEventsFromDataDirectory(client, dataDirectory) {
    const modules = (0, fs_2.readdirSync)(dataDirectory);
    for (const module of modules) {
        const modulePath = (0, path_1.join)(dataDirectory, module);
        const { EVENT_DATA } = require(modulePath);
        ConnectEventFromData(client, EVENT_DATA);
    }
}
