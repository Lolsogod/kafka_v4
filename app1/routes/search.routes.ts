import { Router } from "express";
import axios from 'axios';
import * as UserDto from '../dto/user.dto'
import * as MovieDto from '../dto/movies.dto'
import * as ReviewDto from '../dto/reviews.dto'

const dataUrl = process.env.DATA_URL
const router = Router()

//api proxy search
router.get('/users', async (req,res)=>{
    await axios.get(`${dataUrl}/s/users`, {
        params: {...UserDto.parseDTO(req.query)}, 
      }).then(result => {
        const userDTOs = result.data.map((user: any) => UserDto.toDTO(user));
        res.send(userDTOs)
      }).catch(e => res.send(e))
})
router.get('/movies', async (req,res)=>{
    await axios.get(`${dataUrl}/s/movies`, {
        params: {...MovieDto.parseDTO(req.query)}, 
      }).then(result => {
        const moviesDTOs = result.data.map((movie: any) => MovieDto.toDTO(movie));
        res.send(moviesDTOs)
      }).catch(e => res.send(e))
})
router.get('/reviews', async (req,res)=>{
    await axios.get(`${dataUrl}/s/reviews`, {
        params: {...ReviewDto.parseDTO(req.query)}, 
      }).then(result => {
        const reviewsDTOs = result.data.map((review: any) => ReviewDto.toDTO(review));
        res.send(reviewsDTOs)
      }).catch(e => res.send(e))
})

module.exports = router