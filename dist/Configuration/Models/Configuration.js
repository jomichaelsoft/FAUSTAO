"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationModel = exports.ConfigurationSchema = void 0;
const mongoose_1 = require("mongoose");
exports.ConfigurationSchema = new mongoose_1.Schema({
    guildId: {
        type: mongoose_1.SchemaTypes.String,
        required: true,
        immutable: true,
    },
    hostRoleId: {
        type: mongoose_1.SchemaTypes.String,
        required: true,
    },
    goalsChannelId: {
        type: mongoose_1.SchemaTypes.String,
        required: true,
    },
});
exports.ConfigurationModel = (0, mongoose_1.model)("Configuration", exports.ConfigurationSchema);
