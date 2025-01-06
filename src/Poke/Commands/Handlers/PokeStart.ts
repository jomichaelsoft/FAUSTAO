// prettier-ignore
import { ChannelType, ChatInputCommandInteraction, GuildMember, MessageFlags, NewsChannel, PermissionFlagsBits, Role, TextChannel } from "discord.js";
import { CommandOption } from "../Enums/PokeStart";
import { COMMON_ERROR_MESSAGES } from "../../../Core/Commands/Locale/ErrorMessages";
import { IPokeDocument, PokeModel } from "../../Models/Poke";
import { HydratedDocument } from "mongoose";
import { ERROR_MESSAGES, CONFIRMATION_MESSAGES } from "../Locale/PokeStart";
import { ConfigurationModel, IConfigurationDocument } from "../../../Configuration/Models/Configuration";
import { CONFIGURATION_COMMON_ERROR_MESSAGES } from "../../../Configuration/Locale/ErrorMessages";

/**
 * Saves info up on a database for later use in the poke cronjob. Also gives the host
 * a special role
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

	const host: GuildMember | null = interaction.options.getMember(CommandOption.host);
	const channel: TextChannel | NewsChannel = interaction.options.getChannel(CommandOption.channel, true, [
		ChannelType.GuildText,
		ChannelType.GuildAnnouncement,
	]);

	if (!host) {
		interaction.reply({
			content: ERROR_MESSAGES.cantFindHost,
			flags: MessageFlags.Ephemeral,
		});

		return;
	}

	if (host.user.bot) {
		interaction.reply({
			content: ERROR_MESSAGES.hostIsBot,
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

	let configuration: HydratedDocument<IConfigurationDocument> | null;

	try {
		configuration = await ConfigurationModel.findOne({
			guildId: interaction.guildId,
		});

		if (!configuration) {
			interaction.editReply(CONFIGURATION_COMMON_ERROR_MESSAGES.noConfigurationInGuild);
			return;
		}
	} catch (error) {
		interaction.editReply(COMMON_ERROR_MESSAGES.databaseFail);
		console.error(error);
		return;
	}

	const hostRole: Role | undefined = interaction.guild.roles.cache.find((role: Role) => role.id === configuration.hostRoleId);

	if (!hostRole) {
		interaction.editReply(ERROR_MESSAGES.hostRoleMissing);
		return;
	}

	try {
		await host.roles.add(hostRole);
	} catch (error) {
		interaction.editReply(ERROR_MESSAGES.cantAssignHostRole);
		console.error(error);
		return;
	}

	try {
		const existingPoke: HydratedDocument<IPokeDocument> | null = await PokeModel.findOne({ guildId: interaction.guildId });

		if (existingPoke) {
			interaction.editReply(ERROR_MESSAGES.pokeAlreadyActive);
			return;
		}
	} catch (error) {
		interaction.editReply(COMMON_ERROR_MESSAGES.databaseFail);
		console.log(error);
		return;
	}

	const poke: HydratedDocument<IPokeDocument> = new PokeModel();

	poke.guildId = interaction.guildId;
	poke.hostUserId = host.id;
	poke.channelId = channel.id;

	try {
		await poke.save();
	} catch (error) {
		interaction.editReply(COMMON_ERROR_MESSAGES.databaseFail);
		console.error(error);
		return;
	}

	try {
		await interaction.editReply(CONFIRMATION_MESSAGES.pokeStartSuccessful);
	} catch (error) {
		console.error(error);
		return;
	}
}
