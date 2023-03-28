import express from 'express';
import kafka from 'kafka-node';
const app = express()
app.use(express.json())

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

app.listen(process.env.PORT)