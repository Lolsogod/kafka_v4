import axios from 'axios'
import express from 'express';

const app = express()
const dataUrl = process.env.DATA_URL

let open = false

app.get('/check', async (req, res)=>{
    if (open) res.status(500).send("circuit broken")
    else res.status(200).send("ok")
})

const circuitBreker = () =>{
    axios.get(`${dataUrl}/heartbeat`).then(() => {
        open = false
      }).catch(() => open = true)
}

setInterval(()=>{circuitBreker()},3000);

app.listen(process.env.PORT, ()=>{console.log("Circuit breaker started.")})