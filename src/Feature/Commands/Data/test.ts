import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { ISlashCommandData } from "../../../Core/Commands/Types/CommandData";

export const SLASH_COMMAND_DATA: ISlashCommandData = {
	blueprint: new SlashCommandBuilder().setName("teste").setDescription("lol"),

	handler: (interaction: ChatInputCommandInteraction) => {
		interaction.reply("123");
	},
};
