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
reviewSchema.index({ author: 1, movie: 1 }, { unique: true });
const Review = (0, mongoose_1.model)('review', reviewSchema);
//user consumer
const client = new kafka_node_1.default.KafkaClient({ kafkaHost: process.env.KAFKA_BOOTSTRAP_SERVERS });
const consumer = new kafka_node_1.default.Consumer(client, [{ topic: 'user' }, { topic: 'movie' }, { topic: 'review' }], { autoCommit: false });
consumer.on('message', (message) => __awaiter(void 0, void 0, void 0, function* () {
    if (message.topic == 'movie') {
        const movie = yield new Movie(JSON.parse(message.value.toString()));
        try {
            yield movie.save();
        }
        catch (e) {
            console.log(e);
        }
    }
    else if (message.topic == 'user') {
        const user = yield new User(JSON.parse(message.value.toString()));
        try {
            yield user.save();
        }
        catch (e) {
            console.log(e);
        }
    }
    else if (message.topic == 'review') {
        let parsed = JSON.parse(message.value.toString());
        parsed.author = yield User.findOne({ login: parsed.author });
        parsed.movie = yield Movie.findOne({ title: parsed.movie });
        const review = yield new Review(parsed);
        try {
            yield review.save();
        }
        catch (e) {
            console.log(e);
        }
    }
}));
consumer.on('error', (err) => {
    console.log(err);
});
//search API
app.get('/s/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield User.find(req.body));
}));
app.get('/s/movies', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield Movie.find(req.body));
}));
app.get('/s/reviews', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield Review.find(req.body));
}));
app.listen(process.env.PORT);
