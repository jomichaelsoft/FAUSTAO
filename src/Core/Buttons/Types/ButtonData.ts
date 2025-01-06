/** Basically the button's name */
export type ButtonCustomId = string;

/** What the button does */
export type ButtonHandler = (...args: any) => void;

/** Information used to register and execute slash commands */
export interface IButtonData {
	customId: ButtonCustomId;
	handler: ButtonHandler;
}
