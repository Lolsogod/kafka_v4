"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const kafka_node_1 = __importDefault(require("kafka-node"));
const mongoose_1 = require("mongoose");
const app = (0, express_1.default)();
app.use(express_1.default.json());
console.log("-----------------------------------");
console.log(process.env.KAFKA_USER);
console.log("-----------------------------------");
(0, mongoose_1.connect)(process.env.MONGO_URL || "mongodb://mongo:27017/app2");
const userSchema = new mongoose_1.Schema({
    mail: { type: String, required: true, unique: true },
    login: { type: String, required: true },
    password: { type: String, required: true }
});
const User = (0, mongoose_1.model)('user', userSchema);
const movieSchema = new mongoose_1.Schema({
    title: { type: String, required: true, unique: true },
    descr: { type: String, required: false },
    year: { type: Number, required: false }
});
const Movie = (0, mongoose_1.model)('movie', movieSchema);
const reviewSchema = new mongoose_1.Schema({
    author: { type: mongoose_1.Types.ObjectId, ref: 'user', required: true },
    movie: { type: mongoose_1.Types.ObjectId, ref: 'movie', required: true },
    rating: { type: Number, required: true },
    text: { type: String, required: false },
    likes: { type: Number, required: false }
});
const Review = (0, mongoose_1.model)('review', reviewSchema);
//user consumer
const client = new kafka_node_1.default.KafkaClient({ kafkaHost: process.env.KAFKA_BOOTSTRAP_SERVERS });
const userCons = new kafka_node_1.default.Consumer(client, [{ topic: "user", partition: 0 }], {
    groupId: 'group1'
});
console.log(process.env.KAFKA_USER || "user");
const movieCons = new kafka_node_1.default.Consumer(client, [{ topic: "movie", partition: 0 }], {
    groupId: 'group2'
});
const reviewCons = new kafka_node_1.default.Consumer(client, [{ topic: "review", partition: 0 }], {
    groupId: 'group3'
});
userCons.on('message', (message) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield new User(JSON.parse(message.value.toString()));
    try {
        yield user.save();
    }
    catch (e) {
        console.log(e);
    }
}));
userCons.on('error', (err) => {
    console.log(err);
});
//movie consumer
movieCons.on('message', (message) => __awaiter(void 0, void 0, void 0, function* () {
    const movie = yield new Movie(JSON.parse(message.value.toString()));
    console.log('##########################################.');
    console.log(message.value.toString());
    console.log('##########################################.');
    try {
        yield movie.save();
    }
    catch (e) {
        console.log(e);
    }
}));
movieCons.on('error', (err) => {
    console.log(err);
});
//review consumer
reviewCons.on('message', (message) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('##########################################');
    console.log(message.value.toString());
    console.log('##########################################');
    const review = yield new Review(JSON.parse(message.value.toString()));
    try {
        yield review.save();
    }
    catch (e) {
        console.log(e);
    }
}));
reviewCons.on('error', (err) => {
    console.log(err);
});
app.listen(process.env.PORT);
