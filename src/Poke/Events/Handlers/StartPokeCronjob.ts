// prettier-ignore
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Channel, Client, EmbedBuilder, MessageCreateOptions } from "discord.js";
import { CronJob } from "cron";
import { HydratedDocument } from "mongoose";
import { IPokeDocument, PokeModel } from "../../Models/Poke";
import { BUTTON_DATA as YES_BUTTON_DATA } from "../../Buttons/Data/PromptYes";
import { BUTTON_DATA as NO_BUTTON_DATA } from "../../Buttons/Data/PromptNo";
import { PARTICIPATE_PROMPT } from "../Locale/StartPokeCronjob";
import { PickRandomArrayItem } from "../../../Core/Utility/Random";

/**
 * @returns A message saying the day begun and if there should be a session
 */
function GetParticipatePrompt(): MessageCreateOptions {
	const embed: EmbedBuilder = new EmbedBuilder()
		.setTitle(PickRandomArrayItem(PARTICIPATE_PROMPT.titles))
		.setDescription(PARTICIPATE_PROMPT.description)
		.setColor("#c4dbff");

	const buttonRow: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder();

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

	return {
		embeds: [embed],
		components: [buttonRow],
	};
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
					await channel.send(GetParticipatePrompt());
				} catch (error) {
					console.error(error);
				}
			}
		},
	});

	job.start();
}
