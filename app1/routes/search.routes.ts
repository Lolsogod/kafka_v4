import { Router } from "express";
import axios from 'axios';
const dataUrl = process.env.DATA_URL
const router = Router()

//api proxy search
router.get('/users', async (req,res)=>{
    await axios.get(`${dataUrl}/s/users`, {
        params: {...req.query}, 
      }).then(result => {res.send(result.data)})
})
router.get('/movies', async (req,res)=>{
    await axios.get(`${dataUrl}/s/movies`, {
        params: {...req.query}, 
      }).then(result => {res.send(result.data)})
})
router.get('/reviews', async (req,res)=>{
    await axios.get(`${dataUrl}/s/reviews`, {
        params: {...req.query}, 
      }).then(result => {res.send(result.data)})
})

module.exports = router