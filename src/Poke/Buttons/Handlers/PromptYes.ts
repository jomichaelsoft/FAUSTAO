import { ButtonInteraction } from "discord.js";

// 1. retrieve prompt message
// 2. edit it so it contains peoples usernames (i guess use a singleton to keep track of that)
// 3. reply
export function Handle(interaction: ButtonInteraction) {
	interaction.message.edit("asd")
}
