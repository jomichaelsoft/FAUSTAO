import { SlashCommandBuilder } from "discord.js";

/** Info on how to setup the command */
export type SlashCommandBlueprint = SlashCommandBuilder;

/** What to call to run the command */
export type SlashCommandHandler = (...args: any) => void;

/** Information used to register and execute slash commands */
export interface ISlashCommandData {
	blueprint: SlashCommandBlueprint;
	handler: SlashCommandHandler;
}
