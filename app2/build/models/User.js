"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    mail: { type: String, required: true, unique: true },
    login: { type: String, required: true },
    password: { type: String, required: true }
});
exports.User = (0, mongoose_1.model)('user', userSchema);
