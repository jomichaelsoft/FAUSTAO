"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONFIRMATION_MESSAGES = exports.GOALS_MESSAGE = exports.TAGS = exports.EMOJIS = exports.ERROR_MESSAGES = void 0;
exports.ERROR_MESSAGES = {
    couldntFetchPreviousGoals: "**Error:** DISCORD FAILED TO FETCH YOUR PREVIOUS GOALS",
    cantFindGoalsChannel: "**Error:** ODDLY, THE GOALS CHANNEL IS UNAVAILABLE",
    goalsChannelUnsendable: "**Error:** I DO NOT POSSESS ACCESS TO THE GOALS CHANNEL",
    couldntSendMessage: "**Error:** DISCORD FAILED TO SEND YOUR MESSAGE",
};
exports.EMOJIS = {
    interviewer: "<:Interviewer:1325952553711697930>",
    intervewee: "<:Intervewee:1325952532006178847>",
};
exports.TAGS = {
    interactionUserId: "%INTERACTIONUSER%",
    objectives: "%OBJECTIVES%",
    inspirations: "%INSPIRATIONS%",
    dateNow: "%DATENOW%",
};
exports.GOALS_MESSAGE = {
    objectivesQuestionTemplate: `# **${exports.EMOJIS.interviewer}:** <@${exports.TAGS.interactionUserId}>, where are you headed?`,
    objectivesAnswerTemplate: `${exports.EMOJIS.intervewee}:\n\`\`\`\n${exports.TAGS.objectives}\n\`\`\``,
    inspirationQuestionTemplate: `## **${exports.EMOJIS.interviewer}:** and who inspires you the most rn?`,
    inspirationAnswerTemplate: `${exports.EMOJIS.intervewee}:\n\`\`\`\n${exports.TAGS.inspirations}\n\`\`\``,
    lastUpdatedTemplate: `\`Last updated: ${exports.TAGS.dateNow}\``,
};
exports.CONFIRMATION_MESSAGES = {
    goalsSubmitWorked: "YOUR GOALS HAVE SUCCESSFULLY BEEN RECORDED",
};
