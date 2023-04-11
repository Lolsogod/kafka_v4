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
const express_1 = require("express");
const kafka_node_1 = __importDefault(require("kafka-node"));
const client = new kafka_node_1.default.KafkaClient({ kafkaHost: process.env.KAFKA_BOOTSTRAP_SERVERS });
const usrProducer = new kafka_node_1.default.Producer(client);
const movProducer = new kafka_node_1.default.Producer(client);
const revProducer = new kafka_node_1.default.Producer(client);
const router = (0, express_1.Router)();
usrProducer.on('ready', () => __awaiter(void 0, void 0, void 0, function* () {
    router.post('/reg', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        usrProducer.send([{ topic: process.env.KAFKA_USER,
                messages: JSON.stringify(req.body) }], (err) => __awaiter(void 0, void 0, void 0, function* () {
            if (err)
                console.log(err);
            else {
                res.send(req.body);
            }
        }));
    }));
}));
movProducer.on('ready', () => __awaiter(void 0, void 0, void 0, function* () {
    router.post('/movie', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        usrProducer.send([{ topic: process.env.KAFKA_MOVIE,
                messages: JSON.stringify(req.body) }], (err) => __awaiter(void 0, void 0, void 0, function* () {
            if (err)
                console.log(err);
            else {
                res.send(req.body);
            }
        }));
    }));
}));
revProducer.on('ready', () => __awaiter(void 0, void 0, void 0, function* () {
    router.post('/review', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        revProducer.send([{ topic: process.env.KAFKA_REVIEW,
                messages: JSON.stringify(req.body) }], (err) => __awaiter(void 0, void 0, void 0, function* () {
            if (err)
                console.log(err);
            else {
                res.send(req.body);
            }
        }));
    }));
}));
module.exports = router;
