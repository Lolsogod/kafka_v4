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
const app = (0, express_1.default)();
app.use(express_1.default.json());
const client = new kafka_node_1.default.KafkaClient({ kafkaHost: process.env.KAFKA_BOOTSTRAP_SERVERS });
const producer = new kafka_node_1.default.Producer(client);
console.log("-----------------------------------");
console.log(process.env.KAFKA_USER);
console.log("-----------------------------------");
producer.on('ready', () => __awaiter(void 0, void 0, void 0, function* () {
    app.post('/reg', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        producer.send([{ topic: "user",
                messages: JSON.stringify(req.body) }], (err, data) => __awaiter(void 0, void 0, void 0, function* () {
            if (err)
                console.log(err);
            else {
                res.send(req.body);
            }
        }));
    }));
    app.post('/movie', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('##########################################.');
        console.log("sent");
        console.log('##########################################.');
        producer.send([{ topic: "movie",
                messages: JSON.stringify(req.body) }], (err, data) => __awaiter(void 0, void 0, void 0, function* () {
            if (err)
                console.log(err);
            else {
                res.send(req.body);
            }
        }));
    }));
    app.post('/review', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        producer.send([{ topic: "review",
                messages: JSON.stringify(req.body) }], (err, data) => __awaiter(void 0, void 0, void 0, function* () {
            if (err)
                console.log(err);
            else {
                res.send(req.body);
            }
        }));
    }));
}));
app.listen(process.env.PORT);
