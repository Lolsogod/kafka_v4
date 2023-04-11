
import { Router } from "express";
import { User } from "../models/User";
import { Movie } from "../models/Movie";
import { Review } from "../models/Review";

const router = Router()

//search API
router.get('/users', async (req,res)=>{
    res.send(await User.find(req.query))
})
router.get('/movies', async (req,res)=>{
    res.send(await Movie.find(req.query))
})
router.get('/reviews', async (req,res)=>{
    res.send(await Review.find(req.query))
})

module.exports = router