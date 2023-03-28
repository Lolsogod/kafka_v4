import express, { response } from 'express';
import kafka from 'kafka-node';
import axios from 'axios';
const app = express()
app.use(express.json())
const dataUrl = process.env.DATA_URL || "http://loclhost:8081"

const client = new kafka.KafkaClient({kafkaHost: process.env.KAFKA_BOOTSTRAP_SERVERS})
const producer = new kafka.Producer(client)

console.log("-----------------------------------")
console.log(process.env.KAFKA_USER)
console.log("-----------------------------------")

producer.on('ready', async ()=>{
    app.post('/reg', async (req,res)=>{
        producer.send([{topic: "user",
            messages: JSON.stringify(req.body)}], async (err,data)=>{
                if (err) console.log(err)
                else{res.send(req.body)}
        })
    })
    app.post('/movie', async (req,res)=>{
        console.log('##########################################.')
        console.log("sent")
        console.log('##########################################.')
        producer.send([{topic: "movie",
            messages: JSON.stringify(req.body)}], async (err,data)=>{
                if (err) console.log(err)
                else{res.send(req.body)}
        })
    })
    app.post('/review', async (req,res)=>{
        producer.send([{topic: "review",
            messages: JSON.stringify(req.body)}], async (err,data)=>{
                if (err) console.log(err)
                else{res.send(req.body)}
        })
    })
})
//api proxy search
app.get('/s/users', async (req,res)=>{
    await axios.get(`${dataUrl}/s/users`, {
        params: {...req.query}, 
      }).then(result => {res.send(result.data)})
})
app.get('/s/movies', async (req,res)=>{
    await axios.get(`${dataUrl}/s/movies`, {
        params: {...req.query}, 
      }).then(result => {res.send(result.data)})
})
app.get('/s/reviews', async (req,res)=>{
    await axios.get(`${dataUrl}/s/reviews`, {
        params: {...req.query}, 
      }).then(result => {res.send(result.data)})
})
//api proxy reports
app.get('/r/top-rating', async (req,res)=>{
    await axios.get(`${dataUrl}/r/top-rating`)
    .then(result => {res.send(result.data)})
})
app.get('/r/most-popular', async (req,res)=>{
    await axios.get(`${dataUrl}/r/most-popular`, )
    .then(result => {res.send(result.data)})
})
app.get('/r/top-reviews/:id', async (req,res)=>{
    await axios.get(`${dataUrl}/r/top-reviews/${req.params.id}`)
    .then(result => {res.send(result.data)})
})
app.listen(process.env.PORT)