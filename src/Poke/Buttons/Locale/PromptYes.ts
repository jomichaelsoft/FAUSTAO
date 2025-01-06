export const TAGS = {
	hostId: "%HOSTID%",
	participantName: "%PARTICIPANT%",
};

export const CONFIRMATION_MESSAGES = {
	host: "AS **THE MANAGER** TOLD ME, THERE WILL BE A SESSION TODAY",
	participants: [
		`<@${TAGS.hostId}>, **${TAGS.participantName}** DESPERATELY WANTS A SESSION. WAKE UP`,
		`<@${TAGS.hostId}>, **${TAGS.participantName}** IS AVAILABLE FOR A SESSION TODAY`,
		`<@${TAGS.hostId}>, **${TAGS.participantName}**... NEEDS TO DRAW`,
	],
};
