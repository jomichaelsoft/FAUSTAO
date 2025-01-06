// prettier-ignore
import { ChannelType, ChatInputCommandInteraction, MessageFlags, NewsChannel, PermissionFlagsBits, Role, TextChannel } from "discord.js";
import { COMMON_ERROR_MESSAGES } from "../../../Core/Commands/Locale/ErrorMessages";
import { CommandOption } from "../Enums/Configure";
import { HydratedDocument } from "mongoose";
import { ConfigurationModel, IConfigurationDocument } from "../../Models/Configuration";
import { CONFIRMATION_MESSAGES, ERROR_MESSAGES } from "../Locale/Configure";

/**
 * Just saves user variables to the database
 *
 * @param interaction The command's origin
 */
export async function Handle(interaction: ChatInputCommandInteraction) {
	if (!interaction.inCachedGuild()) {
		interaction.reply({
			content: COMMON_ERROR_MESSAGES.commandNotInGuild,
			flags: MessageFlags.Ephemeral,
		});

		return;
	}

	if (!interaction.memberPermissions.has(PermissionFlagsBits.Administrator)) {
		interaction.reply({
			content: COMMON_ERROR_MESSAGES.notAnAdmin,
			flags: MessageFlags.Ephemeral,
		});

		return;
	}

	const hostRole: Role = interaction.options.getRole(CommandOption.hostRole, true);
	const goalsChannel: TextChannel | NewsChannel = interaction.options.getChannel(CommandOption.goalsChannel, true, [
		ChannelType.GuildText,
		ChannelType.GuildAnnouncement,
	]);

	if (hostRole.managed) {
		interaction.reply({
			content: ERROR_MESSAGES.hostRoleIsFromBot,
			flags: MessageFlags.Ephemeral,
		});

		return;
	}

	try {
		await interaction.deferReply();
	} catch (error) {
		console.error(error);
		return;
	}

	let configuration: HydratedDocument<IConfigurationDocument>;

	try {
		const existing: HydratedDocument<IConfigurationDocument> | null = await ConfigurationModel.findOne({
			guildId: interaction.guildId,
		});

		if (existing) {
			configuration = existing;
		} else {
			configuration = new ConfigurationModel();
		}
	} catch (error) {
		interaction.editReply(COMMON_ERROR_MESSAGES.databaseFail);
		console.error(error);
		return;
	}

	configuration.guildId = interaction.guildId;
	configuration.hostRoleId = hostRole.id;
	configuration.goalsChannelId = goalsChannel.id;

	try {
		await configuration.save();
	} catch (error) {
		interaction.editReply(COMMON_ERROR_MESSAGES.databaseFail);
		console.error(error);
		return;
	}

	try {
		interaction.editReply(CONFIRMATION_MESSAGES.configurationSuccessful);
	} catch (error) {
		console.error(error);
		return;
	}
}
