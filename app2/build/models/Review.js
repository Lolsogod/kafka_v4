"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Review = void 0;
const mongoose_1 = require("mongoose");
const reviewSchema = new mongoose_1.Schema({
    author: { type: mongoose_1.Types.ObjectId, ref: 'user', required: true },
    movie: { type: mongoose_1.Types.ObjectId, ref: 'movie', required: true },
    rating: { type: Number, required: true },
    text: { type: String, required: false },
    likes: { type: Number, required: false }
});
reviewSchema.index({ author: 1, movie: 1 }, { unique: true });
exports.Review = (0, mongoose_1.model)('review', reviewSchema);
