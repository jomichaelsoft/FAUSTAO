// prettier-ignore
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Channel, Client, EmbedBuilder, Message, MessageCreateOptions } from "discord.js";
import { CronJob } from "cron";
import { HydratedDocument } from "mongoose";
import { IPokeDocument, PokeModel } from "../../Models/Poke";
import { BUTTON_DATA as YES_BUTTON_DATA } from "../../Buttons/Data/PromptYes";
import { BUTTON_DATA as NO_BUTTON_DATA } from "../../Buttons/Data/PromptNo";

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
	const possibilities: Array<string> = [
		"LABOR IS VALUABLE.",
		"TENACITY IS YOUR ONLY WEAPON.",
		"FAUSTÃO'S CREATION WAS NOT IN VAIN.",
		"FAUSTÃO THINKS YOU LACK ENKEPHALIN.",
	];

	return {
		content: PickRandomArrayItem(possibilities),
	};
}

export const PROMPT_YES_TAG: string = "%YES%";
export const PROMPT_NO_TAG: string = "%NO%";
export const PROMPT_TEMPLATE: string = `SINNERS, SIMPLY CAST YOUR VOTE BELOW IF YOU'RE INTERESTED \n_ _\n**✅:**\n${PROMPT_YES_TAG}\n\n**❌:**\n${PROMPT_NO_TAG}`;

/**
 * @returns The message contents of our "people who want a session today"  list
 */
function GetParticipatePrompt(): MessageCreateOptions {
	const regex: RegExp = new RegExp(PROMPT_YES_TAG + "|" + PROMPT_NO_TAG, "g");
	const prompt: string = PROMPT_TEMPLATE.replace(regex, "...");

	const embed: EmbedBuilder = new EmbedBuilder()
		.setTitle("MUST WE COMMENCE ARTISTRY, MANAGER?")
		.setDescription(prompt)
		.setColor("#c4dbff");

	const buttonRow: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder();

	buttonRow.setComponents(
		new ButtonBuilder().setCustomId(YES_BUTTON_DATA.customId).setLabel("INTERESTED").setStyle(ButtonStyle.Primary),
		new ButtonBuilder().setCustomId(NO_BUTTON_DATA.customId).setLabel("FORFEIT").setStyle(ButtonStyle.Secondary)
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
