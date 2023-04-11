import { Router } from "express";
import axios from 'axios';
const dataUrl = process.env.DATA_URL
const router = Router()

//api proxy reports
router.get('/top-rating', async (_,res)=>{
    await axios.get(`${dataUrl}/r/top-rating`)
    .then(result => {res.send(result.data)})
})
router.get('/most-popular', async (_,res)=>{
    await axios.get(`${dataUrl}/r/most-popular`, )
    .then(result => {res.send(result.data)})
})
router.get('/top-reviews/:id', async (req,res)=>{
    await axios.get(`${dataUrl}/r/top-reviews/${req.params.id}`)
    .then(result => {res.send(result.data)})
})

module.exports = router