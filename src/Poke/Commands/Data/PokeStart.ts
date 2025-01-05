import { ChannelType, SlashCommandBuilder, SlashCommandChannelOption, SlashCommandUserOption } from "discord.js";
import { ISlashCommandData } from "../../../Core/Commands/Types/CommandData";
import { Handle } from "../Handlers/PokeStart";
import { CommandOption } from "../Enums/PokeStart";

export const SLASH_COMMAND_DATA: ISlashCommandData = {
	blueprint: new SlashCommandBuilder()
		.setName("poke-start")
		.setDescription("Will create a message every day to remind the host to draw!!")

		.addChannelOption((option: SlashCommandChannelOption) =>
			option
				.setName(CommandOption.channel)
				.setDescription("Where should it be posted")
				.addChannelTypes(ChannelType.GuildText)
				.setRequired(true)
		)

		.addUserOption((option: SlashCommandUserOption) =>
			option.setName(CommandOption.host).setDescription("Who's gonna be starting sessions").setRequired(true)
		),

	handler: Handle,
};
