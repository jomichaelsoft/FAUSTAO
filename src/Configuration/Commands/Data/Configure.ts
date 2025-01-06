import { ChannelType, SlashCommandBuilder, SlashCommandChannelOption, SlashCommandRoleOption } from "discord.js";
import { ISlashCommandData } from "../../../Core/Commands/Types/CommandData";
import { Handle } from "../Handlers/Configure";
import { CommandOption } from "../Enums/Configure";

export const SLASH_COMMAND_DATA: ISlashCommandData = {
	blueprint: new SlashCommandBuilder()
		.setName("configure")
		.setDescription("Change some settings up")

		.addRoleOption((option: SlashCommandRoleOption) =>
			option
				.setName(CommandOption.hostRole)
				.setDescription("Who should be starting sessions and be pinged all the time")
				.setRequired(true)
		)

		.addChannelOption((option: SlashCommandChannelOption) =>
			option
				.setName(CommandOption.goalsChannel)
				.setDescription("Where should everyone's goals be written")
				.addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
				.setRequired(true)
		),

	handler: Handle,
};
