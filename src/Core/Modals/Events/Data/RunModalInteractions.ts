import { Events } from "discord.js";
import { IEventData } from "../../../Events/Types/EventData";
import { Handle } from "../Handlers/RunModalInteractions";

export const EVENT_DATA: IEventData = {
	event: Events.InteractionCreate,
	handler: Handle,
};
