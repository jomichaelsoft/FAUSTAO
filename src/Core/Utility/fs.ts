import { readdirSync, Dirent } from "fs";
import { join, resolve } from "path";

/** A shortcut to the `src` folder */
export const SRC_PATH = resolve(__dirname, "..", "..");

/**
 * Finds all directories (or folders) that have the name `name`. **Will also search subfolders**
 *
 * @param name What are you trying to find
 * @param start Where should it begin searching
 * @returns The directories called `name`
 */
export function GetDirectoriesNamed(name: string, start: string): string[] {
	const matches: string[] = [];

	function findMatchingDirectories(origin: string) {
		const dirents: Dirent[] = readdirSync(origin, { withFileTypes: true });
		const directories: Dirent[] = dirents.filter((dirent: Dirent) => dirent.isDirectory());

		for (const directory of directories) {
			const path: string = join(origin, directory.name);

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
