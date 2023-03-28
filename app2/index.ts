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

app.listen(process.env.PORT)