"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalsModel = exports.GoalsSchema = void 0;
const mongoose_1 = require("mongoose");
exports.GoalsSchema = new mongoose_1.Schema({
    guildId: {
        type: mongoose_1.SchemaTypes.String,
        required: true,
        immutable: true,
    },
    userId: {
        type: mongoose_1.SchemaTypes.String,
        required: true,
        immutable: true,
    },
    messageId: {
        type: mongoose_1.SchemaTypes.String,
        required: true,
    },
    objectives: {
        type: mongoose_1.SchemaTypes.String,
        required: true,
    },
    inspirations: {
        type: mongoose_1.SchemaTypes.String,
        required: true,
    },
});
exports.GoalsModel = (0, mongoose_1.model)("Goals", exports.GoalsSchema);
