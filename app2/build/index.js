"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = require("mongoose");
const user_consumer_1 = require("./consumers/user.consumer");
const movie_consumer_1 = require("./consumers/movie.consumer");
const review_consumer_1 = require("./consumers/review.consumer");
const app = (0, express_1.default)();
(0, mongoose_1.connect)(process.env.MONGO_URL);
app.use(express_1.default.json());
app.use('/r', require('./routes/reports.routes'));
app.use('/s', require('./routes/search.routes'));
//consumers init
const usrCons = user_consumer_1.usrConsumer;
const movCons = movie_consumer_1.movConsumer;
const revCons = review_consumer_1.revConsumer;
app.listen(process.env.PORT);
