// prettier-ignore
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Channel, Client, EmbedBuilder, Message, MessageCreateOptions } from "discord.js";
import { CronJob } from "cron";
import { HydratedDocument } from "mongoose";
import { IPokeDocument, PokeModel } from "../../Models/Poke";
import { BUTTON_DATA as YES_BUTTON_DATA } from "../../Buttons/Data/PromptYes";
import { BUTTON_DATA as NO_BUTTON_DATA } from "../../Buttons/Data/PromptNo";
import { MOTIVATIONAL_MESSAGES, PARTICIPATE_PROMPT, TAGS } from "../Locale/StartPokeCronjob";

/**
 * @param array Where to pick from
 * @returns A random value picked from `array`
 */
function PickRandomArrayItem(array: Array<any>): any {
	const randomIndex: number = Math.floor(Math.random() * array.length);
	return array.at(randomIndex);
}

/**
 * @returns The motivational message
 */
function GetMotivationalMessage(): MessageCreateOptions {
	return {
		content: PickRandomArrayItem(MOTIVATIONAL_MESSAGES),
	};
}

/**
 * @returns The message contents of our "people who want a session today"  list
 */
function GetParticipatePrompt(): MessageCreateOptions {
	const regex: RegExp = new RegExp(TAGS.promptYes + "|" + TAGS.promptNo, "g");
	const prompt: string = PARTICIPATE_PROMPT.template.replace(regex, "...");

	const embed: EmbedBuilder = new EmbedBuilder()
		.setTitle(PARTICIPATE_PROMPT.embedTitle)
		.setDescription(prompt)
		.setColor("#c4dbff");

	const buttonRow: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder();

	buttonRow.setComponents(
		new ButtonBuilder()
			.setCustomId(YES_BUTTON_DATA.customId)
			.setLabel(PARTICIPATE_PROMPT.yesButtonLabel)
			.setStyle(ButtonStyle.Primary),

		new ButtonBuilder()
			.setCustomId(NO_BUTTON_DATA.customId)
			.setLabel(PARTICIPATE_PROMPT.noButtonLabel)
			.setStyle(ButtonStyle.Secondary)
	);

	return {
		embeds: [embed],
		components: [buttonRow],
	};
}

// Every day, at 00:00 UTC-5 (Arch Time)
// TODO: REPLACE WITH "0 0 0 */1 * *"
const CRON_TIME: string = "*/10 * * * * *";

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
					const motivationalMessage: Message = await channel.send(GetMotivationalMessage());

					motivationalMessage.reply(GetParticipatePrompt());
				} catch (error) {
					console.error(error);
				}
			}
		},
	});

	job.start();
}
