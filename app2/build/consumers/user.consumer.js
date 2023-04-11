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
exports.usrConsumer = void 0;
const User_1 = require("../models/User");
const kafka_node_1 = __importDefault(require("kafka-node"));
const usrConsumer = new kafka_node_1.default.ConsumerGroup({
    kafkaHost: process.env.KAFKA_BOOTSTRAP_SERVERS,
    groupId: 'users',
    fromOffset: 'earliest',
    autoCommit: true
}, process.env.KAFKA_USER);
exports.usrConsumer = usrConsumer;
usrConsumer.on('message', (message) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield new User_1.User(JSON.parse(message.value.toString()));
    try {
        yield user.save();
    }
    catch (e) {
        console.log(e);
    }
}));
usrConsumer.on('error', (err) => {
    console.log(err);
});
