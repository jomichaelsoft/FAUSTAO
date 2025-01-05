"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokeModel = exports.PokeSchema = void 0;
const mongoose_1 = require("mongoose");
exports.PokeSchema = new mongoose_1.Schema({
    guildId: {
        type: mongoose_1.SchemaTypes.String,
        required: true,
        immutable: true,
    },
    hostId: {
        type: mongoose_1.SchemaTypes.String,
        required: true,
    },
    channelId: {
        type: mongoose_1.SchemaTypes.String,
        required: true,
    },
});
exports.PokeModel = (0, mongoose_1.model)("Poke", exports.PokeSchema);
