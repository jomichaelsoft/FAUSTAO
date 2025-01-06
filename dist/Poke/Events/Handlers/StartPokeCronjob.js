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
// prettier-ignore
/**
 * @returns A message saying the day begun and if there should be a session
 */
async function GetParticipatePrompt(readyClient, poke) {
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
    const prompt = {
        embeds: [embed],
        components: [buttonRow],
    };
    const server = readyClient.guilds.cache.get(poke.guildId);
    if (!server) {
        console.error("Can't find guild of poke");
        return prompt;
    }
    let host;
    try {
        host = await server.members.fetch(poke.hostUserId);
    }
    catch (error) {
        console.error("Can't find host");
        return prompt;
    }
    embed.setAuthor({
        name: StartPokeCronjob_1.PARTICIPATE_PROMPT.authorNameTemplate.replace(StartPokeCronjob_1.TAGS.hostName, host.user.displayName),
        iconURL: host.user.avatarURL() || "https://cdn.discordapp.com/embed/avatars/5.png"
    });
    return prompt;
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
                    const prompt = await GetParticipatePrompt(readyClient, poke);
                    await channel.send(prompt);
                }
                catch (error) {
                    console.error(error);
                    continue;
                }
            }
        },
    });
    job.start();
}
