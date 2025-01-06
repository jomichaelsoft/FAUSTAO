"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROMPT_TEMPLATE = exports.PROMPT_NO_TAG = exports.PROMPT_YES_TAG = void 0;
exports.Handle = Handle;
// prettier-ignore
const discord_js_1 = require("discord.js");
const cron_1 = require("cron");
const Poke_1 = require("../../Models/Poke");
const PromptYes_1 = require("../../Buttons/Data/PromptYes");
const PromptNo_1 = require("../../Buttons/Data/PromptNo");
/**
 * @param array Where to pick from
 * @returns A random value picked from `array`
 */
function PickRandomArrayItem(array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array.at(randomIndex);
}
/**
 * @returns The motivational message
 */
function GetMotivationalMessage() {
    const possibilities = [
        "LABOR IS VALUABLE.",
        "TENACITY IS YOUR ONLY WEAPON.",
        "FAUSTÃO'S CREATION WAS NOT IN VAIN.",
        "FAUSTÃO THINKS YOU LACK ENKEPHALIN.",
    ];
    return {
        content: PickRandomArrayItem(possibilities),
    };
}
exports.PROMPT_YES_TAG = "%YES%";
exports.PROMPT_NO_TAG = "%NO%";
exports.PROMPT_TEMPLATE = `SINNERS, SIMPLY CAST YOUR VOTE BELOW IF YOU'RE INTERESTED \n_ _\n**✅:**\n${exports.PROMPT_YES_TAG}\n\n**❌:**\n${exports.PROMPT_NO_TAG}`;
/**
 * @returns The message contents of our "people who want a session today"  list
 */
function GetParticipatePrompt() {
    const regex = new RegExp(exports.PROMPT_YES_TAG + "|" + exports.PROMPT_NO_TAG, "g");
    const prompt = exports.PROMPT_TEMPLATE.replace(regex, "...");
    const embed = new discord_js_1.EmbedBuilder()
        .setTitle("MUST WE COMMENCE ARTISTRY, MANAGER?")
        .setDescription(prompt)
        .setColor("#c4dbff");
    const buttonRow = new discord_js_1.ActionRowBuilder();
    buttonRow.setComponents(new discord_js_1.ButtonBuilder().setCustomId(PromptYes_1.BUTTON_DATA.customId).setLabel("INTERESTED").setStyle(discord_js_1.ButtonStyle.Primary), new discord_js_1.ButtonBuilder().setCustomId(PromptNo_1.BUTTON_DATA.customId).setLabel("FORFEIT").setStyle(discord_js_1.ButtonStyle.Secondary));
    return {
        embeds: [embed],
        components: [buttonRow],
    };
}
// Every day, at 00:00 UTC-5 (Arch Time)
// TODO: REPLACE WITH "0 0 0 */1 * *"
const CRON_TIME = "*/10 * * * * *";
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
                    const motivationalMessage = await channel.send(GetMotivationalMessage());
                    motivationalMessage.reply(GetParticipatePrompt());
                }
                catch (error) {
                    console.error(error);
                }
            }
        },
    });
    job.start();
}
