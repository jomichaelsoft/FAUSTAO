import { ClientEvents } from "discord.js";

/** What event should it listen to */
export type Event = keyof ClientEvents;

/** How should it respond to the event */
export type EventHandler = (...args: any) => void;

/** Information used to connect an event */
export interface IEventData {
	event: Event;
	handler: EventHandler;
}
