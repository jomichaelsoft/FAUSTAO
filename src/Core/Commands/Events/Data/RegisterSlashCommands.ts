import { Events } from "discord.js";
import { IEventData } from "../../../Events/Types/EventData";
import { Handle } from "../Handlers/RegisterSlashCommands";

export const EVENT_DATA: IEventData = {
	event: Events.ClientReady,
	handler: Handle,
};
