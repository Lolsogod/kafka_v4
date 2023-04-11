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
exports.movConsumer = void 0;
const Movie_1 = require("../models/Movie");
const kafka_node_1 = __importDefault(require("kafka-node"));
const movConsumer = new kafka_node_1.default.ConsumerGroup({
    kafkaHost: process.env.KAFKA_BOOTSTRAP_SERVERS,
    groupId: 'movies',
    fromOffset: 'earliest',
    autoCommit: true
}, process.env.KAFKA_MOVIE);
exports.movConsumer = movConsumer;
movConsumer.on('message', (message) => __awaiter(void 0, void 0, void 0, function* () {
    const movie = yield new Movie_1.Movie(JSON.parse(message.value.toString()));
    yield movie.save().catch(e => console.log(e));
}));
movConsumer.on('error', (err) => {
    console.log(err);
});
