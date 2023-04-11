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
const axios_1 = __importDefault(require("axios"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const dataUrl = process.env.DATA_URL;
const client = new kafka_node_1.default.KafkaClient({ kafkaHost: process.env.KAFKA_BOOTSTRAP_SERVERS });
const usrProducer = new kafka_node_1.default.Producer(client);
const movProducer = new kafka_node_1.default.Producer(client);
const revProducer = new kafka_node_1.default.Producer(client);
usrProducer.on('ready', () => __awaiter(void 0, void 0, void 0, function* () {
    app.post('/reg', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        usrProducer.send([{ topic: process.env.KAFKA_USER,
                messages: JSON.stringify(req.body) }], (err, data) => __awaiter(void 0, void 0, void 0, function* () {
            if (err)
                console.log(err);
            else {
                res.send(req.body);
            }
        }));
    }));
}));
movProducer.on('ready', () => __awaiter(void 0, void 0, void 0, function* () {
    app.post('/movie', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        usrProducer.send([{ topic: process.env.KAFKA_MOVIE,
                messages: JSON.stringify(req.body) }], (err, data) => __awaiter(void 0, void 0, void 0, function* () {
            if (err)
                console.log(err);
            else {
                res.send(req.body);
            }
        }));
    }));
}));
revProducer.on('ready', () => __awaiter(void 0, void 0, void 0, function* () {
    app.post('/review', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        revProducer.send([{ topic: process.env.KAFKA_REVIEW,
                messages: JSON.stringify(req.body) }], (err, data) => __awaiter(void 0, void 0, void 0, function* () {
            if (err)
                console.log(err);
            else {
                res.send(req.body);
            }
        }));
    }));
}));
//api proxy search
app.get('/s/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield axios_1.default.get(`${dataUrl}/s/users`, {
        params: Object.assign({}, req.query),
    }).then(result => { res.send(result.data); });
}));
app.get('/s/movies', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield axios_1.default.get(`${dataUrl}/s/movies`, {
        params: Object.assign({}, req.query),
    }).then(result => { res.send(result.data); });
}));
app.get('/s/reviews', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield axios_1.default.get(`${dataUrl}/s/reviews`, {
        params: Object.assign({}, req.query),
    }).then(result => { res.send(result.data); });
}));
//api proxy reports
app.get('/r/top-rating', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield axios_1.default.get(`${dataUrl}/r/top-rating`)
        .then(result => { res.send(result.data); });
}));
app.get('/r/most-popular', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield axios_1.default.get(`${dataUrl}/r/most-popular`)
        .then(result => { res.send(result.data); });
}));
app.get('/r/top-reviews/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield axios_1.default.get(`${dataUrl}/r/top-reviews/${req.params.id}`)
        .then(result => { res.send(result.data); });
}));
app.listen(process.env.PORT);
