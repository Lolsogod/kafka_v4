"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const UserDto = __importStar(require("../dto/user.dto"));
const MovieDto = __importStar(require("../dto/movies.dto"));
const ReviewDto = __importStar(require("../dto/reviews.dto"));
const dataUrl = process.env.DATA_URL;
const router = (0, express_1.Router)();
//api proxy search
router.get('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield axios_1.default.get(`${dataUrl}/s/users`, {
        params: Object.assign({}, UserDto.parseDTO(req.query)),
    }).then(result => {
        const userDTOs = result.data.map((user) => UserDto.toDTO(user));
        res.send(userDTOs);
    }).catch(e => res.send(e));
}));
router.get('/movies', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield axios_1.default.get(`${dataUrl}/s/movies`, {
        params: Object.assign({}, MovieDto.parseDTO(req.query)),
    }).then(result => {
        const moviesDTOs = result.data.map((movie) => MovieDto.toDTO(movie));
        res.send(moviesDTOs);
    }).catch(e => res.send(e));
}));
router.get('/reviews', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield axios_1.default.get(`${dataUrl}/s/reviews`, {
        params: Object.assign({}, ReviewDto.parseDTO(req.query)),
    }).then(result => {
        const reviewsDTOs = result.data.map((review) => ReviewDto.toDTO(review));
        res.send(reviewsDTOs);
    }).catch(e => res.send(e));
}));
module.exports = router;
