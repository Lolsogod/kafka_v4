import { Movie } from "../models/Movie";
import kafka from 'kafka-node';

const movConsumer = new kafka.ConsumerGroup({
    kafkaHost: process.env.KAFKA_BOOTSTRAP_SERVERS,
    groupId: 'movies',
    fromOffset: 'earliest',
    autoCommit: true
}, process.env.KAFKA_MOVIE!);

movConsumer.on('message', async (message)=>{
    const movie = await new Movie(JSON.parse(message.value.toString()))
    try{
        await movie.save()  
    }catch(e) {console.log(e)} 
  })
  movConsumer.on('error', (err)=>{
    console.log(err)
  })
export {movConsumer}