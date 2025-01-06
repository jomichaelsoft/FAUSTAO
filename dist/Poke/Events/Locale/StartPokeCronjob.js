"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PARTICIPATE_PROMPT = exports.TAGS = void 0;
exports.TAGS = {
    hostName: "%HOSTNAME%",
};
exports.PARTICIPATE_PROMPT = {
    titles: [
        "ARE YOU ALREADY EXHAUSTED, MANAGER?",
        "TENACITY IS YOUR ONLY WEAPON.",
        "FAUSTÃO'S CREATION WAS NOT IN VAIN.",
    ],
    authorNameTemplate: `wake your host up: [${exports.TAGS.hostName}]`,
    description: "🌙 `[As the dawn approaches, you wonder if there should be a session today]`",
    yesButtonLabel: "[ask the manager]",
    yesButtonEmoji: "⏰",
    noButtonLabel: "[forfeit]",
    noButtonEmoji: "⛔",
};
