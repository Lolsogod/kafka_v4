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
const mongoose_1 = require("mongoose");
const app = (0, express_1.default)();
app.use(express_1.default.json());
(0, mongoose_1.connect)(process.env.MONGO_URL || "mongodb://mongo:27017/app2");
const userSchema = new mongoose_1.Schema({
    mail: { type: String, required: true, unique: true },
    login: { type: String, required: true },
    password: { type: String, required: true }
});
const User = (0, mongoose_1.model)('user', userSchema);
const movieSchema = new mongoose_1.Schema({
    title: { type: String, required: true, unique: true },
    descr: { type: String, required: false },
    year: { type: Number, required: false }
});
const Movie = (0, mongoose_1.model)('movie', movieSchema);
const reviewSchema = new mongoose_1.Schema({
    author: { type: mongoose_1.Types.ObjectId, ref: 'user', required: true },
    movie: { type: mongoose_1.Types.ObjectId, ref: 'movie', required: true },
    rating: { type: Number, required: true },
    text: { type: String, required: false },
    likes: { type: Number, required: false }
});
reviewSchema.index({ author: 1, movie: 1 }, { unique: true });
const Review = (0, mongoose_1.model)('review', reviewSchema);
//user consumer
const consumer = new kafka_node_1.default.ConsumerGroup({
    kafkaHost: process.env.KAFKA_BOOTSTRAP_SERVERS,
    groupId: 'users',
    fromOffset: 'earliest',
    autoCommit: true
}, 'user');
const consumer2 = new kafka_node_1.default.ConsumerGroup({
    kafkaHost: process.env.KAFKA_BOOTSTRAP_SERVERS,
    groupId: 'movies',
    fromOffset: 'earliest',
    autoCommit: true
}, 'movie');
/*const consumer = new kafka.Consumer(client,
    [{topic: 'user'}],
    {autoCommit: true, groupId: 'group1'}
);
const consumer2 = new kafka.Consumer(client,
  [{topic: 'movie'}],
  {autoCommit: true, groupId: 'group2'}
);

consumer.on('message', async (message)=>{
    console.log("read......")
    if (message.topic == 'movie'){
        const movie = await new Movie(JSON.parse(message.value.toString()))
        try{
            await movie.save()
        }catch(e) {console.log(e)}
    }
    else if (message.topic == 'user'){
        const user = await new User(JSON.parse(message.value.toString()))
        try{
            await user.save()
        }catch(e) {console.log(e)}
    }
    else if (message.topic == 'review'){
        let parsed = JSON.parse(message.value.toString())
        parsed.author = await User.findOne({login: parsed.author})
        parsed.movie = await Movie.findOne({title: parsed.movie})
        const review = await new Review(parsed)
        try{
            await review.save()
        }catch(e) {console.log(e)}
    }
})*/
consumer.on('message', (message) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("usr read......");
    console.log(message.value);
}));
consumer2.on('message', (message) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("movie read......");
    console.log(message.value);
}));
consumer.on('error', (err) => {
    console.log(err);
});
consumer2.on('error', (err) => {
    console.log(err);
});
//search API
app.get('/s/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield User.find(req.query));
}));
app.get('/s/movies', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield Movie.find(req.query));
}));
app.get('/s/reviews', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield Review.find(req.query));
}));
//report api
app.get('/r/top-rating', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let report = yield Review.aggregate([
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
app.get('/r/most-popular', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let report = yield Review.aggregate([
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
app.get('/r/top-reviews/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let report = yield Review.aggregate([
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
app.listen(process.env.PORT);
