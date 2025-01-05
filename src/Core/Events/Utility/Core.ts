import { join } from "path";
import { GetDirectoriesNamed, SRC_PATH } from "../../Utility/fs";
import { existsSync, readdirSync } from "fs";
import { IEventData } from "../Types/EventData";
import { Client } from "discord.js";

/**
 * I like to organize my stuff into folders. We do this to turn
 * that human friendly input into machine readable output
 *
 * @returns Every folder in the project with a path like ".../Events/Data"
 */
function GetEveryEventDataDirectory(): string[] {
	const eventDirectories: string[] = GetDirectoriesNamed("Events", SRC_PATH);
	const pathsOfThoseWithData: string[] = [];

	for (const eventDirectory of eventDirectories) {
		const dataPath: string = join(eventDirectory, "Data");

		if (existsSync(dataPath)) {
			pathsOfThoseWithData.push(dataPath);
		}
	}

	return pathsOfThoseWithData;
}

/** An array of all ".../Events/Data" folders */
export const EVERY_EVENT_DATA: string[] = GetEveryEventDataDirectory();

/**
 * Starts listening to the event declared by `data`
 *
 * @param client Our bot's client
 * @param data What we need to know to connect
 */
export function ConnectEventFromData(client: Client, data: IEventData) {
	client.on(data.event, (...args: any) => data.handler(...args));
}

/**
 * Reads an event data folder and connects the event of each file. Consequentially,
 * every module in each "../Events/Data" folder must have an `EVENT_DATA` export
 * of type `IEventData`
 *
 * @param client Our bot's client
 * @param dataDirectory The event data folder
 */
export function ConnectEventsFromDataDirectory(client: Client, dataDirectory: string) {
	const modules: string[] = readdirSync(dataDirectory);

	for (const module of modules) {
		const modulePath: string = join(dataDirectory, module);
		const { EVENT_DATA } = require(modulePath);

		ConnectEventFromData(client, EVENT_DATA);
	}
}
