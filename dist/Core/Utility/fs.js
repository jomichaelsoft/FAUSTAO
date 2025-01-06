"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SRC_PATH = void 0;
exports.GetDirectoriesNamed = GetDirectoriesNamed;
const fs_1 = require("fs");
const path_1 = require("path");
/** A shortcut to the `src` folder */
exports.SRC_PATH = (0, path_1.resolve)(__dirname, "..", "..");
/**
 * Finds all directories (or folders) that have the name `name`. **Will also search subfolders**
 *
 * @param name What are you trying to find
 * @param start Where should it begin searching
 * @returns The directories called `name`
 */
function GetDirectoriesNamed(name, start) {
    const matches = [];
    function findMatchingDirectories(origin) {
        const dirents = (0, fs_1.readdirSync)(origin, { withFileTypes: true });
        const directories = dirents.filter((dirent) => dirent.isDirectory());
        for (const directory of directories) {
            const path = (0, path_1.join)(origin, directory.name);
            if (directory.name === name) {
                matches.push(path);
                continue;
            }
            // So it is a directory, but it's not named `name`
            // The thing we want might be inside it. So check it's contents
            findMatchingDirectories(path);
        }
    }
    findMatchingDirectories(start);
    return matches;
}
