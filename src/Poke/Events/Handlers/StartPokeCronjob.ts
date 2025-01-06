// prettier-ignore
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Channel, Client, EmbedBuilder, Guild, GuildMember, MessageCreateOptions, User } from "discord.js";
import { CronJob } from "cron";
import { HydratedDocument } from "mongoose";
import { IPokeDocument, PokeModel } from "../../Models/Poke";
import { BUTTON_DATA as YES_BUTTON_DATA } from "../../Buttons/Data/PromptYes";
import { BUTTON_DATA as NO_BUTTON_DATA } from "../../Buttons/Data/PromptNo";
import { PARTICIPATE_PROMPT, TAGS } from "../Locale/StartPokeCronjob";
import { PickRandomArrayItem } from "../../../Core/Utility/Random";

// prettier-ignore
/**
 * @returns A message saying the day begun and if there should be a session
 */
async function GetParticipatePrompt(readyClient: Client<true>, poke: HydratedDocument<IPokeDocument>): Promise<MessageCreateOptions> {
	const embed: EmbedBuilder = new EmbedBuilder()
		.setTitle(PickRandomArrayItem(PARTICIPATE_PROMPT.titles))
		.setDescription(PARTICIPATE_PROMPT.description)
		.setColor("#c4dbff");

	const buttonRow: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder<ButtonBuilder>();

	buttonRow.setComponents(
		new ButtonBuilder()
			.setCustomId(YES_BUTTON_DATA.customId)
			.setLabel(PARTICIPATE_PROMPT.yesButtonLabel)
			.setStyle(ButtonStyle.Primary)
			.setEmoji(PARTICIPATE_PROMPT.yesButtonEmoji),

		new ButtonBuilder()
			.setCustomId(NO_BUTTON_DATA.customId)
			.setLabel(PARTICIPATE_PROMPT.noButtonLabel)
			.setStyle(ButtonStyle.Secondary)
			.setEmoji(PARTICIPATE_PROMPT.noButtonEmoji)
	);

	const prompt: MessageCreateOptions = {
		embeds: [embed],
		components: [buttonRow],
	};

	const server: Guild | undefined = readyClient.guilds.cache.get(poke.guildId)

	if (!server) {
		console.error("Can't find guild of poke")
		return prompt
	}

	let host: GuildMember

	try {
		host = await server.members.fetch(poke.hostUserId)
	} catch (error) {
		console.error("Can't find host")
		return prompt
	}

	embed.setAuthor({
		name: PARTICIPATE_PROMPT.authorNameTemplate.replace(TAGS.hostName, host.user.displayName),
		iconURL: host.user.avatarURL() || "https://cdn.discordapp.com/embed/avatars/5.png"
	})

	return prompt
}

// Every day, at 00:00 UTC-5 (Arch Time)
const CRON_TIME: string = "0 0 0 */1 * *";

/**
 * Creates a cronjob that when executed, will send a motivational message in the poke channel
 * along with a cool button prompt to let the host know people wanna do art today
 *
 * @param readyClient The now loaded bot
 */
export function Handle(readyClient: Client<true>) {
	const job: CronJob = CronJob.from({
		cronTime: CRON_TIME,
		utcOffset: -300,

		onTick: async function () {
			let pokes: HydratedDocument<IPokeDocument>[];

			try {
				pokes = await PokeModel.find();
			} catch (error) {
				console.error(error);
				return;
			}

			for (const poke of pokes) {
				const channel: Channel | undefined = readyClient.channels.cache.get(poke.channelId);

				if (!channel) {
					console.error("Couldn't find channel:", poke.channelId);
					continue;
				}

				if (!channel.isSendable()) {
					console.error("Can't send to channel:", poke.channelId);
					continue;
				}

				try {
					const prompt: MessageCreateOptions = await GetParticipatePrompt(readyClient, poke);

					await channel.send(prompt);
				} catch (error) {
					console.error(error);
					continue;
				}
			}
		},
	});

	job.start();
}
