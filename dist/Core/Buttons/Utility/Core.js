"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVERY_BUTTON_DATA = void 0;
const path_1 = require("path");
const fs_1 = require("../../Utility/fs");
const fs_2 = require("fs");
/**
 * I like to organize my stuff into folders. We do this to turn
 * that human friendly input into machine readable output
 *
 * @returns Every folder in the project with a path like ".../Buttons/Data"
 */
function GetEveryButtonDataDirectory() {
    const directories = (0, fs_1.GetDirectoriesNamed)("Buttons", fs_1.SRC_PATH);
    const pathsOfThoseWithData = [];
    for (const directory of directories) {
        const dataPath = (0, path_1.join)(directory, "Data");
        if ((0, fs_2.existsSync)(dataPath)) {
            pathsOfThoseWithData.push(dataPath);
        }
    }
    return pathsOfThoseWithData;
}
/** An array of all ".../Buttons/Data" folders */
exports.EVERY_BUTTON_DATA = GetEveryButtonDataDirectory();
