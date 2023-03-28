import express from 'express';
import kafka from 'kafka-node';
import { Schema, model, connect, ObjectId, Types } from 'mongoose';
const app = express()
app.use(express.json())


console.log("-----------------------------------")
console.log(process.env.KAFKA_USER)
console.log("-----------------------------------")
connect(process.env.MONGO_URL || "mongodb://mongo:27017/app2")
//user model
interface IUser {
    mail: String,
    login: String,
    password: String
}
const userSchema = new Schema<IUser>({
    mail: {type: String, required: true, unique: true},
    login: {type: String, required: true},
    password: {type: String, required: true}
})
const User = model<IUser>('user', userSchema);
//movie model
interface IMovie {
    title: String,
    descr?: String
    year?: number
}
const movieSchema = new Schema<IMovie>({
    title: {type: String, required: true, unique: true},
    descr: {type: String, required: false},
    year: {type: Number, required: false}
})
const Movie = model<IMovie>('movie', movieSchema);
//review model
interface IReview {
    author: string | ObjectId | IUser,
    movie: string | ObjectId | IMovie,
    rating: number,
    text?: string,
    likes?: number
}
const reviewSchema = new Schema<IReview>({
    author: {type: Types.ObjectId, ref: 'user', required: true},
    movie: {type: Types.ObjectId, ref: 'movie', required: true},
    rating: {type: Number, required: true},
    text: {type: String, required: false},
    likes: {type: Number, required: false}
})
reviewSchema.index({ author: 1, movie: 1}, { unique: true });
const Review = model<IReview>('review', reviewSchema);
//user consumer
const client = new kafka.KafkaClient({kafkaHost: process.env.KAFKA_BOOTSTRAP_SERVERS})
const consumer = new kafka.Consumer(client,
    [{topic: 'user'}, {topic: 'movie'}, {topic: 'review'}],
    {autoCommit: false}
);
consumer.on('message', async (message)=>{
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
})
consumer.on('error', (err)=>{
    console.log(err)
})

//search API
app.get('/s/users', async (req,res)=>{
    res.send(await User.find(req.query))
})
app.get('/s/movies', async (req,res)=>{
    res.send(await Movie.find(req.query))
})
app.get('/s/reviews', async (req,res)=>{
    res.send(await Review.find(req.query))
})
//report api
app.get('/r/top-rating', async (req,res)=>{
    let report = await Review.aggregate([
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
      ])
    res.send(report)
})
app.get('/r/most-popular', async (req,res)=>{
    let report = await Review.aggregate([
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
      ])
    res.send(report)
})
app.get('/r/top-reviews/:id', async (req,res)=>{
    let report = await Review.aggregate([
        {
          '$match': {
            'movie': new Types.ObjectId(req.params.id)
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
      ])
    res.send(report)
})
app.listen(process.env.PORT)