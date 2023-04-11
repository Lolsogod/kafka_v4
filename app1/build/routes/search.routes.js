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
const axios_1 = __importDefault(require("axios"));
const dataUrl = process.env.DATA_URL;
const router = (0, express_1.Router)();
//api proxy search
router.get('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield axios_1.default.get(`${dataUrl}/s/users`, {
        params: Object.assign({}, req.query),
    }).then(result => { res.send(result.data); });
}));
router.get('/movies', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield axios_1.default.get(`${dataUrl}/s/movies`, {
        params: Object.assign({}, req.query),
    }).then(result => { res.send(result.data); });
}));
router.get('/reviews', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield axios_1.default.get(`${dataUrl}/s/reviews`, {
        params: Object.assign({}, req.query),
    }).then(result => { res.send(result.data); });
}));
module.exports = router;
