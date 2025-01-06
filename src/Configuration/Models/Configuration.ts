import { Model, model, Schema, SchemaTypes } from "mongoose";

export interface IConfigurationDocument {
	guildId: string;
	hostRoleId: string;
	goalsChannelId: string;
}

export const ConfigurationSchema: Schema<IConfigurationDocument> = new Schema({
	guildId: {
		type: SchemaTypes.String,
		required: true,
		immutable: true,
	},

	hostRoleId: {
		type: SchemaTypes.String,
		required: true,
	},

	goalsChannelId: {
		type: SchemaTypes.String,
		required: true,
	},
});

export const ConfigurationModel: Model<IConfigurationDocument> = model("Configuration", ConfigurationSchema);
