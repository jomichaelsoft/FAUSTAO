export const TAGS = {
	hostUserId: "%HOSTID%",
	participantName: "%PARTICIPANT%",
};

export const CONFIRMATION_MESSAGES = {
	host: "AS **THE MANAGER** TOLD ME, THERE WILL BE A SESSION TODAY",
	participants: [
		`<@${TAGS.hostUserId}>, **${TAGS.participantName}** DESPERATELY WANTS A SESSION. WAKE UP`,
		`<@${TAGS.hostUserId}>, **${TAGS.participantName}** IS AVAILABLE FOR A SESSION TODAY`,
		`<@${TAGS.hostUserId}>, **${TAGS.participantName}**... NEEDS TO DRAW`,
	],
};
