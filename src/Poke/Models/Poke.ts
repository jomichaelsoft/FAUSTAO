import { Model, model, Schema, SchemaTypes } from "mongoose";

export interface IPokeDocument {
	guildId: string;
	hostId: string;
	channelId: string;
}

export const PokeSchema: Schema<IPokeDocument> = new Schema({
	guildId: {
		type: SchemaTypes.String,
		required: true,
		immutable: true,
	},

	hostId: {
		type: SchemaTypes.String,
		required: true,
	},

	channelId: {
		type: SchemaTypes.String,
		required: true,
	},
});

export const PokeModel: Model<IPokeDocument> = model("Poke", PokeSchema);
