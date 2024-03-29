"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/r', require('./routes/reports.routes'));
app.use('/s', require('./routes/search.routes'));
app.use('/', require('./routes/kafka.routes'));
app.listen(process.env.PORT, () => { console.log("Producer service started"); });
