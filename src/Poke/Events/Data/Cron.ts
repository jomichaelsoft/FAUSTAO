import { Events } from "discord.js";
import { IEventData } from "../../../Core/Events/Types/EventData";
import { Handle } from "../Handlers/Cron";

export const EVENT_DATA: IEventData = {
	event: Events.ClientReady,
	handler: Handle,
};
