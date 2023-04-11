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
const Review_1 = require("../models/Review");
const mongoose_1 = require("mongoose");
const router = (0, express_1.Router)();
//report api
router.get('/top-rating', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let report = yield Review_1.Review.aggregate([
        {
            '$group': {
                '_id': '$movie',
                'rating': {
                    '$avg': '$rating'
                }
            }
        }, {
            '$lookup': {
                'from': 'movies',
                'localField': '_id',
                'foreignField': '_id',
                'as': 'movie_info'
            }
        }, {
            '$unwind': '$movie_info'
        }, {
            '$project': {
                '_id': 1,
                'title': '$movie_info.title',
                'rating': 1
            }
        }, {
            '$limit': 10
        }, {
            '$sort': {
                'rating': -1
            }
        }
    ]);
    res.send(report);
}));
router.get('/most-popular', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let report = yield Review_1.Review.aggregate([
        {
            '$group': {
                '_id': '$movie',
                'votes': {
                    '$count': {}
                }
            }
        }, {
            '$lookup': {
                'from': 'movies',
                'localField': '_id',
                'foreignField': '_id',
                'as': 'movie_info'
            }
        }, {
            '$unwind': '$movie_info'
        }, {
            '$project': {
                '_id': 1,
                'title': '$movie_info.title',
                'votes': 1
            }
        }, {
            '$limit': 10
        }, {
            '$sort': {
                'votes': -1
            }
        }
    ]);
    res.send(report);
}));
router.get('/top-reviews/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let report = yield Review_1.Review.aggregate([
        {
            '$match': {
                'movie': new mongoose_1.Types.ObjectId(req.params.id)
            }
        }, {
            '$lookup': {
                'from': 'movies',
                'localField': 'movie',
                'foreignField': '_id',
                'as': 'movie_info'
            }
        }, {
            '$lookup': {
                'from': 'users',
                'localField': 'author',
                'foreignField': '_id',
                'as': 'user_info'
            }
        }, {
            '$unwind': '$movie_info'
        }, {
            '$unwind': '$user_info'
        }, {
            '$project': {
                '_id': 1,
                'movie': '$movie_info.title',
                'author': '$user_info.login',
                'rating': 1,
                'text': 1,
                'likes': 1
            }
        }, {
            '$limit': 10
        }, {
            '$sort': {
                'likes': -1
            }
        }
    ]);
    res.send(report);
}));
module.exports = router;
