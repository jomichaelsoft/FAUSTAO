"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONFIRMATION_MESSAGES = exports.TAGS = void 0;
exports.TAGS = {
    hostUserId: "%HOSTID%",
    participantName: "%PARTICIPANT%",
};
exports.CONFIRMATION_MESSAGES = {
    host: "AS **THE MANAGER** TOLD ME, THERE WILL BE A SESSION TODAY",
    participants: [
        `<@${exports.TAGS.hostUserId}>, **${exports.TAGS.participantName}** DESPERATELY WANTS A SESSION. WAKE UP`,
        `<@${exports.TAGS.hostUserId}>, **${exports.TAGS.participantName}** IS AVAILABLE FOR A SESSION TODAY`,
        `<@${exports.TAGS.hostUserId}>, **${exports.TAGS.participantName}**... NEEDS TO DRAW`,
    ],
};
