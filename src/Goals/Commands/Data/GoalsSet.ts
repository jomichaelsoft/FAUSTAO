import { SlashCommandBuilder } from "discord.js";
import { ISlashCommandData } from "../../../Core/Commands/Types/CommandData";
import { Handle } from "../Handlers/GoalsSet";

export const SLASH_COMMAND_DATA: ISlashCommandData = {
	blueprint: new SlashCommandBuilder().setName("goals-set").setDescription("Edit your art goals"),
	handler: Handle,
};
