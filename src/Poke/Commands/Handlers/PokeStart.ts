// prettier-ignore
import { ChannelType, ChatInputCommandInteraction, MessageFlags, NewsChannel, PermissionFlagsBits, TextChannel, User } from "discord.js";
import { CommandOption } from "../Enums/PokeStart";
import { COMMON_ERROR_MESSAGES } from "../../../Core/Commands/Locale/ErrorMessages";
import { IPokeDocument, PokeModel } from "../../Models/Poke";
import { HydratedDocument } from "mongoose";
import { ERROR_MESSAGES, CONFIRMATION_MESSAGES } from "../Locale/PokeStart";

/**
 * Saves info up on a database for later use in the poke cronjob
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
			content: COMMON_ERROR_MESSAGES.commandNotInGuild,
			flags: MessageFlags.Ephemeral,
		});

		return;
	}

	const host: User = interaction.options.getUser(CommandOption.host, true);
	const channel: TextChannel | NewsChannel = interaction.options.getChannel(CommandOption.channel, true, [
		ChannelType.GuildText,
		ChannelType.GuildAnnouncement,
	]);

	if (host.bot) {
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

	try {
		const existingPoke: HydratedDocument<IPokeDocument> | null = await PokeModel.findOne({ guildId: interaction.guildId });

		if (existingPoke) {
			interaction.editReply(ERROR_MESSAGES.pokeAlreadyActive);
			return;
		}
	} catch (error) {
		interaction.editReply(ERROR_MESSAGES.pokeLookupFailed);
		console.log(error);
		return;
	}

	const poke: HydratedDocument<IPokeDocument> = new PokeModel();

	poke.guildId = interaction.guildId;
	poke.hostId = host.id;
	poke.channelId = channel.id;

	try {
		await poke.save();
	} catch (error) {
		interaction.editReply(ERROR_MESSAGES.pokeSaveFailed);
		console.error(error);
		return;
	}

	try {
		interaction.editReply(CONFIRMATION_MESSAGES.pokeStartSuccessful);
	} catch (error) {
		console.error(error);
	}
}
