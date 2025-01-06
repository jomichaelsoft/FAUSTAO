export const TAGS = {
	hostName: "%HOSTNAME%",
};

export const PARTICIPATE_PROMPT = {
	titles: [
		"ARE YOU ALREADY EXHAUSTED, MANAGER?",
		"TENACITY IS YOUR ONLY WEAPON.",
		"FAUSTÃO'S CREATION WAS NOT IN VAIN.",
	],

	authorNameTemplate: `YOUR CURRENT MANAGER IS: \`[${TAGS.hostName}]\``,
	description: "🌙 `[As the dawn approaches, you wonder if there should be a session today]`",
	yesButtonLabel: "[ask the manager]",
	yesButtonEmoji: "⏰",
	noButtonLabel: "[forfeit]",
	noButtonEmoji: "⛔",
};