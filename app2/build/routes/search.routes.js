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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = require("../models/User");
const Movie_1 = require("../models/Movie");
const Review_1 = require("../models/Review");
const router = (0, express_1.Router)();
//search API
router.get('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield User_1.User.find(req.query));
}));
router.get('/movies', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield Movie_1.Movie.find(req.query));
}));
router.get('/reviews', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield Review_1.Review.find(req.query));
}));
module.exports = router;
