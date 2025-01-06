import { Events } from "discord.js";
import { IEventData } from "../../../Core/Events/Types/EventData";
import { Handle } from "../Handlers/StartPokeCronjob";

export const EVENT_DATA: IEventData = {
	event: Events.ClientReady,
	handler: Handle,
};
