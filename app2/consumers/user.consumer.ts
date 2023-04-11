import { User } from "../models/User";
import kafka from 'kafka-node';

const usrConsumer = new kafka.ConsumerGroup({
    kafkaHost: process.env.KAFKA_BOOTSTRAP_SERVERS,
    groupId: 'users',
    fromOffset: 'earliest',
    autoCommit: true
  }, process.env.KAFKA_USER!);

usrConsumer.on('message', async (message)=>{
    const user = await new User(JSON.parse(message.value.toString()))
    try{
        await user.save()  
    }catch(e) {console.log(e)} 
})

usrConsumer.on('error', (err)=>{
    console.log(err)
})

export {usrConsumer}