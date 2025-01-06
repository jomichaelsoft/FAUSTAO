import { ModalSubmitInteraction } from "discord.js";

/** What to use to identify the modal */
export type ModalCustomId = string;

/** How to respond to the modal  */
export type ModalHandler = (interaction: ModalSubmitInteraction) => void;

/** Information used to give the modal functionality  */
export interface IModalData<I> {
	customId: ModalCustomId;
	inputCustomIds: I;
	handler: ModalHandler;
}
