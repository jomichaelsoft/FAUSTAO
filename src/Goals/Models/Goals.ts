import { Model, model, Schema, SchemaTypes } from "mongoose";

export interface IGoalsDocument {
	guildId: string;
	userId: string;
	messageId: string;
	objectives: string;
	inspirations: string;
}

export const GoalsSchema: Schema<IGoalsDocument> = new Schema({
	guildId: {
		type: SchemaTypes.String,
		required: true,
		immutable: true,
	},

	userId: {
		type: SchemaTypes.String,
		required: true,
		immutable: true,
	},

	messageId: {
		type: SchemaTypes.String,
		required: true,
	},

	objectives: {
		type: SchemaTypes.String,
		required: true,
	},

	inspirations: {
		type: SchemaTypes.String,
		required: true,
	},
});

export const GoalsModel: Model<IGoalsDocument> = model("Goals", GoalsSchema);
