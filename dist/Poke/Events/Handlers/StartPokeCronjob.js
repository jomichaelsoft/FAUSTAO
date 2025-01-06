"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Handle = Handle;
// prettier-ignore
const discord_js_1 = require("discord.js");
const cron_1 = require("cron");
const Poke_1 = require("../../Models/Poke");
const PromptYes_1 = require("../../Buttons/Data/PromptYes");
const PromptNo_1 = require("../../Buttons/Data/PromptNo");
const StartPokeCronjob_1 = require("../Locale/StartPokeCronjob");
const Random_1 = require("../../../Core/Utility/Random");
/**
 * @returns A message saying the day begun and if there should be a session
 */
function GetParticipatePrompt() {
    const embed = new discord_js_1.EmbedBuilder()
        .setTitle((0, Random_1.PickRandomArrayItem)(StartPokeCronjob_1.PARTICIPATE_PROMPT.titles))
        .setDescription(StartPokeCronjob_1.PARTICIPATE_PROMPT.description)
        .setColor("#c4dbff");
    const buttonRow = new discord_js_1.ActionRowBuilder();
    buttonRow.setComponents(new discord_js_1.ButtonBuilder()
        .setCustomId(PromptYes_1.BUTTON_DATA.customId)
        .setLabel(StartPokeCronjob_1.PARTICIPATE_PROMPT.yesButtonLabel)
        .setStyle(discord_js_1.ButtonStyle.Primary)
        .setEmoji(StartPokeCronjob_1.PARTICIPATE_PROMPT.yesButtonEmoji), new discord_js_1.ButtonBuilder()
        .setCustomId(PromptNo_1.BUTTON_DATA.customId)
        .setLabel(StartPokeCronjob_1.PARTICIPATE_PROMPT.noButtonLabel)
        .setStyle(discord_js_1.ButtonStyle.Secondary)
        .setEmoji(StartPokeCronjob_1.PARTICIPATE_PROMPT.noButtonEmoji));
    return {
        embeds: [embed],
        components: [buttonRow],
    };
}
// Every day, at 00:00 UTC-5 (Arch Time)
const CRON_TIME = "0 0 0 */1 * *";
/**
 * Creates a cronjob that when executed, will send a motivational message in the poke channel
 * along with a cool button prompt to let the host know people wanna do art today
 *
 * @param readyClient The now loaded bot
 */
function Handle(readyClient) {
    const job = cron_1.CronJob.from({
        cronTime: CRON_TIME,
        utcOffset: -300,
        onTick: async function () {
            let pokes;
            try {
                pokes = await Poke_1.PokeModel.find();
            }
            catch (error) {
                console.error(error);
                return;
            }
            for (const poke of pokes) {
                const channel = readyClient.channels.cache.get(poke.channelId);
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
                }
                catch (error) {
                    console.error(error);
                }
            }
        },
    });
    job.start();
}
