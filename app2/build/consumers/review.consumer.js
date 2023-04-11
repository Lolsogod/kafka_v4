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
exports.revConsumer = void 0;
const Movie_1 = require("../models/Movie");
const Review_1 = require("../models/Review");
const User_1 = require("../models/User");
const kafka_node_1 = __importDefault(require("kafka-node"));
const revConsumer = new kafka_node_1.default.ConsumerGroup({
    kafkaHost: process.env.KAFKA_BOOTSTRAP_SERVERS,
    groupId: 'reviews',
    fromOffset: 'earliest',
    autoCommit: true
}, process.env.KAFKA_REVIEW);
exports.revConsumer = revConsumer;
revConsumer.on('message', (message) => __awaiter(void 0, void 0, void 0, function* () {
    let parsed = JSON.parse(message.value.toString());
    parsed.author = yield User_1.User.findOne({ login: parsed.author });
    parsed.movie = yield Movie_1.Movie.findOne({ title: parsed.movie });
    const review = yield new Review_1.Review(parsed);
    try {
        yield review.save();
    }
    catch (e) {
        console.log(e);
    }
}));
revConsumer.on('error', (err) => {
    console.log(err);
});
