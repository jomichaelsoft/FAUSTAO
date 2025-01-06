export const ERROR_MESSAGES = {
	cantFindGoalsChannel: "**Error:** ODDLY, THE GOALS CHANNEL IS UNAVAILABLE",
	goalsChannelUnsendable: "**Error:** I DO NOT POSSESS ACCESS TO THE GOALS CHANNEL",
	couldntSendMessage: "**Error:** DISCORD FAILED TO SEND YOUR MESSAGE",
};

export const EMOJIS = {
	interviewer: "<:Interviewer:1325928868401512653>",
	intervewee: "<:Intervewee:1325928935195938878>",
};

export const TAGS = {
	interactionUserId: "%INTERACTIONUSER%",
	objectives: "%OBJECTIVES%",
	inspirations: "%INSPIRATIONS%",
	dateNow: "%DATENOW%",
};

export const GOALS_MESSAGE = {
	objectivesQuestionTemplate: `# **${EMOJIS.interviewer}:** <@${TAGS.interactionUserId}>, where are you headed?`,
	objectivesAnswerTemplate: `${EMOJIS.intervewee}:\n\`\`\`\n${TAGS.objectives}\n\`\`\``,
	inspirationQuestionTemplate: `## **${EMOJIS.interviewer}:** and who inspires you the most rn?`,
	inspirationAnswerTemplate: `${EMOJIS.intervewee}:\n\`\`\`\n${TAGS.inspirations}\n\`\`\``,
	lastUpdatedTemplate: `\`Last updated: ${TAGS.dateNow}\``,
};

export const CONFIRMATION_MESSAGES = {
	goalsSubmitWorked: "YOUR GOALS HAVE SUCCESSFULLY BEEN RECORDED",
};
