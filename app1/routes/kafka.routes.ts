import { Router } from "express";
import kafka from 'kafka-node';
import * as UserDto from '../dto/user.dto'
import * as MovieDto from '../dto/movies.dto'
import * as ReviewDto from '../dto/reviews.dto'

const client = new kafka.KafkaClient({kafkaHost: process.env.KAFKA_BOOTSTRAP_SERVERS})
const usrProducer = new kafka.Producer(client)
const movProducer = new kafka.Producer(client)
const revProducer = new kafka.Producer(client)
const router = Router()

usrProducer.on('ready', async ()=>{
    router.post('/reg', async (req,res)=>{
        usrProducer.send([{topic: process.env.KAFKA_USER!,
            messages: JSON.stringify(UserDto.parseDTOadd(req.body))}], async (err)=>{
                if (err) console.log(err)
                else{res.send(req.body)}
        })
    })
})
movProducer.on('ready', async ()=>{
    router.post('/movie', async (req,res)=>{
        usrProducer.send([{topic: process.env.KAFKA_MOVIE!,
            messages: JSON.stringify(MovieDto.parseDTOadd(req.body))}], async (err)=>{
                if (err) console.log(err)
                else{res.send(req.body)}
        })
    })
})
revProducer.on('ready', async ()=>{
    router.post('/review', async (req,res)=>{
        revProducer.send([{topic: process.env.KAFKA_REVIEW!,
            messages: JSON.stringify(ReviewDto.parseDTOadd(req.body))}], async (err)=>{
                if (err) console.log(err)
                else{res.send(req.body)}
        })
    })
})

module.exports = router