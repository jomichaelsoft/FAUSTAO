import { ButtonInteraction } from "discord.js";

/** What to use to identify the button */
export type ButtonCustomId = string;

/** What the button does */
export type ButtonHandler = (interaction: ButtonInteraction) => void;

/** Information used to make the button work */
export interface IButtonData {
	customId: ButtonCustomId;
	handler: ButtonHandler;
}
