// prettier-ignore
import { ChannelType, ChatInputCommandInteraction, MessageFlags, NewsChannel, PermissionFlagsBits, TextChannel, User } from "discord.js";
import { CommandOption } from "../Enums/PokeStart";
import { COMMAND_NOT_IN_GUILD, NOT_AN_ADMIN } from "../../../Core/Commands/Utility/ErrorMessages";
import { IPokeDocument, PokeModel } from "../../Models/Poke";
import { HydratedDocument } from "mongoose";

/**
 * Saves info up on a database for later use in the poke cronjob
 *
 * @param interaction The command's origin
 */
export async function Handle(interaction: ChatInputCommandInteraction) {
	if (!interaction.inCachedGuild()) {
		interaction.reply({
			content: COMMAND_NOT_IN_GUILD,
			flags: MessageFlags.Ephemeral,
		});

		return;
	}

	if (!interaction.memberPermissions.has(PermissionFlagsBits.Administrator)) {
		interaction.reply({
			content: NOT_AN_ADMIN,
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
			content: "**Error:** YOU ARE MISTAKEN. A MACHINE CANNOT BE A HOST",
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
			interaction.editReply("**Error:** YOU ARE MISTAKEN. THERE IS ALREADY A POKE ACTIVE IN THIS SERVER");
			return;
		}
	} catch (error) {
		interaction.editReply("**Error:** A TRUE SHAME THAT THE DATABASE FAILED SUCH A MUNDANE TASK");
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
		interaction.editReply("**Error:** SAVING UNSUCCESFUL. FAUSTÃO IS NOT AT FAULT.");
		console.error(error);
		return;
	}

	try {
		interaction.editReply("MAGNIFICENT SETUP. YOU ARE NOW TO BE WARNED EVERY DAY AT `00:00 UTC-5 (Arch Time)`");
	} catch (error) {
		console.error(error);
	}
}
