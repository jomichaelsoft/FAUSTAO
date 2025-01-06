import { join } from "path";
import { GetDirectoriesNamed, SRC_PATH } from "../../Utility/fs";
import { existsSync } from "fs";

/**
 * I like to organize my stuff into folders. We do this to turn
 * that human friendly input into machine readable output
 *
 * @returns Every folder in the project with a path like ".../Modals/Data"
 */
function GetEveryModalDataDirectory(): string[] {
	const directories: string[] = GetDirectoriesNamed("Modals", SRC_PATH);
	const pathsOfThoseWithData: string[] = [];

	for (const directory of directories) {
		const dataPath: string = join(directory, "Data");

		if (existsSync(dataPath)) {
			pathsOfThoseWithData.push(dataPath);
		}
	}

	return pathsOfThoseWithData;
}

/** An array of all ".../Modals/Data" folders */
export const EVERY_MODAL_DATA: string[] = GetEveryModalDataDirectory();
