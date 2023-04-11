import { Movie } from "../models/Movie";
import { Review } from "../models/Review";
import { User } from "../models/User";
import kafka from 'kafka-node';

const revConsumer = new kafka.ConsumerGroup({
    kafkaHost: process.env.KAFKA_BOOTSTRAP_SERVERS,
    groupId: 'reviews',
    fromOffset: 'earliest',
    autoCommit: true
  }, process.env.KAFKA_REVIEW!);
  

revConsumer.on('message', async (message)=>{
    let parsed = JSON.parse(message.value.toString())
    parsed.author = await User.findOne({login: parsed.author})
    parsed.movie = await Movie.findOne({title: parsed.movie})
    const review = await new Review(parsed)
    try{
        await review.save()  
    }catch(e) {console.log(e)}  
})

revConsumer.on('error', (err)=>{
    console.log(err)
})

export {revConsumer}